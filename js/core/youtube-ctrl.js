var tag = document.createElement('script');

tag.src = "https://www.youtube.com/iframe_api";
var firstScriptTag = document.getElementsByTagName('script')[0];
firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

// This function creates an <iframe> (and YouTube player)
//    after the API code downloads.
var player;
function onYouTubeIframeAPIReady() {
        player = new YT.Player('ytplayer', {
            height: '360',
            width: '425',
            videoId: 'oemoqEuJdFE',
            events: {
            'onReady': onPlayerReady,
            'onStateChange': onPlayerStateChange
        },
        playerVars: { 
        'autoplay': 1,
        'controls': 0, 
        'rel' : 0
        }
    });
}

// The API will call this function when the video player is ready.
function onPlayerReady(event) {
    event.target.playVideo();
}

// Te API calls this function when the player's state changes.
//    The function indicates that when playing a video (state=1),
//    the player should play for six seconds and then stop.
var done = false;
function onPlayerStateChange(event) {
    if (event.data == YT.PlayerState.PLAYING && !done) {
        //setTimeout(stopVideo, 6000);
        console.log('Playing...');
        done = true;
    }
}

function stopVideo() {
    player.stopVideo();
}

function muteVideo() {
    if (player.isMuted()) player.unMute();
    else player.mute();
    return !player.isMuted();
}