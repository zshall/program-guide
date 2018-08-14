/**
 * YouTube API
 */
class YouTubeApi {
    static async loadYouTubeAPI() {
        await Helpers.loadScript("https://www.youtube.com/iframe_api");
    }

    static restartVideo(player) {
        YouTubeApi.stopVideo(player);
        player.playVideo();
    }

    static stopVideo(player) {
        player.stopVideo();
    }

    static pauseVideo(player) {
        player.pauseVideo();
    }

    static togglePlaying(player) {
        if (player.getPlayerState() === 1) {
            player.pauseVideo();
        } else {
            player.playVideo();
        }
    }

    static toggleMuteVideo(player) {
        if (!player) {
            return false;
        } else if (player.isMuted()) {
            player.unMute();
        } else {
            player.mute();
        }

        return !player.isMuted();
    }

    static muteVideo(player) {
        player.mute();
    }

    static unmuteVideo(player) {
        player.unMute();
    }
}

/**
 * Loading the default channel relies on the YouTube API being ready
 */
function onYouTubeIframeAPIReady() {
    document.dispatchEvent(new CustomEvent('youtubeReady', {}));
}