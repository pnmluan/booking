import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { EntranceTicketDataService } from './../../../shared';
import { LocalStorageService } from 'angular-2-local-storage';

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

	constructor(
		private sessionStorage: LocalStorageService,
		private _EntranceTicketDataService: EntranceTicketDataService,
		private _Router: Router,
	) { }
	ngOnInit() {
		this.cartItems = this.sessionStorage.get('cartItems');
		this.processTotal();
	}
	/*=================================
	 * Process Total
	 *=================================*/
	processTotal() {
		let sum = 0;
		for (let key in this.cartItems) {
			var item = this.cartItems[key];

			var total = (item.number_adult * item.adult_fare) + (item.number_children * item.children_fare);
			sum = sum + total;

			this.cartItems[key].total = total;
		}
		//update cart
		this.sessionStorage.set('cartItems', this.cartItems);
		this.sumPrice = sum;
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
		if (this.cartItems[index][key]) {
			this.cartItems[index][key]--;
			this.processTotal();
		}
	}

	onLinkToPaymentTicket(){
		this._Router.navigate(['payment-ticket']);
	}

}

