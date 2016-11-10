import { Component, OnInit } from '@angular/core';
import { Location } from '../../models/Location';
import { Configuration } from '../../shared/app.configuration';
import { LocationDataService } from '../../shared/Location.dataservice';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
  providers: [LocationDataService]
})
export class HomeComponent implements OnInit {

	constructor(private _LocationDataService: LocationDataService, private _configuration: Configuration) { }

	public Locations: Location[] = [];
	// public LocationUrl = this._configuration.server + 'images/Location/';


	ngOnInit() {
		this._LocationDataService.getAll().subscribe(res => {

			if (res.status == 'success') {

				for (var key in res.data) {
					// res.data[key]['file'] = this.LocationUrl + res.data[key]['file'];
					this.Locations.push(res.data[key]);
				}
				console.log(this.Locations);
			}
		})
	}

}
