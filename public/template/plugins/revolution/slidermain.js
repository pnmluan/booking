var tpj = jQuery;
tpj(document).ready(function() {

    $(".fullwidthbanner ul li").css('display','block');
    if (tpj.fn.cssOriginal != undefined) tpj.fn.css = tpj.fn.cssOriginal;
    var api = tpj('.fullwidthbanner').revolution({
        delay: 8000,
        startwidth: 600,
        startheight: 384,
        onHoverStop: "off",
        thumbWidth: 100,
        thumbHeight: 50,
        thumbAmount: 3,
        hideThumbs: 0,
        navigationType: "bullet",
        navigationArrows: "solo",
        navigationStyle: "round",
        navigationHAlign: "center",
        navigationVAlign: "bottom",
        navigationHOffset: 30,
        navigationVOffset: 20,
        soloArrowLeftHalign: "left",
        soloArrowLeftValign: "center",
        soloArrowLeftHOffset: 0,
        soloArrowLeftVOffset: 0,
        soloArrowRightHalign: "right",
        soloArrowRightValign: "center",
        soloArrowRightHOffset: 0,
        soloArrowRightVOffset: 0,
        touchenabled: "on",
        stopAtSlide: -1,
        stopAfterLoops: -1,
        hideCaptionAtLimit: 0,
        hideAllCaptionAtLilmit: 0,
        hideSliderAtLimit: 0,
        fullWidth: "on",
        shadow: 1
    });
    api.bind("revolution.slide.onloaded", function(e) {
        jQuery('.tparrows').each(function() {
            var arrows = jQuery(this);
            var timer = setInterval(function() {
                if (arrows.css('opacity') == 1 && !jQuery('.tp-simpleresponsive').hasClass("mouseisover")) arrows.fadeOut(300);
            }, 3000);
        })
        jQuery('.tp-simpleresponsive, .tparrows').hover(function() {
            jQuery('.tp-simpleresponsive').addClass("mouseisover");
            jQuery('body').find('.tparrows').each(function() {
                jQuery(this).fadeIn(300);
            });
        }, function() {
            if (!jQuery(this).hasClass("tparrows")) jQuery('.tp-simpleresponsive').removeClass("mouseisover");
        })
    });
});