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
	BaggageTypeDataService,
	ProviderDataService,
	FareDataService
} from '../../shared';

import { Contact } from '../../models';
import { Configuration } from '../../shared/app.configuration';
declare let moment: any;
declare let jQuery: any;

@Component({
  selector: 'search-result',
  templateUrl: './search-result.component.html',
  providers: [LocationDataService, AirlineDataService, BookingDataService, BookingDetailDataService, 
	  ContactDataService, PassengerDataService, BaggageTypeDataService, ProviderDataService, FareDataService]
})
export class SearchResultComponent implements OnInit, AfterViewInit {
	@ViewChild('warning') warning: ModalComponent;
	people = this._Configuration.arr_number_people;
	infants = this._Configuration.arr_number_infants;
	listRoutes = [];
	providers = [];
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
	optionsTax: string = 'not_tax';
	adultOptions = [];
	infantOptions = [];
	titleOptions = [];
	baggageOptions:any;
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
		private _ProviderDataService: ProviderDataService,
		private _FareDataService: FareDataService,
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

		
		this.steps = [
			{ value: 1, label: 'Tìm chuyến bay' },
			{ value: 2, label: 'Thông tin hành khác và chuyến bay' },
			{ value: 3, label: 'Xác nhận & Thanh toán' },

		];

		this.titleOptions['adult'] = [
			{ value: '1', label: 'Anh' },
			{ value: '2', label: 'Chị' },
			{ value: '3', label: 'Ông' },
			{ value: '4', label: 'Bà' },
			
		];

		this.contact['title'] = '1';

		this.titleOptions['children'] = [
			{ value: '5', label: 'Bé Trai' },
			{ value: '6', label: 'Bé Gái' }
		];

		this.titleOptions['infant'] = [
			{ value: '7', label: 'Em Bé Trai' },
			{ value: '8', label: 'Em Bé Gái' }
		];

		this.airlineOptions = {
			vietjet:true,
			jetstar: true,
			vna: true

		};

		// Get Provider's Fee
		var params: URLSearchParams = new URLSearchParams();
		params.set('is_key_value', 'true');
		this._ProviderDataService.getAll(params).subscribe(res => {

			if (res.data) {
				this.providers = res.data;
			}

		});

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
		const vietjet$ = this._AirlineDataService.vietjet(this.session_flight)
			.retryWhen(errors => errors.delay(5000));

		const jetstar$ = this._AirlineDataService.jetstar(this.session_flight)
			.retryWhen(errors => errors.delay(5000));

		const vna$ = this._AirlineDataService.vna(this.session_flight)
			.retryWhen(errors => errors.delay(5000));


