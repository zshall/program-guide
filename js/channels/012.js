/*
 * @Author: zshall 
 * @Date: 2017-05-02 22:34:46 
 * @Last Modified by: zshall
 */
class Channel12 extends Channel {
    constructor(container, guideData) {
        super(container, guideData);
        this.curTsStart = 19;
        // ads
        this.adList = [];
        this.currentAd = 0;
        this.adInterval = null;
    }

    show() {
        super.show();

        this.player = new YT.Player('ytplayer', {
            height: '360',
            width: '425',
            videoId: 'oemoqEuJdFE',
            events: {
            'onReady': this.onPlayerReady,
            'onStateChange': this.onPlayerStateChange
            },
            playerVars: { 
                'autoplay': 1,
                'controls': 0, 
                'rel' : 0
            }
        });

        // marquee
        this.marquee = $('marquee').marquee();

        // marquee just messes with everything, even this new JS version. replaces all my references to container stuff with new ones
        // gotta redeclare here
        this.listingGrid = this.container.find('#listing-grid');
        this.videoLeft = this.container.find('.video-left');
        this.videoRight = this.container.find('.video-right');

        this.textLeft = this.videoLeft.find('.inner-box');

        // top of table
        this.realtime = this.container.find('.realtime');
        this.timePlus00 = this.container.find('.time-plus00');
        this.timePlus30 = this.container.find('.time-plus30');
        this.timePlus60 = this.container.find('.time-plus60');
        this.date = this.container.find('.date');

        this.intervals.timeInterval = setInterval(() => {
            this.realtime.text(moment().format('h:mm:ss'));
            this.timePlus00.text(moment().startOf('hour').format('h:mm A'));
            this.timePlus30.text(moment().startOf('hour').minutes(30).format('h:mm A'));
            this.timePlus60.text(moment().startOf('hour').add(1, 'hours').format('h:mm A'));
            this.date.text(moment().format('dddd MMMM D YYYY'));
        }, 1000);

        this.listingGrid.empty();
        
        guideData.find('channel').each((i, channel) => {
            const ch = $(channel);
            // channel notices
            const notices = $(ch.find('notice'));
            $(notices).each((i, notice) => {
                const noticeRow = $('<tr>');
                noticeRow.append($('<td>').addClass('notice').attr('colspan', 4).html($(notice).html()));
                this.listingGrid.append(noticeRow);
            });
            
            if (ch.attr('noticeonly')) return;
            const channelRow = $('<tr>');
            
            const channelBox = $('<td>').addClass('channel');
            channelBox.append($('<div>').addClass('number').text(ch.attr('number')));
            channelBox.append($('<div>').addClass('station').text(ch.attr('name')));
            channelRow.append(channelBox);
            
            const listings = $(ch.find('listing'));
            
            let listing1 = $(this.getFirstListing(listings, this.curTsStart));
            let listing2 = $(this.getFirstListing(listings, this.curTsStart+1));
            let listing3 = $(this.getFirstListing(listings, this.curTsStart+2));
            
            if (!listing1) {
                listing1 = $('<listing>').html('Off-Air');
            }
            let showTwo = listing2 ? true : false;
            if (listing1) showTwo = listing2 ? listing1.attr('timeslot') !== listing2.attr('timeslot') : false;
            let showThree = listing3 ? true : false;
            if (listing2) showThree = listing3 ? listing2.attr('timeslot') !== listing3.attr('timeslot') : false;
            
            if (showTwo) {
                channelRow.append(this.generateListing(listing1));
                if (!showThree) {
                    channelRow.append(this.generateListing(listing2, 2));
                } else {
                    channelRow.append(this.generateListing(listing2));
                    channelRow.append(this.generateListing(listing3));
                }
            } else {
                if (!showThree) {
                    channelRow.append(this.generateListing(listing1, 3));
                } else {
                    channelRow.append(this.generateListing(listing1, 2));
                    channelRow.append(this.generateListing(listing3));
                }
            }
            
            this.listingGrid.append(channelRow);
        });

        // ads
        guideData.find('ad').each((i, ad) => {
            this.adList.push($(ad).html());
        });

        if (this.adList.length > 0) {
            this.textLeft.html(this.adList[0]);
        }

        this.adInterval = setInterval(() => {
            this.nextAd();
        }, 30000);
    }

    generateListing(listing, colspan, timeslot) {
        const html = $('<td>').addClass('listing').html(listing.html());
        if (colspan) html.attr('colspan', colspan);
        if (listing.attr('type') === 'movie') html.addClass('movie');
        return html;
    }

    getFirstListing(listings, timeslot) {
        var out;
        var listingTss = $.map(listings, (listing) => {
            return parseInt($(listing).attr('timeslot'));
        });
        
        for(var i = timeslot; i > -1; i--) {
            var index = $.inArray(i, listingTss);
            if (index !== -1) {
                out = listings[index];
                break;
            }
        }
        
        return out;
    }

    nextAd() {
        if (this.adList.length <= 1) return;

        this.textLeft.fadeOut(() => {
            this.timeouts.nextAd = setTimeout(() => {
                if (this.currentAd+1 >= this.adList.length) {
                    this.currentAd = 0;
                } else {
                    this.currentAd++;
                }
                this.textLeft.html(this.adList[this.currentAd]);
                this.textLeft.fadeIn();
            }, 750);
        });
    }

    // YouTube
    // The API will call this function when the video player is ready.
    onPlayerReady(event) {
        tv.mute();
        event.target.playVideo();
    }

    // Te API calls this function when the player's state changes.
    //    The function indicates that when playing a video (state=1),
    //    the player should play for six seconds and then stop.
    onPlayerStateChange(event) {
        if (event.data == YT.PlayerState.PLAYING) {
            console.log('Playing...');
        }
    }

    teardown() {
        this.marquee.trigger('stop');
        super.teardown();
    }
}