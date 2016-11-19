import { Component, OnInit } from '@angular/core';
import { LocalStorageService } from 'angular-2-local-storage';

import { LocationDataService } from '../../shared/location.dataservice';
import { AirlineDataService } from '../../shared/airline.dataservice';
declare let moment: any;

@Component({
  selector: 'search-result',
  templateUrl: './search-result.component.html',
  providers: [LocationDataService, AirlineDataService]
})
export class SearchResultComponent implements OnInit {

	listRoutes = [];
	locations = [];
	flightsFromDate = [];
	flightsToDate = [];
	session_flight = {};
	round_trip = false;
	constructor(private airlineDataService: AirlineDataService, private sessionStorage: LocalStorageService,
		private locationDataService: LocationDataService) { 
		moment.locale('vi');
	}

  	ngOnInit() {

		var params = this.sessionStorage.get('session_flight');

		this.session_flight = JSON.parse(String(params));

		let from_flights = this.getRoute(this.session_flight);
		console.log(from_flights);

		let to_flights = {};
		// Check one-way or round-trip
		if (this.session_flight['round_trip'] === 'on') {
			this.round_trip = true;
			to_flights = this.getRoute(this.inverseFlight(this.session_flight));
			console.log(to_flights);
			// this.session_flight['to_fly_date'] = moment(this.session_flight['to_date']).format("dddd - DD/MM/YYYY");
		}
		

		this.airlineDataService.vietjet(params).subscribe(res => {

			if (res.dep_flights) {
				// var moment_from_date = moment(this.session_flight['from_date']).format('DD/MM/YYYY');
				// var flightsFromDate = res.dep_flights.filter(
				// 	flight => flight.start_date == moment_from_date);

				from_flights['flights'] = res.dep_flights

				this.listRoutes.push(from_flights);
				

			}

			if(res.ret_flights) {
				to_flights['flights'] = res.ret_flights;
				this.listRoutes.push(to_flights);
			}
			console.log(this.listRoutes);
		});
		

		// Get locations
		this.locationDataService.getAll().subscribe(res => {

			if (res.data) {
				var locations = [];
				for (var key in res.data) {

					var temp = {
						value: res.data[key].code,
						label: res.data[key].name
					};
					locations.push(temp);

				}
				this.locations = locations;
			}

		});
  	}

  	protected inverseFlight(session_flight) {
		var temp = this.clone(session_flight);
		temp['from'] = session_flight['to'];
		temp['from_name'] = session_flight['to_name'];
		temp['to'] = session_flight['from'];
		temp['to_name'] = session_flight['from_name'];
		temp['from_date'] = session_flight['to_date'];
		return temp;

  	}

  	// Get Route
  	protected getRoute(route) {
		var formatDate = "dddd - DD/MM/YYYY";
		route['from_fly_date'] = moment(route['from_date']).format(formatDate);
		route['days'] = [];
		route['days'].push(this.getDateObject(-3, route['from_date']));
		route['days'].push(this.getDateObject(-2, route['from_date']));
		route['days'].push(this.getDateObject(-1, route['from_date']));
		route['days'].push(this.getDateObject(0, route['from_date'], true));
		route['days'].push(this.getDateObject(1, route['from_date']));
		route['days'].push(this.getDateObject(2, route['from_date']));
		route['days'].push(this.getDateObject(3, route['from_date']));
		
		return route;
  	}

  	// Get Date Object
	protected getDateObject(number, date, isCurrent = false) {
		var item = {};
		var format = 'DD-MM-YYYY';
		var currentDate = String(moment().format(format));
		var momentDate = moment(date).add(number, 'days');
		item['date'] = momentDate.format('DD/MM/YYYY');
		item['name'] = momentDate.format('dddd');
		item['class'] = '';
		if(isCurrent) {
			item['class'] = 'current';
		} else {

			if (moment(currentDate, format) > moment(momentDate, format)) {
				item['class'] = 'off';
			}
		}
		return item;

  	}

  	protected clone(obj) {
		if (null == obj || "object" != typeof obj) return obj;
		var copy = obj.constructor();
		for (var attr in obj) {
			if (obj.hasOwnProperty(attr)) copy[attr] = obj[attr];
		}
		return copy;
	}

}
