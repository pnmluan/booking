import { Component, OnInit } from '@angular/core';
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
	) { }
	ngOnInit() {
		this.cartItems = this.sessionStorage.get('cartItems');
		let sum = 0;
		for (let key in this.cartItems) {
			var item = this.cartItems[key];

			var total = (item.number_adult * item.adult_fare) + (item.number_children * item.children_fare);
			sum = sum + total;

			this.cartItems[key].total = total;
			this.cartItems[key].is_show = false;
		}
		this.sumPrice = sum;
	}
	/*=================================
	 * Toggle Sidebar
	 *=================================*/
	onRemoveTicket(index, item) {
		this.sumPrice = this.sumPrice - (item.number_adult * item.adult_fare) - (item.number_children * item.children_fare);
		this.cartItems.splice(index, 1);
		
	}

	/*=================================
	 * Plus People
	 *=================================*/
	onPlusPeople(value) {
		value = value + 1;
		console.log(value)
		return value;
	}

	/*=================================
	 * Minus People
	 *=================================*/
	onMinusPeople(value) {
		if (value) {
			value = value - 1;
		}
	}


}

