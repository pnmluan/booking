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

jQuery(document).ready(function() {
  jQuery(".select-from, .select-to").select2({
    width: '100%'
  });
  jQuery(".select-adult, .select-child-1, .select-child-2").select2({
    width: '100%',
    minimumResultsForSearch: -1
  });

  jQuery('.owl-carousel').owlCarousel({
    navigation : false, // Show next and prev buttons
    slideSpeed : 300,
    paginationSpeed : 400,
    singleItem:true,
    autoPlay : 5000
  });
});
