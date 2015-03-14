// QRCODE reader Copyright 2011 Lazar Laszlo
// http://www.webqr.com

var gCtx = null;
var gCanvas = null;
var c = 0;
var gUM = false;
var webkit = false;
var moz = false;
var v = null;
var menu_open = false;
var videoSources = [];
var videoSource = null;
var currentSourceIndex = 0;

var vidhtml = '<video id="v" width="300" height="300" autoplay></video>';

//var readerContainer = document.getElementById("reader_container");
//readerContainer.onclick = nextSource;

function initCanvas(w, h)
{
    gCanvas = document.getElementById("qr-canvas");
    gCanvas.style.width = w + "px";
    gCanvas.style.height = h + "px";
    gCanvas.width = w;
    gCanvas.height = h;
    gCtx = gCanvas.getContext("2d");
    gCtx.clearRect(0, 0, w, h);
}

function nextSource(){
    currentSourceIndex = (currentSourceIndex++)%videoSources.lenght;
    videoSource = videoSources[currentSourceIndex];
    setwebcam();
}

function getVideoSources(){
    MediaStreamTrack.getSources(function (sourceInfos) {

        var environmentCamera = null;
        for (var i = 0; i !== sourceInfos.length; ++i) {
            var sourceInfo = sourceInfos[i];
            if (sourceInfo.kind === 'video') {
                if (sourceInfo.facing === "environment")
                    environmentCamera = sourceInfo.id;
                console.log("found video source");
                console.log(sourceInfo);
                videoSources.push(sourceInfo.id);
            } else {
                console.log('Some other kind of source: ', sourceInfo);
            }
        }
        if (environmentCamera !== null){
            videoSource = environmentCamera;
        }else{
            videoSource = videoSources[0];
        }
        
        load();
    });
}

function captureToCanvas() {
    if (gUM)
    {
        if (menu_open) {
            try {
                gCtx.drawImage(v, 0, 0, 300, 300);
                try {
                    qrcode.decode();
                }
                catch (e) {
                    console.log(e);
                    setTimeout(captureToCanvas, 500);
                }
                ;
            }
            catch (e) {
                console.log(e);
                setTimeout(captureToCanvas, 500);
            }
            ;
        }
        setTimeout(captureToCanvas, 500);
    }
}

function htmlEntities(str) {
    return String(str).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

function read(data)
{
    //hier komt de code die opgeroepen wordt als er een code gescand is
    //a is de data die werd gescand
    //alert(data);
    scrollToAnchor(data);
    animateMenu(); 
}

function isCanvasSupported() {
    var elem = document.createElement('canvas');
    return !!(elem.getContext && elem.getContext('2d'));
}
function success(stream) {
    if (webkit) {
        v.src = window.webkitURL.createObjectURL(stream);
    } else if (moz) {
        v.mozSrcObject = stream;
        v.play();
    } else {
        v.src = stream;
    }
    gUM = true;
    setTimeout(captureToCanvas, 500);
}

function error(error) {
    gUM = false;
    return;
}

function load()
{
    if (isCanvasSupported() && videoSource !== null)
    {
        initCanvas(800, 600);
        qrcode.callback = read;
        setwebcam();
    }
}

function setwebcam()
{
    var n = navigator;
    document.getElementById("reader").innerHTML = vidhtml;
    v = document.getElementById("v");


    //stelt het lezen van de video stream in
    if (n.getUserMedia) {
        n.getUserMedia({video: {mandatory:{maxHeight:320, maxWidth:240},optional:[{sourceId:videoSource}]}, audio: false, width:300, height:300}, success, error);
    } else if (n.webkitGetUserMedia) {
        webkit = true;
        n.webkitGetUserMedia({video: {mandatory:{maxHeight:320, maxWidth:240},optional:[{sourceId:videoSource}]}, audio: false, width:300, height:300, sourceId:videoSource}, success, error);
    } else if (n.mozGetUserMedia) {
        moz = true;
        n.mozGetUserMedia({video: {mandatory:{maxHeight:320, maxWidth:240},optional:[{sourceId:videoSource}]}, audio: false, width:300, height:300, sourceId:videoSource}, success, error);
    }
}

$("#scan_button").click(function () {
    animateMenu();
});

function animateMenu() {
    if (!menu_open) {
        menu_open = true;
        $(".scan_menu").animate(
                {
                    top: '+=400'
                });
    } else {
        menu_open = false;
        $(".scan_menu").animate(
                {
                    top: '-=400'
                });
    }
}

function scrollToAnchor(aid) {
    var aTag = $("#" + aid);
    $('html,body').animate({scrollTop: aTag.offset().top}, 'slow');
}

