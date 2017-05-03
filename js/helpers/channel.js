/*
 * @Author: zshall 
 * @Date: 2017-05-02 21:49:19 
 * @Last Modified by:   zshall 
 * @Last Modified time: 2017-05-02 21:49:19 
 */
class Channel {
    constructor(container, guideData) {
        this.container = container;
        this.guideData = guideData;
    }
    
    show() {
        console.log('Showing channel');
    }

    teardown() {
        console.log('Tearing down');
    }
}