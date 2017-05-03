/*
 * @Author: various
 * @Date: 2017-05-02 22:35:50 
 * @Last Modified by: zshall
 * @Last Modified time: 2017-05-02 23:02:03
 */
class Helpers {
    // http://stackoverflow.com/a/18508235/970180
    static isMobile() {
        return {
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
                return (this.Android() ||this.BlackBerry() || this.iOS() || this.Opera() || this.Windows());
            }
        }
    }

    // http://stackoverflow.com/a/5367656/970180
    static padLeft(nr, n, str) {
        return Array(n-String(nr).length+1).join(str||'0')+nr;
    }
}