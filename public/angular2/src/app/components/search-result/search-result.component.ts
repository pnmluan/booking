import { Component, OnInit, AfterViewInit, ViewChild } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { UUID } from 'angular2-uuid';
import { Router, ActivatedRoute } from "@angular/router";
import {
	FormGroup,
	FormControl,
	Validators,
	FormArray
} from "@angular/forms";
import { ModalComponent } from 'ng2-bs3-modal/ng2-bs3-modal';
import { URLSearchParams } from '@angular/http';
import { LocalStorageService } from 'angular-2-local-storage';
import { ToasterModule, ToasterService } from 'angular2-toaster';


import { LocationDataService, 
	AirlineDataService, 
	BookingDataService, 
	BookingDetailDataService,
	ContactDataService,
	PassengerDataService,
	BaggageTypeDataService
} from '../../shared';

import { Contact } from '../../models';
import { Configuration } from '../../shared/app.configuration';
declare let moment: any;
declare let jQuery: any;

@Component({
  selector: 'search-result',
  templateUrl: './search-result.component.html',
  providers: [LocationDataService, AirlineDataService, BookingDataService, BookingDetailDataService, 
	  ContactDataService, PassengerDataService, BaggageTypeDataService]
})
export class SearchResultComponent implements OnInit, AfterViewInit {
	@ViewChild('warning') warning: ModalComponent;
	people = this._Configuration.arr_number_people;
	infants = this._Configuration.arr_number_infants;
	listRoutes = [];
	locations = [];
	flightsFromDate = [];
	flightsToDate = [];
	session_flight = {};
	round_trip = false;
	selectedFlights = {};
	roundTripOptions = {};
	selectedStep = 0;
	sort: any;
	lowestFilter = {};
	steps = [];
	search: any;
	contact = {};
	session_token: string;
	passengers = [];
	airlines = {};
	airlineOptions = {};
	title: any;

	adultTitleOptions = [
		{ value: 1, label: 'Ông' },
		{ value: 2, label: 'Bà' },
		{ value: 3, label: 'Anh' },
		{ value: 4, label: 'Chị' }
	];
	adultOptions = [];
	infantOptions = [];
	titleOptions = [];
	baggageOptionsFrom = [];
	baggageOptionsTo = [];
	generalData = {};
	warningMsg: string = '';

	curRouting?: string;
	filter_from_date: any;
	filter_to_date: any;
	filter_date_of_birth: any;
	fromDateOptions = {};
	toDateOptions = {};
	datepickerOptions = { format: this._Configuration.viFormatDate, autoApply: true, locate: 'vi', style: 'big' };

	constructor(
		private _AirlineDataService: AirlineDataService, 
		private _LocationDataService: LocationDataService,
		private _BookingDataService: BookingDataService,
		private _ContactDataService: ContactDataService,
		private _BookingDetailDataService: BookingDetailDataService,
		private _PassengerDataService: PassengerDataService,
		private _BaggageTypeDataService: BaggageTypeDataService,
		private sessionStorage: LocalStorageService, 
		private _ActivatedRoute: ActivatedRoute, 
		private _Router: Router,
		private _Configuration: Configuration,
		private _ToasterService: ToasterService
	) { 
		moment.locale('vi');

		this._ActivatedRoute.params.subscribe(
			(param: any) => this.session_token = param['session_token']
		);

		
		this._Router.events.subscribe((val) => {
			let routing = this._Router.url;
			if (this.curRouting != routing) {
				this.curRouting = routing;
				this.initData();
			}
		});

		let session_token = this.sessionStorage.get('session_token');

		this.roundTripOptions = {
			on: 'Khứ hồi',
			off: 'Một chiều',
			mul: 'Nhiều chặng'
		}

		this.contact['title'] = 1;
		this.steps = [
			{ value: 1, label: 'Tìm chuyến bay' },
			{ value: 2, label: 'Thông tin hành khác và chuyến bay' },
			{ value: 3, label: 'Xác nhận & Thanh toán' },

		];

		this.titleOptions['adult'] = [
			{ value: 1, label: 'Ông' },
			{ value: 2, label: 'Bà' },
			{ value: 3, label: 'Anh' },
			{ value: 4, label: 'Chị' }
		];

		this.titleOptions['children'] = [
			{ value: 5, label: 'Bé Trai' },
			{ value: 6, label: 'Bé Gái' }
		];

		this.titleOptions['infant'] = [
			{ value: 7, label: 'Em Bé Trai' },
			{ value: 8, label: 'Em Bé Gái' }
		];

		this.airlineOptions = {
			vietjet:true,
			jetstar: false,
			vna: true

		};

	}

