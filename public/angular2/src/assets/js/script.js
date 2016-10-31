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

    jQuery('#date-back input').prop('disabled', true);

    jQuery('.multiple').hide();
  },
  changeBookOption: function() {
    jQuery('input[name="plane-option"]').on('change', function() {
      if (jQuery(this).val() == 'option1') {
        jQuery('.multiple').hide();
        jQuery('.one').fadeIn('300');
        jQuery('#date-back input').prop('disabled', true);
      } else if (jQuery(this).val() == 'option2') {
        jQuery('.multiple').hide();
        jQuery('.one').fadeIn('300');
        jQuery('#date-back input').prop('disabled', false);
      } else {
        jQuery('.one').hide();
        jQuery('.multiple').fadeIn('300');
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
});
