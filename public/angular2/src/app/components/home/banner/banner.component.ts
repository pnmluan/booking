import { Component, OnInit } from '@angular/core';
import { BannerDataService } from '../../../shared';
declare let jQuery: any;
@Component({
  selector: 'app-banner',
  templateUrl: './banner.component.html',
  providers: [BannerDataService]
})
export class BannerComponent implements OnInit {
	bannerOptions = [];

  	constructor(
		private _BannerDataService: BannerDataService
  	) { }

  	ngOnInit() {
  		this._BannerDataService.getAll().subscribe(res => {
  			if(res.data) {
				var options = [];
  				for(let key in res.data) {
					options.push(res.data[key]);
  				}
				this.bannerOptions = options;


				setTimeout( () => {
					jQuery('#rev_slider_4_1').show().revolution({
				      dottedOverlay: "none",
				      delay: 9000,
				      startwidth: 1200,
				      startheight: 650,
				      hideThumbs: 0,

				      thumbWidth: 100,
				      thumbHeight: 50,
				      thumbAmount: 3,


				      simplifyAll: "off",

				      navigationType: "none",
				      navigationArrows: "solo",
				      navigationStyle: "preview1",

				      touchenabled: "on",
				      onHoverStop: "on",
				      nextSlideOnWindowFocus: "off",

				      swipe_threshold: 75,
				      swipe_min_touches: 1,
				      drag_block_vertical: false,

				      parallax: "mouse",
				      parallaxBgFreeze: "off",
				      parallaxLevels: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],


				      keyboardNavigation: "off",

				      navigationHAlign: "center",
				      navigationVAlign: "bottom",
				      navigationHOffset: 0,
				      navigationVOffset: 20,

				      soloArrowLeftHalign: "left",
				      soloArrowLeftValign: "center",
				      soloArrowLeftHOffset: 20,
				      soloArrowLeftVOffset: 0,

				      soloArrowRightHalign: "right",
				      soloArrowRightValign: "center",
				      soloArrowRightHOffset: 20,
				      soloArrowRightVOffset: 0,

				      shadow: 0,
				      fullWidth: "on",
				      fullScreen: "off",

				      spinner: "spinner2",

				      stopLoop: "off",
				      stopAfterLoops: -1,
				      stopAtSlide: -1,

				      shuffle: "off",

				      autoHeight: "off",
				      forceFullWidth: "off",

				      hideTimerBar: "on",
				      hideThumbsOnMobile: "off",
				      hideNavDelayOnMobile: 1500,
				      hideBulletsOnMobile: "off",
				      hideArrowsOnMobile: "off",
				      hideThumbsUnderResolution: 0,

				      hideSliderAtLimit: 0,
				      hideCaptionAtLimit: 0,
				      hideAllCaptionAtLilmit: 0,
				      startWithSlide: 0
				    });
				}, 2000)
  			}
  		});
  	}

}
