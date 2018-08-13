/*
 * TV Simulator '99
 * @Author: zshall 
 * @Date: 2017-05-02 22:34:58 
 * @Last Modified by: zshall
 * @Last Modified time: 2017-05-03 00:31:21
 */

 class TV {
    constructor(maxWidth = 1200, maxHeight = 1000, warmupTime = 3000, firstStart = true) {
        this.maxWidth = maxWidth;
        this.maxHeight = maxHeight;
        this.warmupTime = warmupTime;
        this.firstStart = firstStart;

        // jQuery variables
        this.vTv = $('.tv');

        this.vAbout = $('.about');
        this.vScreen = $('.screen');
        this.vMessagesBottomLeft = $('#tvm-bottom-left');
        this.vMessagesTopRight = $('#tvm-top-right');
        this.vCurrentChannel = $('.current-channel');

        this.btnAbout = $('#about-button');
        this.btnMute = $('#mute-button');
        this.btnChannelUp = $('#channel-up-button');
        this.btnChannelDown = $('#channel-down-button');

        this.classes = {
            Channel12,
            Channel59
        };
    }

    startUp() {
        $(document).ready(() => {
            if( !Helpers.isMobile().any() ){
                $(window).resize(() => {
                    this.handleResize();
                });
                this.vScreen.addClass('scanlines');
            }
        
            this.handleResize();
            
            // about
            this.btnAbout.click(() => {
                this.vAbout.toggle();
            })
            this.vAbout.toggle();
        
            // other TV buttons
            this.btnMute.click(() => {
                this.toggleMute();
            });

            this.btnChannelDown.click(() => {
                this.channelDown();
            });

            this.btnChannelUp.click(() => {
                this.channelUp();
            });
            
            document.addEventListener('youtubeReady',() => {
                // initialize listings grid
                $.ajax({
                    type: 'GET',
                    url: 'data/guide.xml',
                    dataType: 'xml',
                    complete: (data, status) => {
                        this.guideData = $($.parseXML(data.responseText));
                        this.watchableChannels = $.map(this.guideData.find('channel[watchable]'), (x) => {
                            return parseInt($(x).attr('number'));
                        });
                        this.watchableChannels.sort();
                        var defaultChannel = parseInt(this.guideData.find('channel[watchable][default]').attr('number'));
                        if (undefined != defaultChannel && null != defaultChannel) {
                            this.showChannel(defaultChannel);
                        }
                    }
                });
            });
        
            YouTubeApi.loadYouTubeAPI();
        });
        
     }

    showChannel(number, callback) {
        if (number === this.currentChannelNumber) {
            return;
        }

        if (this.channel) {
            this.channel.teardown();
        }

        this.vMessagesTopRight.css('opacity', '0');
        this.vCurrentChannel.css('opacity', '0').attr('id', `ch-${number}`).load(`channels/${Helpers.padLeft(number, 3)}/layout.html`, () => {
            this.channel = new this.classes['Channel' + number](this.vCurrentChannel, this.guideData);
            this.channel.show();
            $('.current-channel, #tvm-top-right').animate({opacity: 1}, this.firstStart ? this.warmupTime : this.warmupTime / 10, 0, () => {
                this.channel.ready();
            });
            this.vMessagesTopRight.text(Helpers.padLeft(number, 2));
            setTimeout(() => {
                this.vMessagesTopRight.text('');
            }, 4000);
            this.firstStart = false;
        });
        this.currentChannelNumber = number;
    }

    channelUp() {
        this.showChannel(Helpers.nextGreaterElement(this.watchableChannels, this.currentChannelNumber));
    }

    channelDown() {
        this.showChannel(Helpers.nextLesserElement(this.watchableChannels, this.currentChannelNumber));
    }

    toggleMute() {
        this.muted = YouTubeApi.toggleMuteVideo(this.channel.player);
        this.afterMute();
    }

    unmute() {
        this.toggleMute(false);
        this.afterMute();
    }

    mute() {
        this.toggleMute(true);
        this.afterMute();
    }

    afterMute() {
        if (this.muted) {
            this.vMessagesBottomLeft.text('MUTING');
        } else {
            this.vMessagesBottomLeft.text('');
        }
    }

    // http://stackoverflow.com/a/18751691/970180
    handleResize() {
        let $window = $(window);
        let width = $window.width();
        let height = $window.height();
        let scale;

        // early exit
        if(width >= this.maxWidth && this.height >= this.maxHeight) {
            this.vTv.css({'transform': ''});
            return;
        }

        scale = Math.min(width/this.maxWidth, height/this.maxHeight);

        this.vTv.css({'transform': 'scale(' + scale + ')'});
    }
}