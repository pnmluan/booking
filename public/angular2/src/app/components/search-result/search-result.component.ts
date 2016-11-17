import { Component, OnInit } from '@angular/core';
import { LocalStorageService } from 'angular-2-local-storage';

import { AirlineDataService } from '../../shared/airline.dataservice';

@Component({
  selector: 'search-result',
  templateUrl: './search-result.component.html',
  providers: [AirlineDataService]
})
export class SearchResultComponent implements OnInit {

	flight = [];
	constructor(private airlineDataService: AirlineDataService, private sessionStorage: LocalStorageService) { }

  	ngOnInit() {

		var params = this.sessionStorage.get('session_flight');

		this.airlineDataService.vietjet(params).subscribe(res => {
			console.log(res.dep_flights);
			if (res.dep_flights) {
				var flights = [];
				for (var key in res.data) {


				}

			}

		});
  	}

}
