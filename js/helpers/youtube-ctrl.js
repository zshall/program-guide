function loadYouTubeAPI() {
    var YouTubeAPIScript = document.createElement('script');

    YouTubeAPIScript.src = "https://www.youtube.com/iframe_api";
    var firstScriptTag = document.getElementsByTagName('script')[0];
    firstScriptTag.parentNode.insertBefore(YouTubeAPIScript, firstScriptTag);
}

// This function creates an <iframe> (and YouTube player)
//    after the API code downloads.
var player;

// The API will call this function when the video player is ready.
function onPlayerReady(event) {
    event.target.playVideo();
}

// Te API calls this function when the player's state changes.
//    The function indicates that when playing a video (state=1),
//    the player should play for six seconds and then stop.
function onPlayerStateChange(event) {
    if (event.data == YT.PlayerState.PLAYING) {
        console.log('Playing...');
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