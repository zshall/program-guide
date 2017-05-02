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
    };
    static x() {
        return 'y';
    }
}