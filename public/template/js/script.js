var swiper = new Swiper('.swiper-container', {
  slidesPerView: 'auto',
  paginationClickable: true,
  spaceBetween: 30,
  autoplay: true,
  speed: 5000
});

jQuery(window).on('load', function() {
  jQuery(".nicdark_preloader").delay(1000).fadeOut("slow");
});

var indexScript = {
  loadBookOption: function() {
    var radios = jQuery('input[name="plane-option"]');
    radios.filter('[value=option1]').prop('checked', true);

    jQuery('.plane-form #date-back input').prop('disabled', true);

    jQuery('.multiple').hide();
  },
  changeBookOption: function() {
    jQuery('input[name="plane-option"]').on('change', function() {
      if (jQuery(this).val() == 'option1') {
        jQuery('.multiple').hide();
        jQuery('.one').fadeIn('300');
        jQuery('.plane-form #date-back input').prop('disabled', true);
      } else if (jQuery(this).val() == 'option2') {
        jQuery('.multiple').hide();
        jQuery('.one').fadeIn('300');
        jQuery('.plane-form #date-back input').prop('disabled', false);
      } else {
        jQuery('.one').hide();
        jQuery('.multiple').fadeIn('300');
      }
    });
  }
};

var selectFlights = {
  loadBookOption: function() {
    var radios = jQuery('input[name="flight-option"]');
    radios.filter('[value=option1]').prop('checked', true);

    jQuery('.search-plane #date-back input').prop('disabled', true);
  },
  changeBookOption: function() {
    jQuery('input[name="flight-option"]').on('change', function() {
      if (jQuery(this).val() == 'option1') {
        jQuery('.one').fadeIn('300');
        jQuery('.search-plane #date-back input').prop('disabled', true);
      } else {
        jQuery('.one').fadeIn('300');
        jQuery('.search-plane #date-back input').prop('disabled', false);
      }
    });
  },
  scrollSubmit: function() {
    var m;
    if (jQuery('.submit-plane').length > 0) {
      m = jQuery('.submit-plane').offset().top;
    }
    var n = jQuery(window).height();
    var w = jQuery('.main-list-plane-inner').width();

    if (n < m) {
      jQuery('.submit-plane').addClass('scroll-down');
      jQuery('.submit-plane').css('width', w);
      jQuery('.more-scroll').text('Kéo xuống để xem thêm kết quả');
    }

    jQuery(window).scroll(function() {
      var o = jQuery(window).scrollTop();
      if (o + n >= m) {
        jQuery('.submit-plane').removeClass('scroll-down');
        jQuery('.more-scroll').text('');
      } else {
        jQuery('.submit-plane').addClass('scroll-down');
        jQuery('.more-scroll').text('Kéo xuống để xem thêm kết quả');
      }
    });

    jQuery(window).resize(function() {
      w = jQuery('.main-list-plane-inner').width();
      jQuery('.submit-plane').css('width', w);
    });
  }
};

var guestDetails = {
  init: function() {
    var checkbox = jQuery('input[name="order-report"]');
    checkbox.prop('checked', false);
  },
  toggleBill: function() {
    jQuery('input[name="order-report"]').on('change', function() {
      if (!jQuery(this).is(':checked')) {
        jQuery('.bill').hide();
      } else {
        jQuery('.bill').slideDown(300);
      }
    });
  }
};

var general = {

};


