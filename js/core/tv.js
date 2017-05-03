/*
 * TV Simulator '99
 * @Author: zshall 
 * @Date: 2017-05-02 22:34:58 
 * @Last Modified by: zshall
 * @Last Modified time: 2017-05-03 00:31:21
 */
const maxWidth = 1200;
const maxHeight = 1000;
const warmupTime = 3000;
var firstStart = true;
const classes = {
    Channel12
};

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
    
    loadYouTubeAPI();
});

function onYouTubeIframeAPIReady() {
    // initialize listings grid
    $.ajax({
        type: 'GET',
        url: 'data/guide.xml',
        dataType: 'xml',
        complete: (data, status) => {
            window.guideData = $($.parseXML(data.responseText));
            var defaultChannel = guideData.find('channel[watchable][default]').attr('number');
            if (undefined != defaultChannel && null != defaultChannel) {
                showChannel(defaultChannel);
            }
        }
    });
}

function showChannel(number, callback) {
    if (window.channel) {
        window.channel.teardown();
    }
    $('#tvm-top-right').css('opacity', '0');
    $('.current-channel').css('opacity', '0').attr('id', `ch-${number}`).load(`channels/${Helpers.padLeft(number, 3)}/channel.html`, () => {
        window.channel = new classes['Channel' + number]($('.current-channel'), window.guideData);
        channel.show();
        $('.current-channel, #tvm-top-right').animate({opacity: 1}, firstStart ? warmupTime : warmupTime / 10);
        $('#tvm-top-right').text(Helpers.padLeft(number, 2));
        setTimeout(() => {
            $('#tvm-top-right').text('');
        }, 4000);
        firstStart = false;
    });
}

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