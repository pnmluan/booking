import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { URLSearchParams } from '@angular/http';

import { Configuration } from '../../../shared/app.configuration';
import { EntranceTicketDataService, TicketBillDataService, TicketDetailDataService,
	ContactDataService, MailDataService
} from '../../../shared';

import { Subscription } from 'rxjs/Rx';
import { AgmCoreModule } from 'angular2-google-maps/core';
import { LocalStorageService } from 'angular-2-local-storage';
import { ToasterModule, ToasterService } from 'angular2-toaster';

declare let jQuery: any;
declare let moment: any;

@Component({
  selector: 'app-paymment-ticket',
  templateUrl: './payment-ticket.component.html',
  providers: [ EntranceTicketDataService, TicketBillDataService, TicketDetailDataService,
	  ContactDataService, MailDataService ]
})
export class PaymentTicketComponent implements OnInit {
	private subscriptionEvents: Subscription;
	private subscriptionParam: Subscription;
	public comments = [];
	selectedStep = 1;
	filter_from_date: any;
	curRouting?: string;
	_params = {};
	contact = {};
	Ticket = {};
	listItems = {};
	titleOptions = [];
	titleAdultOptions = {};
	generalData = {};
	amount: number = 0;
	isAddPeople = false;
	imgPath: string = this._EntranceTicketDataService.imgPath;
	lat: number;
	lng: number;

	constructor(
		private _EntranceTicketDataService: EntranceTicketDataService,
		private _TicketBillDataService: TicketBillDataService,
		private _TicketDetailDataService: TicketDetailDataService,
		private _ContactDataService: ContactDataService,
		private _MailDataService: MailDataService,
		private _Configuration: Configuration,
		private _Router: Router,
		private _ActivatedRoute: ActivatedRoute,
		private _ToasterService: ToasterService,
		private sessionStorage: LocalStorageService
	) { 
		// subscribe to router event
		this.subscriptionParam = _ActivatedRoute.params.subscribe(
			(param: any) => {
				this._params = param;

			}
		);

		this.subscriptionEvents = this._Router.events.subscribe((val) => {

			let routing = this._Router.url;
			if (this.curRouting != routing) {
				if (this._Configuration.number_order) {
					this.curRouting = routing;
					this.initData();
				} 

				
			}
		});

		this.contact['title'] = '1';

		this.titleOptions['adult'] = [
			{ value: '1', label: 'Anh' },
			{ value: '2', label: 'Chị' },
			{ value: '3', label: 'Ông' },
			{ value: '4', label: 'Bà' },
			
		];

		this.titleAdultOptions = {
			'1': 'Anh',
			'2': 'Chị',
			'3': 'Ông',
			'4': 'Bà'
		};
	}

  	ngOnInit() {
		this.listItems = this.sessionStorage.get('cartItems');
		if(this.listItems){
			for(let key in this.listItems){
				this.amount += ((+this.listItems[key].number_adult * +this.listItems[key].adult_fare) 
								+ (+this.listItems[key].number_children * +this.listItems[key].children_fare));
			}
		}
	}

  	initData() { }

  	onPlusPeople(value) {
		value = value + 1;
  	}

	onMinusPeople(value) {
		if(value) {
			value = value - 1;
		}
  	}

	onLinkToCart(){
		this._Router.navigate(['cart-ticket']);
	}

  	/*=================================
	 * Submit Info Customer
	 *=================================*/
	onSubmitInfoCustomer() {
		let isError = false;
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
		}else{
			// Insert Ticket Bill
			let cartItems = this.sessionStorage.get('cartItems');
			let total_fare = 0;
			for(let key in cartItems) {
				total_fare += +cartItems[key].total;
			}
			let code = this.generateCode()
			this.generalData['generateCode'] = code;
			this.generalData['total_fare'] = total_fare;
			let now = moment().add(24, 'h');
			let expired_payment_date = now.format(this._Configuration.longDateTime);
			let long_expired_payment_date = now.format(this._Configuration.longFormatDateTime)
			var params: URLSearchParams = new URLSearchParams();
			params.set('code', code);
			params.set('total_fare', String(total_fare));
			params.set('expired_payment_date', expired_payment_date);
			params.set('state', 'pending');

			this._TicketBillDataService.create(params).subscribe(res => {
				if (res.data) {
					let ticketBill = res.data;
					console.log(cartItems)

					// Insert Ticket Detail
					for (let key in cartItems) {
						var selectedTicket = cartItems[key];
						var params: URLSearchParams = new URLSearchParams();
						params.set('ticket_bill_id', ticketBill.id);
						params.set('entrance_ticket_id', selectedTicket.id);
						params.set('adult', selectedTicket.adult);
						params.set('children', selectedTicket.children);
						params.set('departure', selectedTicket.departure);

						this._TicketDetailDataService.create(params).subscribe(res => {
							if (res.data) {

							}
						});
					}
					
					this.sendEntranceTicketPayment(cartItems, long_expired_payment_date);
					this.selectedStep = 2;
					this._Configuration.number_order = 0;
					this.insertContactInfo(ticketBill.id);
					this.sessionStorage.remove('cartItems');

				}
			});
		}
	}

	/*=================================
	 * Insert Contact Info
	 *=================================*/
	insertContactInfo(ticket_bill_id) {
		// Insert Contact
		var params: URLSearchParams = new URLSearchParams();
		params.set('ticket_bill_id', ticket_bill_id);
		params.set('title', this.contact['title']);
		params.set('fullname', this.contact['fullname']);
		params.set('phone', this.contact['phone']);
		params.set('email', this.contact['email']);
		params.set('requirement', this.contact['requirement']);

		this._ContactDataService.create(params).subscribe(res => {
			if(res.data) {
				this.generalData['contact_id'] = res.data.id;
			}
			
		});
	}

	/*=================================
	 * Update Contact Info
	 *=================================*/
	onUpdateContactInfo() {
		let contact_id = this.generalData['contact_id'];
		if (contact_id) {
			// Update Contact
			var params: URLSearchParams = new URLSearchParams();
			params.set('title', this.contact['title']);
			params.set('fullname', this.contact['fullname']);
			params.set('phone', this.contact['phone']);
			params.set('email', this.contact['email']);
			params.set('requirement', this.contact['requirement']);

			this._ContactDataService.update(contact_id, params).subscribe(res => {
				if (res.data) {
					this._ToasterService.pop('success', 'Cập nhật thành công.');
				}
			});
		}
		
	}

	/*=================================
	 * Send Info Payment Mail
	 *=================================*/
	sendEntranceTicketPayment(routes, expired_payment_date) {

		var params: URLSearchParams = new URLSearchParams();
		params.set('tickets', JSON.stringify(routes));
		params.set('expired_payment_date', expired_payment_date);
		params.set('fullname', this.contact['fullname']);
		params.set('phone', this.contact['phone']);
		params.set('email', this.contact['email']);
		params.set('requirement', this.contact['requirement']);
		params.set('code', this.generalData['generateCode']);
		params.set('title', this.titleAdultOptions[this.contact['title']]);
		params.set('total_fare', String(this.generalData['total_fare']));

		this._MailDataService.sendEntranceTicketPayment(params).subscribe(res => {

		});
	}

	ngOnDestroy() {
		this.subscriptionEvents.unsubscribe();
		this.subscriptionParam.unsubscribe();
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
