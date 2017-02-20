import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Configuration } from '../../../shared/app.configuration';
import { EntranceTicketDataService } from './../../../shared';
import { LocalStorageService } from 'angular-2-local-storage';
import { ToasterModule, ToasterService } from 'angular2-toaster';

declare let moment: any;

@Component({
	selector: 'app-cart-ticket',
	templateUrl: './cart-ticket.component.html',
	providers: [EntranceTicketDataService]
})
export class CartTicketComponent implements OnInit {
	public number_order: number = 0;
	cartItems: any;
	sumPrice: number = 0;
	imgPath: string = this._EntranceTicketDataService.imgPath;
	datepickerOptions: Array<any> = [];

	constructor(
		private sessionStorage: LocalStorageService,
		private _EntranceTicketDataService: EntranceTicketDataService,
		private _Router: Router,
		private _Configuration: Configuration,
		private _ToasterService: ToasterService
	) { }
	ngOnInit() {
		this.cartItems = this.sessionStorage.get('cartItems');
		this.processTotal();
	}
	/*=================================
	 * Process Total
	 *=================================*/
	processTotal() {
		let sum = 0, count = 0;
		let booking_date = null;

		for (let key in this.cartItems) {
			var item = this.cartItems[key];
 			
 			if(this.cartItems[key].departure){
 				let departure = moment(this.cartItems[key].departure, this._Configuration.viFormatDate).format(this._Configuration.dateFormat);
 				booking_date = new Date(departure);
 			}else{
 				booking_date = new Date();
 			}

			this.datepickerOptions[key] = { 
				format: this._Configuration.viFormatDate,
				autoApply: true,
				locate: 'vi', style: 'big',
				initialDate: booking_date
			};

			var total = (item.number_adult * item.adult_fare) + (item.number_children * item.children_fare);
			sum = sum + total;

			this.cartItems[key].total = total;
			count++; 
		}
		//update cart
		this.sessionStorage.set('cartItems', this.cartItems);
		this.sumPrice = sum;
		this._Configuration.number_order = count;
	}

	/*=================================
	 * Remove Ticket
	 *=================================*/
	onRemoveTicket(index, item) {
		this.cartItems.splice(index, 1);
		this.processTotal();
		
	}

	/*=================================
	 * Plus People
	 *=================================*/
	onPlusPeople(index, key) {
		this.cartItems[index][key]++;
		this.processTotal();
	}


	/*=================================
	 * Minus People
	 *=================================*/
	onMinusPeople(index, key) {
		console.log(this.cartItems[index][key])
		if (this.cartItems[index][key] > 1) {
			this.cartItems[index][key]--;
			this.processTotal();
		}
	}

	onLinkToPaymentTicket(){
		let today = moment().format(this._Configuration.dateFormat);
		for(let key in this.cartItems){
			let departure = this.cartItems[key].departure.formatted;
			let booking_date = moment(departure, this._Configuration.viFormatDate).format(this._Configuration.dateFormat);
			if(booking_date < today){
				this._ToasterService.pop('error', 'Lỗi nhập liệu', 'Vui lòng kiểm tra lại ngày tham quan tour ' + this.cartItems[key].name + '.');
				return;
			}
		}
		this._Router.navigate(['payment-ticket']);
	}

}

