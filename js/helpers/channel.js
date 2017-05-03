/*
 * @Author: zshall 
 * @Date: 2017-05-02 21:49:19 
 * @Last Modified by: zshall
 * @Last Modified time: 2017-05-02 22:05:13
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
        this.container.empty();
        this.container.attr('id', '');
    }
}