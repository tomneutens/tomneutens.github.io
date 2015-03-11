window.onload = function () {

    var menu_open = false;

    $('#reader').html5_qrcode(function (data) {
        if (menu_open){
            alert(data);
            scrollToAnchor(data);
            animateMenu();
        }
    },function (error) {
        // alert(error);
    }, function (videoError) {
        //the video stream could be opened
        alert("video stream could be opened");
    }
    );

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