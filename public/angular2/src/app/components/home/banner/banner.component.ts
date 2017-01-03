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
					res.data[key].img = this._BannerDataService.imgPath + res.data[key].img;
					options.push(res.data[key]);
  				}
				this.bannerOptions = options;

				setTimeout( () => {
					jQuery('.owl-carousel-home-slider').owlCarousel({
						navigation: true,
						slideSpeed: 300,
						paginationSpeed: 400,
						singleItem: true,
						autoPlay: 5000,
						transitionStyle: "fade",
						pagination: false
					});
				}, 2000)
  			}
  		});
  	}

}
