import { Component, OnInit } from '@angular/core';
import { EntranceTicketDataService } from '../../shared';
import { LocalStorageService } from 'angular-2-local-storage';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  providers: [EntranceTicketDataService]
})
export class HeaderComponent implements OnInit {
	private _opened: boolean = false;
	public number_order: number = 0;
	cartItems:any;
	sumPrice: number = 0;
	imgPath: string = this._EntranceTicketDataService.imgPath;
	
  	constructor(
		private sessionStorage: LocalStorageService,
		private _EntranceTicketDataService: EntranceTicketDataService,
  	) { }
  	ngOnInit() {
			
  	}
  	/*=================================
	 * Toggle Sidebar
	 *=================================*/
	_toggleSidebar() {

		this._opened = !this._opened;
		this.cartItems = this.sessionStorage.get('cartItems');
		let sum = 0;
		for(let key in this.cartItems) {
			var item = this.cartItems[key];
			sum = sum + item.number_adult * item.adult_fare + item.children_adult * item.children_fare
		}
		this.sumPrice = sum;
	}

}
