/*
 * @Author: various
 * @Date: 2017-05-02 22:35:50 
 * @Last Modified by: zshall
 */
class Helpers {
    // http://stackoverflow.com/a/18508235/970180
    static isMobile() {
        return {
            Android: function () {
                return navigator.userAgent.match(/Android/i);
            },
            BlackBerry: function () {
                return navigator.userAgent.match(/BlackBerry/i);
            },
            iOS: function () {
                return navigator.userAgent.match(/iPhone|iPad|iPod/i);
            },
            Opera: function () {
                return navigator.userAgent.match(/Opera Mini/i);
            },
            Windows: function () {
                return navigator.userAgent.match(/IEMobile/i);
            },
            any: function () {
                return (this.Android() || this.BlackBerry() || this.iOS() || this.Opera() || this.Windows());
            }
        }
    }

    // http://stackoverflow.com/a/5367656/970180
    static padLeft(nr, n, str) {
        return Array(n - String(nr).length + 1).join(str || '0') + nr;
    }

    static loadScript(scriptUrl) {
        return new Promise((resolve, reject) => {
            let scr = document.createElement('script');
            scr.type = "text/javascript";
            scr.src = scriptUrl;
            document.getElementsByTagName('head')[0].appendChild(scr);
            scr.onload = (() => {
                resolve();
            });
            scr.onerror = () => reject(Error('Error loading ' + globalName || scriptUrl));
        });
    }
}