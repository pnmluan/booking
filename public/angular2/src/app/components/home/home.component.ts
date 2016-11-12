import { Component, OnInit } from '@angular/core';

import { BannerComponent } from './banner';
import { NewsComponent } from './news';
import { CommentComponent } from './comment';
import { Location } from '../../models/Location';
import { Configuration } from '../../shared/app.configuration';
import { LocationDataService } from '../../shared/location.dataservice';
import { BannerDataService } from '../../shared/banner.dataservice';
import { CommentDataService } from '../../shared/comment.dataservice';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
  providers: [BannerComponent, NewsComponent, BannerComponent, LocationDataService, BannerDataService, CommentDataService]
})
export class HomeComponent implements OnInit {

	constructor(private _locationDataService: LocationDataService, private _configuration: Configuration,
		private _bannerDataService: BannerDataService, private _commentDataService: CommentDataService) { }

	public locations: Location[] = [];
	// public LocationUrl = this._configuration.server + 'images/Location/';


	ngOnInit() {
		this._locationDataService.getAll().subscribe(res => {

			if (res.status == 'success') {

				for (var key in res.data) {
					// res.data[key]['file'] = this.LocationUrl + res.data[key]['file'];
					this.locations.push(res.data[key]);
				}
				
			}
			console.log(this.locations);
		})
	}

}
