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

  jQuery('.owl-carousel').owlCarousel({
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

  //effect image our service
  jQuery(".intro-why .item").mouseover(function() {
    //Add hiệu ứng lúc hover vào icon
    var objImg = jQuery(this).find("img:first");
    objImg.removeClass().addClass("animated flip").one("webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend", function() {
      objImg.removeClass();
    });
  });
});