jQuery(document).ready(function() {
  jQuery(".select-from, .select-to").select2({
    width: '100%'
  });

  jQuery(".select-adult, .select-child-1, .select-child-2").select2({
    width: '100%',
    minimumResultsForSearch: -1
  });

  jQuery('.customer-comment').owlCarousel({
    navigation: false,
    slideSpeed: 300,
    paginationSpeed: 400,
    singleItem: true,
    autoPlay: 5000
  });

  jQuery('#date-go, #date-back, .date').datetimepicker({
    format: 'DD/MM/YYYY',
    allowInputToggle: true
  });

  indexScript.loadBookOption();
  indexScript.changeBookOption();

  selectFlights.scrollSubmit();
  selectFlights.loadBookOption();
  selectFlights.changeBookOption();

  guestDetails.init();
  guestDetails.toggleBill();

  jQuery("html").niceScroll({
    cursorcolor: "#ccc",
    cursorborder: "0px solid #fff",
    railpadding: { top: 0, right: 0, left: 0, bottom: 0 },
    cursorwidth: "5px",
    cursorborderradius: "0px",
    cursoropacitymin: 0,
    cursoropacitymax: 0.7,
    boxzoom: true,
    horizrailenabled: false,
    autohidemode: false
  });

  jQuery('.owl-carousel-slider').owlCarousel({
    navigation: true,
    slideSpeed: 300,
    paginationSpeed: 400,
    singleItem: true,
    autoPlay: 5000,
    transitionStyle: "fade",
    pagination: false
  });

  jQuery('.intro-services .item .item-inner').matchHeight({
    byRow: true,
    property: 'height',
    target: null,
    remove: false
  });


  jQuery('.tours-list .item .item-inner h3').matchHeight({
    byRow: true,
    property: 'height',
    target: null,
    remove: false
  });
  jQuery('.tours-list .item .item-inner p').matchHeight({
    byRow: true,
    property: 'height',
    target: null,
    remove: false
  });

  //effect image our service
  jQuery(".intro-why .item").mouseover(function() {
    //Add hiệu ứng lúc hover vào icon
    var objImg = jQuery(this).find("img:first");
    objImg.removeClass().addClass("animated flip").one("webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend", function() {
      objImg.removeClass();
    });
  });

  // Slider with fixed minimum
  jQuery("#slider-price").slider({
    range: true,
    step: 500000,
    value: 0,
    min: 0,
    max: 15000000,
    values: [0, 5000000],
    slide: function(event, ui) {
      jQuery("#min-price").text(ui.values[0] + " đ");
      jQuery("#max-price").text(ui.values[1] + " đ");
    }
  });

  jQuery("#min-price").text(jQuery("#slider-price").slider("values", 0) + " đ");
  jQuery("#max-price").text(jQuery("#slider-price").slider("values", 1) + " đ");

  var sync1 = jQuery("#sync1");
  var sync2 = jQuery("#sync2");

  sync1.owlCarousel({
    singleItem : true,
    slideSpeed : 1000,
    navigation: true,
    pagination:false,
    autoPlay: 5000,
    afterAction : syncPosition,
    responsiveRefreshRate : 200,
  });

  sync2.owlCarousel({
    items : 8,
    itemsDesktop      : [1199,8],
    itemsDesktopSmall     : [979,6],
    itemsTablet       : [768,5],
    itemsMobile       : [479,4],
    pagination:false,
    responsiveRefreshRate : 100,
    afterInit : function(el){
      el.find(".owl-item").eq(0).addClass("synced");
    }
  });

  function syncPosition(el){
    var current = this.currentItem;
    jQuery("#sync2")
      .find(".owl-item")
      .removeClass("synced")
      .eq(current)
      .addClass("synced")
    if(jQuery("#sync2").data("owlCarousel") !== undefined){
      center(current)
    }

  }

  jQuery("#sync2").on("click", ".owl-item", function(e){
    e.preventDefault();
    var number = jQuery(this).data("owlItem");
    sync1.trigger("owl.goTo",number);
  });

  function center(number){
    var sync2visible = sync2.data("owlCarousel").owl.visibleItems;

    var num = number;
    var found = false;
    for(var i in sync2visible){
      if(num === sync2visible[i]){
        var found = true;
      }
    }

    if(found===false){
      if(num>sync2visible[sync2visible.length-1]){
        sync2.trigger("owl.goTo", num - sync2visible.length+2)
      }else{
        if(num - 1 === -1){
          num = 0;
        }
        sync2.trigger("owl.goTo", num);
      }
    } else if(num === sync2visible[sync2visible.length-1]){
      sync2.trigger("owl.goTo", sync2visible[1])
    } else if(num === sync2visible[0]){
      sync2.trigger("owl.goTo", num-1)
    }
  }

  jQuery('.photos-tab li a').click(function(){
    jQuery('.photos-tab li a').removeClass('active');
    jQuery(this).addClass('active');

    jQuery('.photos-wrapper .item').hide()
    jQuery(jQuery(this).attr('href')).show();
    return false;
  })
});
