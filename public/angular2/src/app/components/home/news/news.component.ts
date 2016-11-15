import { Component, OnInit } from '@angular/core';
import { Configuration } from '../../../shared/app.configuration';
import { Banner } from '../../../models/banner';
import { BannerDataService } from '../../../shared/banner.dataservice';

@Component({
  selector: 'app-news',
  templateUrl: './news.component.html',
  styleUrls: ['./news.component.css'],
  providers: [BannerDataService, Configuration]
})
export class NewsComponent implements OnInit {

	public banner: Banner;
	public news = [];
	public bannerPath: string;
	constructor(private _bannerDataService: BannerDataService, private config: Configuration) { }

	ngOnInit() {
		this.bannerPath = this.config.imgPath + 'banner/';
		this._bannerDataService.getAll().subscribe(res => {

			if (res.data) {

				for (var key in res.data) {

					this.news.push(res.data[key]);
				}

			}

		})
	}

}


