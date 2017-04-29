/**
 * TV Simulator '99
 * Zach Hall, 2017
 */
var guideData;
var curTsStart = 19;
var listingGrid;
const maxWidth = 1200;
const maxHeight = 1000;

// http://stackoverflow.com/a/18508235/970180
const isMobile = {
    Android: function() {
        return navigator.userAgent.match(/Android/i);
    },
    BlackBerry: function() {
        return navigator.userAgent.match(/BlackBerry/i);
    },
    iOS: function() {
        return navigator.userAgent.match(/iPhone|iPad|iPod/i);
    },
    Opera: function() {
        return navigator.userAgent.match(/Opera Mini/i);
    },
    Windows: function() {
        return navigator.userAgent.match(/IEMobile/i);
    },
    any: function() {
        return (isMobile.Android() || isMobile.BlackBerry() || isMobile.iOS() || isMobile.Opera() || isMobile.Windows());
    }
};

// http://stackoverflow.com/a/18751691/970180
function handleResize() {
    var $window = $(window);
    var width = $window.width();
    var height = $window.height();
    var scale;

    // early exit
    if(width >= maxWidth && height >= maxHeight) {
        $('.tv').css({'transform': ''});
        return;
    }

    scale = Math.min(width/maxWidth, height/maxHeight);

    $('.tv').css({'transform': 'scale(' + scale + ')'});
}

$(document).ready(() => {
    $('marquee').marquee();
    listingGrid = $('#listing-grid');
    setInterval(() => {
        $('.realtime').text(moment().format('h:mm:ss'));
        $('.time-plus00').text(moment().startOf('hour').format('h:mm A'));
        $('.time-plus30').text(moment().startOf('hour').minutes(30).format('h:mm A'));
        $('.time-plus60').text(moment().startOf('hour').add(1, 'hours').format('h:mm A'));
        $('.date').text(moment().format('dddd MMMM D YYYY'));
    });

    if( !isMobile.any() ){
        $(window).resize(function() {
            handleResize();
        });
        $('.screen').addClass('scanlines');
    }

    handleResize();
    
    // about
    $('#about-button').click(() => {
        $('.about').toggle();
    })
    $('.about').toggle();

    // other TV buttons
    $('#tv-mute').click(() => {
        const muted = muteVideo();
        if (muted) {
            $('#tvm-bottom-left').text('MUTING');
        } else {
            $('#tvm-bottom-left').text('');
        }
    });

    // initialize listings grid
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
                
                if (!listing1) {
                    listing1 = $('<listing>').html('Off-Air');
                }
                var showTwo = listing2 ? true : false;
                if (listing1) showTwo = listing2 ? listing1.attr('timeslot') !== listing2.attr('timeslot') : false;
                var showThree = listing3 ? true : false;
                if (listing2) showThree = listing3 ? listing2.attr('timeslot') !== listing3.attr('timeslot') : false;
                
                if (showTwo) {
                    channelRow.append(generateListing(listing1));
                    if (!showThree) {
                        channelRow.append(generateListing(listing2, 2));
                    } else {
                        channelRow.append(generateListing(listing2));
                        channelRow.append(generateListing(listing3));
                    }
                } else {
                    if (!showThree) {
                        channelRow.append(generateListing(listing1, 3));
                    } else {
                        channelRow.append(generateListing(listing1, 2));
                        channelRow.append(generateListing(listing3));
                    }
                }
                
                listingGrid.append(channelRow);
            });
        }
    });
});

function generateListing(listing, colspan, timeslot) {
    const html = $('<td>').addClass('listing').html(listing.html());
    if (colspan) html.attr('colspan', colspan);
    if (listing.attr('type') === 'movie') html.addClass('movie');
    return html;
}

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