  	ngOnInit() {

		this.searchingData();

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

		// List Options Adult
		let adultOptions = [];
		let arr_number_people = this._Configuration.arr_number_people;
		for (let key in arr_number_people) {

			var temp_adult = {
				value: arr_number_people[key],
				label: arr_number_people[key]
			};

			adultOptions.push(temp_adult);

		}
		this.adultOptions = adultOptions;

		// List Options Infant
		let infantOptions = [];
		let arr_number_infants = this._Configuration.arr_number_infants;
		for (let key in arr_number_infants) {

			var temp_infant = {
				value: arr_number_infants[key],
				label: arr_number_infants[key]
			};
			infantOptions.push(temp_infant);

		}
		this.infantOptions = infantOptions;
  	}

  	searchingData() {
		var params = this.sessionStorage.get('session_flight');
		this.generalData['str_people'];

		this.session_flight = JSON.parse(String(params));

		let format_day = 'dddd, DD/MM/YYYY';

		this.search = this.clone(this.session_flight);


		this.search['from_day'] = moment(this.search['from_date']).format(format_day);
		if (this.search['to_date']) {
			this.search['to_day'] = moment(this.search['to_date']).format(format_day);
		}
  	}

  	initData() {
		this.searchingData();


		// Combine fork join 3 airlines
		const vietjet$ = this._AirlineDataService.vietjet(this.session_flight);

		// const jetstar$ = this._AirlineDataService.jetstar(this.session_flight);

		const vna$ = this._AirlineDataService.vna(this.session_flight);

		// Observable.forkJoin(vietjet$, jetstar$, vna$).subscribe(res => {
		Observable.forkJoin(vietjet$, vna$).subscribe(res => {

			this.airlines['vietjet'] = res[0];
			// this.airlines['jetstar'] = res[1];
			this.airlines['vna'] = res[1];

			this.lowestFilter['vietjet'] = this.getLowestPrice(this.airlines['vietjet'].dep_flights);
			// this.lowestFilter['jetstar'] = this.getLowestPrice(this.airlines['jetstar'].dep_flights);
			this.lowestFilter['vna'] = this.getLowestPrice(this.airlines['vna'].dep_flights);
			this.filterAirlines();
			this.selectedStep = 1;
			this.sortTime();
			this.sort = 'time';

		});

		var params = this.sessionStorage.get('session_flight');

		// Load session flight with from_date, to_date
		let session_flight = JSON.parse(String(params));
		
		this.fromDateOptions = {
			format: this._Configuration.viFormatDate, 
			autoApply: true, locate: 'vi', 
			initialDate: new Date(session_flight['from_date'])
		};

		if (session_flight['to_date']) {
			this.toDateOptions = { 
				format: this._Configuration.viFormatDate, 
				autoApply: true, locate: 'vi', 
				initialDate: new Date(session_flight['to_date'])
			};
		}

		
		console.log(this.search)

		setTimeout(()=>{

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

	ngAfterViewInit() {}

	onFilterArlines() {

	}

	updateCheckedOptions(option, event) {
		this.airlineOptions[option] = event.target.checked;
		this.filterAirlines();
		this.sort = 'airline';
	}



	// Filter airlines
	filterAirlines() {
		this.listRoutes = [];
		let from_flights = this.getRoute(this.session_flight, 'from');
		from_flights['class'] = 'flight-go';
		let to_flights = {};
		// Check one-way or round-trip
		if (this.session_flight['round_trip'] === 'on') {
			this.round_trip = true;
			to_flights = this.getRoute(this.inverseFlight(this.session_flight), 'to');
			to_flights['class'] = 'flight-back';
			// this.session_flight['to_fly_date'] = moment(this.session_flight['to_date']).format("dddd - DD/MM/YYYY");
		}

		let dep_flights = [];
		let ret_flights = [];

		let airlines = [];
		for(let k in this.airlineOptions) {
			if (this.airlineOptions[k]) {
				airlines.push(k);
			}
		}
		
		for (let key in airlines) {
			dep_flights = this.pushDepFlights(airlines[key], this.airlines[airlines[key]], dep_flights);

		}
		from_flights['flights'] = dep_flights;
		this.listRoutes.push(from_flights);


		if (this.session_flight['round_trip'] === 'on') {
			for (let key in airlines) {
				ret_flights = this.pushRetFlights(airlines[key], this.airlines[airlines[key]], ret_flights);

			}
			to_flights['flights'] = ret_flights;
			this.listRoutes.push(to_flights);
		}
	}

	pushDepFlights(type, result, flights) {
		if (result.dep_flights) {
			let image = 'assets/img/' + type + '.gif';
			for (let k in result.dep_flights) {
				result.dep_flights[k].airline = type;
				result.dep_flights[k].image = image;
				result.dep_flights[k].direction = 'from';
				flights.push(result.dep_flights[k]);
			}
		}
		return flights;
	}

	pushRetFlights(type, result, flights) {
		if (result.ret_flights) {
			let image = 'assets/img/' + type + '.gif';
			for (let k in result.ret_flights) {
				result.ret_flights[k].airline = type;
				result.ret_flights[k].image = image;
				result.ret_flights[k].direction = 'to';
				flights.push(result.ret_flights[k]);
			}
		}
		return flights;
	}

	// Set Date
	setDate(date, option) {

		let current = moment().format(this._Configuration.dateFormat);
		let selectedDate = moment(date, this._Configuration.viFormatDate).format(this._Configuration.dateFormat);
		if (selectedDate >= current) {
			console.log('abc');
			this.search = this.clone(this.session_flight);
			if(option === 'from') {
				this.search.from_date = date;
			} else {
				this.search.to_date = date;
			}
			this.selectedStep = 0;
			this.onResearch();
		}
	}

	/*=================================
	 * Research
	 *=================================*/
	onResearch() {
		var objectStore = this.search;
		
		if (objectStore['from'] == objectStore['to']) {
			this.warningMsg = 'Điểm đi và Điểm đến không được trùng nhau.';
			this.warning.open();
			return;
		}
		if (this.filter_from_date['formatted']) {
			objectStore['from_date'] = moment(this.filter_from_date['formatted'], this._Configuration.viFormatDate).format(this._Configuration.dateFormat);
			if (objectStore['from_date'] < moment().format(this._Configuration.dateFormat)) {
				this.warningMsg = 'Ngày đi phải nhỏ hơn ngày hiện tại.';
				this.warning.open('sm');
				return;
			}
		}


		objectStore['from_name'] = this.getNameFromCode(objectStore['from']);
		objectStore['to_name'] = this.getNameFromCode(objectStore['to']);

		if (objectStore['to_date'] == undefined) {
			objectStore['to_date'] = '';

		} else {
			if (this.filter_to_date) {
				objectStore['to_date'] = moment(this.filter_to_date['formatted'], this._Configuration.viFormatDate).format(this._Configuration.dateFormat);
				if (objectStore['from_date'] > objectStore['to_date']) {
					this.warningMsg = 'Ngày đi phải nhỏ hơn Ngày đến.';
					this.warning.open();
					return;
				}
			}

			objectStore['to_name'] = this.getNameFromCode(objectStore['to']);
		}

		let uuid = UUID.UUID();
		this.sessionStorage.remove('session_flight');
		this.sessionStorage.remove('session_token');
		this.sessionStorage.set('session_token', uuid);
		this.sessionStorage.set('session_flight', JSON.stringify(objectStore));
		this._Router.navigate(['search-result/' + uuid]);
		this.selectedStep = 0;
	}

	/*=================================
	 * Select Flights
	 *=================================*/
	onSelectFlight(flight) {
		let number_children = this.session_flight['children'] ? +this.session_flight['children'] : 0;
		let number_infants = this.session_flight['infant'] ? +this.session_flight['infant'] : 0;
		flight['sum'] = (+this.session_flight['adult'] + number_children + number_infants) * ((+flight.price) + (+flight.fee))
		console.log(flight)
		if (flight.direction == 'from') {
			flight['directionvi'] = 'Lượt đi';
			this.listRoutes[0]['selectedFlight'] = flight;
		
		}

		if (flight.direction == 'to') {
			flight['directionvi'] = 'Lượt về';
			this.listRoutes[1]['selectedFlight'] = flight;

		}

		if ((this.session_flight['round_trip'] == 'off' && this.listRoutes[0]['selectedFlight']) || 
			(this.session_flight['round_trip'] == 'on' && this.listRoutes[0]['selectedFlight'] 
				&& this.listRoutes[1]['selectedFlight'])) {
			this.selectedStep = 2;

			this.generateNumberOptions(this.session_flight['adult'], 'Người lớn', 'adult');
			this.generateNumberOptions(this.session_flight['children'], 'Trẻ em', 'children');
			this.generateNumberOptions(this.session_flight['infant'], 'Em bé', 'infant');
			
			// Baggage Options
			this._BaggageTypeDataService.getAll(flight.airline).subscribe(res => {
				if (res.data) {
					var options = [];
					for (let key in res.data) {
						options.push(res.data[key]);
					}
					this.baggageOptionsFrom = options;
				}
			});

			if(this.round_trip) {
				this._BaggageTypeDataService.getAll(flight.airline).subscribe(res => {
					if (res.data) {
						var options = [];
						for (let key in res.data) {
							options.push(res.data[key]);
						}
						this.baggageOptionsTo = options;
					}
				})
			}

		}

	}

	/*=================================
	 * Generate string of customer
	 *=================================*/
	generateNumberOptions(n: number, label: string, key: string) {

		for (let i = 1; i <= n; i++) {
			let obj = {title: '', fullname: '', date_of_birth: '', label: name, key: key};
			this.passengers.push(obj);
		}
	}

	/*=================================
	 * Generate string of customer
	 *=================================*/
	generateStrCustomers() {
		let str = '';
		if(this.session_flight['adult']) {
			str += this.session_flight['adult'] + ' người lớn,';
		}
		if (this.session_flight['children']) {
			str += this.session_flight['children'] + ' trẻ em,';
		}
		if (this.session_flight['infant']) {
			str += this.session_flight['infant'] + ' em bé,';
		}
		str = str.substr(0, str.length - 2);
	}


	/*=================================
	 * Submit Info Customer
	 *=================================*/
	onSubmitInfoCustomer() {
		let isError = false;
		// Validate passengers
		for (let key in this.passengers) {
			if(!this.passengers[key].fullname) {
				console.log('fullname')
				isError = true;
				this.passengers[key].error_fullname = true;
			} else {
				this.passengers[key].error_fullname = false;
			}

			if (!this.passengers[key].date_of_birth) {
				console.log('date_of_birth')
				isError = true;
				this.passengers[key].error_error_date_of_birth = true;
			} else {
				this.passengers[key].error_error_date_of_birth = false;
			}
		}

		// Validate Contact
		if (!this.contact['fullname']) {
			isError = true;
			this.contact['error_fullname'] = true;
		} else {
			this.contact['error_fullname'] = false;
		}

		if (!this.contact['phone']) {
			isError = true;
			this.contact['error_phone'] = true;
		} else {
			var pattern = /^\(?([0-9]{3})\)?[-. ]?([0-9]{3})[-. ]?([0-9]{4}|[0-9]{5})$/;
			if (!this.contact['phone'].match(pattern)) {
				isError = true;
				this.contact['error_phone'] = true;
				this._ToasterService.pop('error', 'Số điện thoại không hợp lệ', 'Vui lòng điền đúng thông tin của số điện thoại.');
			} else {
				this.contact['error_phone'] = false;
			}

		}

		if (!this.contact['email']) {
			isError = true;
			this.contact['error_email'] = true;
		} else {
			var pattern = /^\S*@[a-zA-Z_]+?\.[a-zA-Z]{2,3}$/;
			if (!this.contact['email'].match(pattern)) {
				isError = true;
				this.contact['error_email'] = true;
				this._ToasterService.pop('error', 'Email không hợp lệ', 'Vui lòng điền đúng thông tin của email.');
			} else {
				this.contact['error_email'] = false;
			}

		}

		if(isError) {
			this._ToasterService.pop('error', 'Lỗi nhập liệu', 'Vui lòng điền đầy đủ thông tin.');
		} else {
			// Insert Booking
			var params: URLSearchParams = new URLSearchParams();
			params.set('code', this.generateCode());
			params.set('round_trip', this.session_flight['round_trip']);
			params.set('adult', this.session_flight['adult']);
			params.set('children', this.session_flight['children']);
			params.set('infant', this.session_flight['infant']);

			this._BookingDataService.create(params).subscribe(res => {
				if (res.status == 'success') {
					let booking = res.data;

					// Insert Booking Detail
					for (let key in this.listRoutes) {

						var params: URLSearchParams = new URLSearchParams();
						params.set('booking_id', booking.id);
						params.set('from', this.listRoutes[key].from);
						params.set('start_date', this.listRoutes[key].selectedFlight.start_date);
						params.set('start_time', this.listRoutes[key].selectedFlight.start_time);
						params.set('to', this.listRoutes[key].to);
						params.set('end_date', this.listRoutes[key].selectedFlight.end_date);
						params.set('end_time', this.listRoutes[key].selectedFlight.end_time);
						params.set('ticket_type', this.listRoutes[key].selectedFlight.type);

						this._BookingDetailDataService.create(params).subscribe(res => {
							if (res.status == 'success') {
								let booking_detail = res.data;
								// Insert Passengers
								for (let k in this.passengers) {
									var params: URLSearchParams = new URLSearchParams();
									params.set('booking_detail_id', booking_detail.id);
									params.set('title', this.passengers[k].title);
									params.set('fullname', this.passengers[k].fullname);
									var date_of_birth = moment(this.passengers[k].date_of_birth['formatted'], this._Configuration.viFormatDate).format(this._Configuration.formatDate);
									params.set('date_of_birth', date_of_birth);
									params.set('fare', this.listRoutes[key].price);

									this._PassengerDataService.create(params).subscribe(res => {
										this.selectedStep = 3;
									});
								}

							}
						});
					}

					// Insert Contact
					var params: URLSearchParams = new URLSearchParams();
					params.set('booking_id', booking.id);
					params.set('title', this.contact['title']);
					params.set('fullname', this.contact['fullname']);
					params.set('phone', this.contact['phone']);
					params.set('email', this.contact['email']);
					params.set('requirement', this.contact['requirement']);

					this._ContactDataService.create(params).subscribe(res => {

					});
				}
			});
		}
		
		
	}

	/*=================================
	 * Sort Price From min to max
	 *=================================*/
	sortPrice() {
		for (var key in this.listRoutes) {

			this.listRoutes[key].flights.sort((leftSide, rightSide): any => {
				var left_price = +leftSide.price;
				var right_price = +rightSide.price;
				
				if (left_price < right_price) return -1;
				if (left_price > right_price) return 1;
				return 0;
			})
		}

	}

	/*=================================
	 * Sort Time From min to max
	 *=================================*/
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

	/*=================================
	 * Sort Time From min to max
	 *=================================*/
	sortAirline() {
		for (var key in this.listRoutes) {

			this.listRoutes[key].flights.sort((leftSide, rightSide): any => {

				if (leftSide.flight_code < rightSide.flight_code) return -1;
				if (leftSide.flight_code > rightSide.flight_code) return 1;
				return 0;
			})
		}
	}

	selectPlaneOption(round_trip) {
		if (round_trip == 'off') {
			jQuery('#date-back input').prop('disabled', true);
		} else {
			jQuery('#date-back input').prop('disabled', false);
		}
	}

	/*=================================
	 * Inverse Flight
	 *=================================*/
  	protected inverseFlight(session_flight) {
		var temp = this.clone(session_flight);
		temp['from'] = session_flight['to'];
		temp['from_name'] = session_flight['to_name'];
		temp['to'] = session_flight['from'];
		temp['to_name'] = session_flight['from_name'];
		temp['from_date'] = session_flight['to_date'];
		return temp;

  	}

	/*=================================
	 * Get Lowest Price
	 *=================================*/
	getLowestPrice(data) {
		let arr = [];
		for (var key in data) {
			arr.push(data[key].price);
		}
		return this.min(arr);

	}

	min(array) {
		return Math.min.apply(Math, array);
	};

  	// Get Route
  	protected getRoute(route, option) {
		route['from_fly_date'] = moment(route['from_date']).format(this._Configuration.formatDate);
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

	protected generateCode() {
		var text = "";
		var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

		for (var i = 0; i < 6; i++)
			text += possible.charAt(Math.floor(Math.random() * possible.length));

		return text;
	}

}
