import { Component, OnInit, AfterViewInit } from '@angular/core';
import {
	FormGroup,
	FormControl,
	Validators,
	FormBuilder,
	FormArray
} from "@angular/forms";
import { LocalStorageService } from 'angular-2-local-storage';

import { LocationDataService } from '../../shared/location.dataservice';
import { AirlineDataService } from '../../shared/airline.dataservice';
declare let moment: any;
declare let jQuery: any;

@Component({
  selector: 'search-result',
  templateUrl: './search-result.component.html',
  providers: [LocationDataService, AirlineDataService]
})
export class SearchResultComponent implements OnInit, AfterViewInit {

	people = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
	filterBookForm: FormGroup;
	listRoutes = [];
	locations = [];
	flightsFromDate = [];
	flightsToDate = [];
	session_flight = {};
	round_trip = false;

	constructor(private formBuilder: FormBuilder, private airlineDataService: AirlineDataService, 
		private sessionStorage: LocalStorageService, private locationDataService: LocationDataService) { 
		moment.locale('vi');
	}

  	ngOnInit() {

		var params = this.sessionStorage.get('session_flight');

		this.session_flight = JSON.parse(String(params));

		this.filterBookForm = this.formBuilder.group({
			'round_trip': this.session_flight['round_trip'],
			'from': [this.session_flight['from'], Validators.required],
			'to': [this.session_flight['to'], Validators.required],
			'from_date': [this.session_flight['from_date'], Validators.required],
			'to_date': [this.session_flight['to_date']],
			'adult': [this.session_flight['adult'], Validators.required],
			'children': [this.session_flight['children']],
			'infant': [this.session_flight['infant']]
		});

		let from_flights = this.getRoute(this.session_flight);

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

	ngAfterViewInit() {
		var params = this.sessionStorage.get('session_flight');

		let session_flight = JSON.parse(String(params));
		setTimeout(function() {
			jQuery('.select2').select2();
			jQuery('#date-go input').val(session_flight['from_date']);
			if (session_flight['to_date']) {
				jQuery('#date-back input').val(session_flight['to_date']);
			}
			console.log(session_flight);
		}, 1000);
		
	}



	// Sort Price From min to max
	sortPrice() {
		for (var key in this.listRoutes) {

			this.listRoutes[key].flights.sort((leftSide, rightSide): any => {

				if (leftSide.eco < rightSide.eco) return -1;
				if (leftSide.eco > rightSide.eco) return 1;
				return 0;
			})
		}
		console.log(this.listRoutes);
	}

	// Sort Time From min to max
	sortTime() {
		for (var key in this.listRoutes) {

			this.listRoutes[key].flights.sort((leftSide, rightSide): any => {
				var left_start_time = moment(leftSide.start_time, 'HH:mm');
				var right_start_time = moment(rightSide.start_time, 'HH:mm');

				console.log(left_start_time);
				console.log(left_start_time > right_start_time)
				if (left_start_time < right_start_time) return -1;
				if (left_start_time > right_start_time) return 1;
				return 0;
			})
		}
	}

	// Sort Time From min to max
	sortAirline() {
		for (var key in this.listRoutes) {

			this.listRoutes[key].flights.sort((leftSide, rightSide): any => {

				if (leftSide.flight_code < rightSide.flight_code) return -1;
				if (leftSide.flight_code > rightSide.flight_code) return 1;
				return 0;
			})
		}
	}

	// Inverse Flight
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
