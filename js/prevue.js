var guideData;
var curTsStart = 19;
var listingGrid;

$(document).ready(() => {
    $('marquee').marquee();
    listingGrid = $('#listing-grid');
    setInterval(() => {
        $('.realtime').text(moment().format('h:mm:ss'));
        $('.time-plus00').text(moment().startOf('hour').format('h:mm A'));
        $('.time-plus30').text(moment().startOf('hour').minutes(30).format('h:mm A'));
        $('.time-plus60').text(moment().startOf('hour').add(1, 'hours').format('h:mm A'));
    });
    
    $('#about-button').click(() => {
        $('.about').toggle();
    })
    $('.about').toggle();
    $.ajax({
        type: 'GET',
        url: 'data/guide.xml',
        dataType: 'xml',
        complete: (data, status) => {
            listingGrid.empty();
            console.log('DONE');
            console.log(data);
            guideData = $($.parseXML(data.responseText));
            console.log(guideData);
            
            guideData.find('channel').each((i, channel) => {
                var ch = $(channel);
                var channelRow = $('<tr>');
                
                var channelBox = $('<td>').addClass('channel');
                channelBox.append($('<div>').addClass('number').text(ch.attr('number')));
                channelBox.append($('<div>').addClass('station').text(ch.attr('name')));
                channelRow.append(channelBox);
                
                var listings = $(ch.find('listing'));
                
                var listing1 = $(getFirstListing(listings, curTsStart));
                var listing2 = $(getFirstListing(listings, curTsStart+1));
                var listing3 = $(getFirstListing(listings, curTsStart+2));
                
                var showOne = listing1 ? true : false;
                var showTwo = listing2 ? true : false;
                if (listing1) showTwo = listing2 ? listing1.attr('timeslot') !== listing2.attr('timeslot') : false;
                var showThree = listing3 ? true : false;
                if (listing2) showThree = listing3 ? listing2.attr('timeslot') !== listing3.attr('timeslot') : false;
                
                var firstOne = !showOne ? "Off-Air" : listing1[0].innerHTML;
                
                if (showTwo) {
                    channelRow.append($('<td>').addClass('listing').text(firstOne));
                    if (!showThree) {
                        channelRow.append($('<td>').addClass('listing').attr('colspan', 2).text(listing2[0].innerHTML));
                    } else {
                        channelRow.append($('<td>').addClass('listing').text(listing2[0].innerHTML));
                        channelRow.append($('<td>').addClass('listing').text(listing3[0].innerHTML));
                    }
                } else {
                    if (!showThree) {
                        channelRow.append($('<td>').addClass('listing').attr('colspan', 3).text(firstOne));
                    } else {
                        channelRow.append($('<td>').addClass('listing').attr('colspan', 2).text(firstOne));
                        channelRow.append($('<td>').addClass('listing').text(listing3[0].innerHTML));
                    }
                }
                
                listingGrid.append(channelRow);
            });
        }
    });
});

function getFirstListing(listings, timeslot) {
    var out;
    var listingTss = $.map(listings, (listing) => {
        return parseInt($(listing).attr('timeslot'));
    });
    
    for(var i = timeslot; i > -1; i--) {
        var index = $.inArray(i, listingTss);
        if (index !== -1) {
            out = listings[index];
            break;
        }
    }
    
    return out;
}