		Observable.forkJoin(vietjet$, jetstar$, vna$).subscribe(res => {

			this.airlines['vietjet'] = this.convertTaxAirline('vietjet',res[0]);
			this.airlines['jetstar'] = this.convertTaxAirline('jetstar', res[1]);
			this.airlines['vna'] = this.convertTaxAirline('vna', res[2]);

			this.lowestFilter['vietjet'] = this.getLowestPrice(this.airlines['vietjet'].dep_flights, this.optionsTax);
			this.lowestFilter['jetstar'] = this.getLowestPrice(this.airlines['jetstar'].dep_flights, this.optionsTax);
			this.lowestFilter['vna'] = this.getLowestPrice(this.airlines['vna'].dep_flights, this.optionsTax);
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

		
		this.generalData['round'] = 'Một chiểu';

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

	/*=================================
	 * Update Checkeck Options
	 *=================================*/
	updateCheckedOptions(option, event) {
		this.airlineOptions[option] = event.target.checked;
		this.filterAirlines();
		this.sort = 'airline';
	}

	/*=================================
	 * Convert Tax Airline
	 *=================================*/
	convertTaxAirline(key, airline) {
		if (airline) {
			if (airline.dep_flights) {
				for (let k in airline.dep_flights) {
					airline.dep_flights[k].price_tax = this.processFareWithTaxAdult(+airline.dep_flights[k].price, this.providers[key]);
				}
			}
		}
		return airline;
	}

	/*=================================
	 * Process Fare With Tax
	 *=================================*/
	processFareWithTaxAdult(price, provider) {
		let vat = (price + provider.admin_fee) * 0.1;
		let sum = Math.round(price + vat + provider.adult_airport_fee + provider.adult_security_fee + provider.payment_fee);

		return sum;
	}

	/*=================================
	 * Filter airlines
	 *=================================*/
	filterAirlines() {
		this.listRoutes = [];
		let from_flights = this.getRoute(this.session_flight, 'from');
		from_flights['class'] = 'flight-go';
		let to_flights = {};
		// Check one-way or round-trip
		if (this.session_flight['round_trip'] === 'on') {
			this.round_trip = true;
			this.generalData['round'] = 'Khứ hồi';
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

	/*=================================
	 * Push Departure Flights
	 *=================================*/
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

	/*=================================
	 * Push Return Flights
	 *=================================*/
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

	/*=================================
	 * Set Date
	 *=================================*/
	setDate(date, option) {
		let current = moment().format(this._Configuration.dateFormat);
		let selectedDate = moment(date, this._Configuration.viFormatDate).format(this._Configuration.dateFormat);
		if (selectedDate >= current) {
			this.search = this.clone(this.session_flight);
			if(option === 'from') {
				this.search['from_date'] = selectedDate;
			} else {
				this.search['to_date'] = selectedDate;
			}
			this.onResearch(true);
		}
	}

	/*=================================
	 * Research
	 *=================================*/
	onResearch(setDate = false) {
		var objectStore = this.search;
		if(!setDate) {
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

		flight.selected = true;
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

			this.generateNumberOptions(+this.session_flight['adult'], 'Người lớn', 'adult');
			this.generateNumberOptions(+this.session_flight['children'], 'Trẻ em', 'children');
			this.generateNumberOptions(+this.session_flight['infant'], 'Em bé', 'infant');

			this.generalData['str_people'] = this.generateStrCustomers();
			this.generalData['spend_time'] = this.estimateSpendTime(flight['start_time'], flight['end_time']);
			
			// Baggage Options

			this.getBaggageType(flight.airline);
			console.log(this.listRoutes);
			this.selectedStep = 2;
		}

	}

	/*=================================
	 * Get Baggage Type
	 *=================================*/
	getBaggageType(airline) {
		let options = [];
		this._BaggageTypeDataService.getAll(airline).subscribe(res => {
			let baggageTypes = res.data;
			if (baggageTypes) {
			
				let options = [{ value: '0', label: 'Không mang theo hành lý' }];
				for (let key in baggageTypes) {
					var label = 'Thêm ' + baggageTypes[key].name + ' hành lý ' + baggageTypes[key].fare + ' VNĐ';
					var temp = { value: baggageTypes[key].id, label: label };
					options.push(temp);
				}
				this.baggageOptions = options;
			} 
			console.log(this.baggageOptions);
		})
	}

	/*=================================
	 * Generate string of customer
	 *=================================*/
	generateNumberOptions(n: number, label: string, key: string) {
		for (let i = 1; i <= n; i++) {
			let obj = {
				title: String(this.titleOptions[key][0].value), 
				fullname: '', 
				date_of_birth: '', 
				name: label, 
				key: key,
				from_baggage_type: '0',
				to_baggage_type: '0'
			};
			this.passengers.push(obj);
		}

	}

	/*=================================
	 * Generate string of customer
	 *=================================*/
	estimateSpendTime(start_time, end_time) {
		let time_format = 'HH:mm';
		let time = moment(end_time, time_format) - moment(start_time, time_format);
		let hour = moment.duration(time).hours();
		let min = moment.duration(time).minutes();
		return hour + ' giờ + ' + min + ' phút';
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
		str = str.substr(0, str.length - 1);
		return str;
	}


	/*=================================
	 * Submit Info Customer
	 *=================================*/
	onSubmitInfoCustomer() {
		let isError = false;
		// Validate passengers
		for (let key in this.passengers) {
			if(!this.passengers[key].fullname) {
				isError = true;
				this.passengers[key].error_fullname = true;
			} else {
				this.passengers[key].error_fullname = false;
			}

			if (!this.passengers[key].date_of_birth) {
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
			this.generalData['generateCode'] = this.generateCode()
			var params: URLSearchParams = new URLSearchParams();
			params.set('code', this.generalData['generateCode']);
			params.set('round_trip', this.session_flight['round_trip']);
			params.set('adult', this.session_flight['adult']);
			params.set('children', this.session_flight['children']);
			params.set('infant', this.session_flight['infant']);
			params.set('state', 'pending');

			this._BookingDataService.create(params).subscribe(res => {
				if (res.status == 'success') {
					let booking = res.data;

					// Insert Booking Detail
					for (let key in this.listRoutes) {
						var selectedFlight = this.listRoutes[key].selectedFlight;
						var params: URLSearchParams = new URLSearchParams();
						params.set('booking_id', booking.id);
						params.set('from', selectedFlight.from);
						params.set('start_date', selectedFlight.start_date);
						params.set('start_time', selectedFlight.start_time);
						params.set('to', selectedFlight.to);
						params.set('end_date', selectedFlight.end_date);
						params.set('end_time', selectedFlight.end_time);
						params.set('ticket_type', selectedFlight.type);
						params.set('ticket_type', selectedFlight.type);

						this._BookingDetailDataService.create(params).subscribe(res => {
							if (res.status == 'success') {
								let booking_detail = res.data;

								// Insert Passengers
								this.insertPassengerWithFare(booking_detail.id, selectedFlight);

							}
						});
					}

					this.insertContactInfo(booking.id);
				}
			});
		}
		
		
	}

	/*=================================
	 * Insert Passenger with Fare
	 *=================================*/
	insertPassengerWithFare(booking_detail_id, selectedFlight) {
		
		for (let k in this.passengers) {
			var params: URLSearchParams = new URLSearchParams();
			params.set('booking_detail_id', booking_detail_id);
			params.set('customer_type', this.passengers[k].title);
			params.set('fullname', this.passengers[k].fullname);
			var date_of_birth = moment(this.passengers[k].date_of_birth['formatted'], this._Configuration.viFormatDate).format(this._Configuration.formatDate);
			params.set('date_of_birth', date_of_birth);

			this._PassengerDataService.create(params).subscribe(res => {
				if (res.data) {
					let passenger = res.data;
					// Insert Fare Info
					this.insertFareInfoAndBaggageType(passenger, 1, selectedFlight);

				}
				
			});
		}
	}

	/*=================================
	 * Insert Fare Info And Baggage Type
	 *=================================*/
	insertFareInfoAndBaggageType(passenger, baggage_type_id, selectedFlight) {
		let provider = this.providers[selectedFlight.airline];
		let key = this.getKeyByAge(passenger.customer_type);
		var params: URLSearchParams = new URLSearchParams();
		params.set('passenger_id', String(passenger.id));
		params.set('baggage_type_id', String(baggage_type_id));
		params.set('round_trip', String(this.listRoutes.length));
		
		params.set('charge', String(50000));
		let vat: number;
		let price: number;
		if(key == 'infant') {
			price = provider[key + '_infant'];
			vat = 0;
			params.set('airport_fee', String(0));
			params.set('security_fee', String(0));
		} else {
			price = selectedFlight.price;
			vat = (+selectedFlight.price + provider.admin_fee) * 0.1;
			params.set('airport_fee', String(provider[key + '_airport_fee']));
			params.set('security_fee', String(provider[key + '_security_fee']));
		}
		params.set('fare', String(price));
		params.set('vat', String(vat));
		params.set('admin_fee', String(provider.admin_fee));
		params.set('other_tax', String(provider.other_tax));
		params.set('payment_fee', String(provider.payment_fee));
		this._FareDataService.create(params).subscribe(res => {
			if(res.data) {
				this.selectedStep = 3;
			}
		});
	}

	/*=================================
	 * Insert Contact Info
	 *=================================*/
	insertContactInfo(booking_id) {
		// Insert Contact
		var params: URLSearchParams = new URLSearchParams();
		params.set('booking_id', booking_id);
		params.set('title', this.contact['title']);
		params.set('fullname', this.contact['fullname']);
		params.set('phone', this.contact['phone']);
		params.set('email', this.contact['email']);
		params.set('requirement', this.contact['requirement']);

		this._ContactDataService.create(params).subscribe(res => {

		});
	}

	/*=================================
	 * Get Key By Age
	 *=================================*/
	getKeyByAge(customer_type) {
		let title = '';
		switch (customer_type) {
			case 5:
			case 6:
				title = 'children';
				break;
			case 7:
			case 8:
				title = 'children';
				break;
			default:
				title = 'adult';
				break;
		}
		return title;
	}
	/*=================================
	 * Submit Contact Form
	 *=================================*/
	onSubmitContact() {

	}

	/*=================================
	 * Change Option Tax
	 *=================================*/
	onChangeOptionTax(option) {
		this.lowestFilter['vietjet'] = this.getLowestPrice(this.airlines['vietjet'].dep_flights, option);
		this.lowestFilter['jetstar'] = this.getLowestPrice(this.airlines['jetstar'].dep_flights, option);
		this.lowestFilter['vna'] = this.getLowestPrice(this.airlines['vna'].dep_flights, option);
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


	/*=================================
	 * Get Lowest Price
	 *=================================*/
	getLowestPrice(data, option) {
		let arr = [];
		if(option == 'tax') {
			for (var key in data) {
				arr.push(data[key].price_tax);
			}
		} else {
			for (var key in data) {
				arr.push(data[key].price);
			}
		}
		
		return this.min(arr);

	}

	min(array) {
		return Math.min.apply(Math, array);
	};

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
	 * Get Route Flight
	 *=================================*/
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

  	/*=================================
	 * Get Date Object
	 *=================================*/
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

	/*=================================
	 * Get Name From Code
	 *=================================*/
	protected getNameFromCode(code: string) {
		let label = '';
		for (var key in this.locations) {
			if (this.locations[key].value == code)
				return this.locations[key].label;
		}
		return label;
	}

	/*=================================
	 * Clone
	 *=================================*/
  	protected clone(obj) {
		if (null == obj || "object" != typeof obj) return obj;
		var copy = obj.constructor();
		for (var attr in obj) {
			if (obj.hasOwnProperty(attr)) copy[attr] = obj[attr];
		}
		return copy;
	}

	/*=================================
	 * Generate Code
	 *=================================*/
	protected generateCode() {
		var text = "";
		var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

		for (var i = 0; i < 6; i++)
			text += possible.charAt(Math.floor(Math.random() * possible.length));

		return text;
	}

}
