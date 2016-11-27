import { Component, OnInit, AfterViewInit } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { UUID } from 'angular2-uuid';
import { Router, ActivatedRoute } from "@angular/router";
import {
	FormGroup,
	FormControl,
	Validators,
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
	listRoutes = [];
	locations = [];
	flightsFromDate = [];
	flightsToDate = [];
	session_flight = {};
	round_trip = false;
	search:any;
	session_token: string;

	constructor(private _AirlineDataService: AirlineDataService, private _LocationDataService: LocationDataService,
		private sessionStorage: LocalStorageService, private _ActivatedRoute: ActivatedRoute, private _Router: Router) { 
		moment.locale('vi');

		this._ActivatedRoute.params.subscribe(
			(param: any) => this.session_token = param['session_token']
		);
		

		let session_token = this.sessionStorage.get('session_token');

		console.log(this.session_token == session_token);

	}

  	ngOnInit() {

		var params = this.sessionStorage.get('session_flight');

		this.session_flight = JSON.parse(String(params));



		let from_flights = this.getRoute(this.session_flight, 'from');

		let to_flights = {};
		this.search = this.clone(this.session_flight);
		// Check one-way or round-trip
		if (this.session_flight['round_trip'] === 'on') {
			this.round_trip = true;
			to_flights = this.getRoute(this.inverseFlight(this.session_flight), 'to');
			// this.session_flight['to_fly_date'] = moment(this.session_flight['to_date']).format("dddd - DD/MM/YYYY");
		}
		
		const vietjet$ = this._AirlineDataService.vietjet(this.session_flight).cache();
		vietjet$.subscribe(res => {

			if (res.dep_flights) {

				from_flights['flights'] = res.dep_flights

				this.listRoutes.push(from_flights);
				

			}

			if(res.ret_flights) {
				to_flights['flights'] = res.ret_flights;
				this.listRoutes.push(to_flights);
			}
			console.log(this.listRoutes);
		});

		const jetstar$ = this._AirlineDataService.jetstar(this.session_flight).cache();

		jetstar$.subscribe(res => {

			if (res.dep_flights) {

				from_flights['flights'] = res.dep_flights

				this.listRoutes.push(from_flights);


			}

			if (res.ret_flights) {
				to_flights['flights'] = res.ret_flights;
				this.listRoutes.push(to_flights);
			}
			console.log(this.listRoutes);

		});
		const vna$ = this._AirlineDataService.vna(this.session_flight).cache();

		const combined$ = Observable.concat(vietjet$, jetstar$, vna$);

		combined$.subscribe(
			vietjet => console.log(vietjet),

		);
		

		// Get locations
		this._LocationDataService.getAll().subscribe(res => {

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

			jQuery(".select-adult, .select-child-1, .select-child-2").select2({
				width: '100%',
				minimumResultsForSearch: -1
			});

		}, 1000);

		setTimeout(function() {

			jQuery('.btn-select-flight').click(function() {
				if (!jQuery(this).closest('.flights').hasClass('selected')) {
					jQuery(this).closest('.flights').addClass('selected');
					if (jQuery('.flights.selected').length < jQuery('.flights').length) {
						jQuery('.flights').each(function(i) {
							if (!jQuery('.flights').eq(i).hasClass('selected')) {
								jQuery('html, body').animate({
									scrollTop: jQuery('.flights').eq(i).offset().top
								}, 500);
								return false;
							}
						})
					} else {
						alert('Redirect to confirm page');
					}
				}
			});

		}, 5000);
		
	}

	// Set Date
	setDate(date, option) {
		this.search = this.clone(this.session_flight);
		if(option === 'from') {
			this.search.from_date = date;
		} else {
			this.search.to_date = date;
		}
		this.onResearch();
	}

	// Research 
	onResearch() {
		let uuid = UUID.UUID();
		this.sessionStorage.remove('session_flight');
		this.sessionStorage.remove('session_token');
		this.sessionStorage.set('session_token', uuid);

		var objectStore = this.search;
		var dateFormat = 'YYYY-MM-DD';
		var viFormatDate = 'DD/MM/YYYY';
		objectStore.from_date = moment(objectStore.from_date, viFormatDate).format(dateFormat);
		objectStore.from_name = this.getNameFromCode(objectStore.from);

		if (objectStore.to_date == undefined) {
			objectStore.to_date = '';
			objectStore.to_name = '';
		} else {
			objectStore.to_date = moment(objectStore.to_date, viFormatDate).format(dateFormat);
			objectStore.to_name = this.getNameFromCode(objectStore.to);
		}

		this.sessionStorage.set('session_flight', JSON.stringify(objectStore));
		this._Router.navigate(['search-result/' + uuid]);
	}


	// Sort Price From min to max
	sortPrice() {
		for (var key in this.listRoutes) {

			this.listRoutes[key].flights.sort((leftSide, rightSide): any => {
				var left_price = +leftSide.price.replace(',', '');
				var right_price = +rightSide.price.replace(',', '');
				
				if (left_price < right_price) return -1;
				if (left_price > right_price) return 1;
				return 0;
			})
		}

	}

	// Sort Time From min to max
	sortTime() {
		for (var key in this.listRoutes) {

			this.listRoutes[key].flights.sort((leftSide, rightSide): any => {
				var left_start_time = moment(leftSide.start_time, 'HH:mm');
				var right_start_time = moment(rightSide.start_time, 'HH:mm');

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
  	protected getRoute(route, option) {
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
		route['option'] = option;
		
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

	// Get Name From Code
	protected getNameFromCode(code: string) {
		let label = '';
		for (var key in this.locations) {
			if (this.locations[key].value == code)
				return this.locations[key].label;
		}
		return label;
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
