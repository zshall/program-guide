/**
 * TV Simulator '99
 * Zach Hall, 2017
 */
const maxWidth = 1200;
const maxHeight = 1000;

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
    if( !Helpers.isMobile().any() ){
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
            window.guideData = $($.parseXML(data.responseText));
            window.channel = new Channel12($('#ch-12'), window.guideData);
            channel.load();
        }
    });
});