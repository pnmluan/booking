import { Component, OnInit, AfterViewInit, ViewChild, ViewContainerRef, ComponentFactoryResolver } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { Router } from '@angular/router';
import {
	FormControl,
	Validators,
	FormArray
} from "@angular/forms";
import { LocalStorageService } from 'angular-2-local-storage';
import { SelectModule } from 'angular2-select';
import { UUID } from 'angular2-uuid';
import { ModalComponent } from 'ng2-bs3-modal/ng2-bs3-modal';
import { Subscription } from 'rxjs/Rx';
import { Configuration } from '../../shared/app.configuration';
import { LocationDataService, CategoryTicketDataService, BannerDataService } from '../../shared';
import { BannerComponent } from './banner/banner.component';

declare let jQuery: any;
declare let moment: any;

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  providers: [ LocationDataService, CategoryTicketDataService, BannerDataService ]
})
export class HomeComponent implements OnInit, AfterViewInit {
	@ViewChild('warning') warning: ModalComponent;
	@ViewChild('banner', {read: ViewContainerRef }) banner: ViewContainerRef;

	private subscriptionEvents: Subscription;
	Filter = {};
	filterTicket: string;
	curRouting?: string;
	warningMsg = '';
	adultOptions = [];
	infantOptions = [];
	locationOptions = [];
	categoryTicketOptions = [];
	round_trip = 'off';
	filter_from_date: any;
	filter_to_date: any;
	datepickerOptions = { format: this._Configuration.viFormatDate, autoApply: true, locate: 'vi', style: 'normal' };
	constructor(
		private _LocationDataService: LocationDataService,
		private _BannerDataService: BannerDataService,
		private _Configuration: Configuration,
		private _CategoryTicketDataService: CategoryTicketDataService, 
		private sessionStorage: LocalStorageService,
		private _Router: Router,
		private _componentFactoryResolver: ComponentFactoryResolver,
		private _title: Title
	) {
		this.subscriptionEvents = this._Router.events.subscribe((val) => {
			let routing = this._Router.url;
			if (this.curRouting != routing) {
				this.curRouting = routing;
				this.initData();
			}
		});
	}

	// initialize data
	initData() {
		//load banner
		this.banner.clear();
		let childComponent = this._componentFactoryResolver.resolveComponentFactory(BannerComponent);
		this.banner.createComponent(childComponent);

		this.Filter['round_trip'] = 'off';
		// Location Options
		this._LocationDataService.getAll().subscribe(res => {

			if (res.data) {
				var locationOptions = [];
				for (var key in res.data) {

					var temp = {
						value: res.data[key].code,
						label: res.data[key].name
					};
					locationOptions.push(temp);

				}
				this.locationOptions = locationOptions;
			}

		});

		// CategoryTicket Options
		this._CategoryTicketDataService.getAll().subscribe(res => {
			if (res.data) {
				var categoryTicketOptions = [];
				for (var key in res.data) {

					var temp = {
						value: res.data[key].clean_url,
						label: res.data[key].name
					};
					categoryTicketOptions.push(temp);

				}
				this.categoryTicketOptions = categoryTicketOptions;
			}
		});

		// List Options Adult
		let adultOptions = [];
		let arr_number_people = this._Configuration.arr_number_people;
		for (let key in arr_number_people) {

			var temp = {
				value: arr_number_people[key],
				label: arr_number_people[key]
			};
			adultOptions.push(temp);
			
		}
		this.adultOptions = adultOptions;

		// List Options Infant
		let infantOptions = [];
		let arr_number_infants = this._Configuration.arr_number_infants;
		for (let key in arr_number_infants) {

			var temp = {
				value: arr_number_infants[key],
				label: arr_number_infants[key]
			};
			infantOptions.push(temp);

		}
		this.infantOptions = infantOptions;

		
		jQuery('.date').datetimepicker({
			format: 'DD/MM/YYYY',
			allowInputToggle: true
		});
	}
	

	ngOnInit() {
		this._title.setTitle('Homepage - Đặt vé siêu rẻ');
	}

	ngAfterViewInit() {}
	
	/*=================================
	 * Filter Arlines
	 *=================================*/
	onFilterArlines() {
		var objectStore = this.Filter;
		console.log(this.Filter);

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

		if (!this.filter_to_date) {
			objectStore['to_date'] = '';

		} else {
			if (this.filter_to_date['formatted']) {
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
		
		
	}

	/*=================================
	 * Search Ticket
	 *=================================*/
	onSearchTicket() {
		// let queryParams = '';
		// if (this.filterTicket['category_ticket_id']) {
		// 	queryParams = '?category_ticket_id=' + this.filterTicket['category_ticket_id'];
		// }

		// this._Router.navigateByUrl('/list-tickets/' + queryParams);
		this._Router.navigate(['list-tickets', this.filterTicket]);
	}

	/*=================================
	 * Get Name From Code
	 *=================================*/
	protected getNameFromCode(code: string) {
		let label = '';
		for (var key in this.locationOptions) {
			if (this.locationOptions[key].value == code)
				return this.locationOptions[key].label;
		}
		return label;
	}

	ngOnDestroy() {
		this.subscriptionEvents.unsubscribe();
	}

}
