/*
 * @Author: zshall 
 * @Date: 2017-05-02 21:49:19 
 * @Last Modified by: zshall
 */
class Channel {
    constructor(container, guideData) {
        this.container = container;
        this.guideData = guideData;
        this.timeouts = {};
        this.intervals = {};
    }
    
    show() {
        console.log('Showing channel');
    }

    teardown() {
        console.log('Tearing down');
        for (var i in this.timeouts) {
            clearTimeout(this.timeouts[i]);
        }
        for (var i in this.intervals) {
            clearInterval(this.intervals[i]);
        }
        if (this.player) {
            YouTubeApi.stopVideo(this.player);
        }
        this.container.empty();
        this.container.attr('id', '');
    }
}