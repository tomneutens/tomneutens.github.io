window.onload = function () {


    MediaStreamTrack.getSources(function (sourceInfos) {
        var videoSources = [];

        for (var i = 0; i != sourceInfos.length; ++i) {
            var sourceInfo = sourceInfos[i];
            if (sourceInfo.kind === 'video') {
                console.log("found video source");
                console.log(sourceInfo);
                videoSources.push(sourceInfo.id);
            } else {
                console.log('Some other kind of source: ', sourceInfo);
            }
        }

        selectSource(videoSources);
    });

    function selectSource(videoSources) {
        for (var i = 0; i < videoSources.length; ++i) {
            console.log(videoSources[i]);
        }
        $('#reader').html5_qrcode(function (data) {
            if (menu_open) {
                alert(data);
                scrollToAnchor(data);
                animateMenu();
            }
        }, function (error) {
            // alert(error);
        }, function (videoError) {
            //the video stream could be opened
            alert("video stream could be opened");
        }, videoSources[videoSources.length-1]
        );
    }

    var menu_open = false;



    $("#scan_button").click(function () {
        animateMenu();
    });

    function animateMenu() {
        if (!menu_open) {
            menu_open = true;
            $(".scan_menu").animate(
                    {
                        top: '+=300'
                    });
        } else {
            menu_open = false;
            $(".scan_menu").animate(
                    {
                        top: '-=300'
                    });
        }
    }

    function scrollToAnchor(aid) {
        var aTag = $("#" + aid);
        $('html,body').animate({scrollTop: aTag.offset().top}, 'slow');
    }

};