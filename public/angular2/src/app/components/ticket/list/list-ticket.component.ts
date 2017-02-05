import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { URLSearchParams } from '@angular/http';

import { Configuration } from '../../../shared/app.configuration';

import { CategoryTicketDataService } from '../../../shared/categoryticket.dataservice';
import { EntranceTicketDataService } from '../../../shared/entranceticket.dataservice';
import { LocalStorageService } from 'angular-2-local-storage';
import { Subscription } from 'rxjs/Rx';
declare let jQuery: any;

@Component({
  selector: 'app-list-ticket',
  templateUrl: './list-ticket.component.html',
  providers: [CategoryTicketDataService, EntranceTicketDataService]
})
export class ListTicketComponent implements OnInit {
	private subscriptionEvents: Subscription;
	private querySubscription: Subscription;
	public categoryTicketOptions = [];
	queryParams = {};
	listItem = [];
	curRouting?: string;
	search = {};
	imgPath: string = this._EntranceTicketDataService.imgPath;
	constructor(
		private _CategoryTicketDataService: CategoryTicketDataService, 
		private _EntranceTicketDataService: EntranceTicketDataService,
		private config: Configuration,
		private _Router: Router,
		private _ActivatedRoute: ActivatedRoute,
		private sessionStorage: LocalStorageService, 
	) { 

		this.querySubscription = _ActivatedRoute.queryParams.subscribe(
			(param: any) => {
				this.queryParams = param;
			}
		)
		setTimeout(() => {
			this.search['category_ticket_id'] = this.queryParams['category_ticket_id'];
		}, 500);
		
		this.subscriptionEvents = this._Router.events.subscribe((val) => {
			let routing = this._Router.url;
			if (this.curRouting != routing) {
				this.curRouting = routing;
				this.initData();
			}
		});
	}

  	ngOnInit() {
		
		this._CategoryTicketDataService.getAll().subscribe(res => {
			let categoryTicketOptions = [];
			if (res.data) {
				for (let key in res.data) {

					var temp = {
						value: String(res.data[key].id),
						label: res.data[key].name
					};

					categoryTicketOptions.push(temp);

				}
				this.categoryTicketOptions = categoryTicketOptions;
				console.log(categoryTicketOptions)
			}
		});
  	}

  	initData() {
		var params: URLSearchParams = new URLSearchParams();
		params.set('category_ticket_id', this.search['category_ticket_id']);
			// params.set('round_trip', this.session_flight['round_trip']);
		this._EntranceTicketDataService.getAll(params).subscribe(res => {
			let listItem = [];
			if (res.data) {
				for (let key in res.data) {
					res.data[key].order = 1;
					listItem.push(res.data[key]);

				}
				this.listItem = listItem;
			}
		});

		setTimeout(()=>{
			jQuery('.tours-list .item .item-inner h3').matchHeight({
				byRow: true,
				property: 'height',
				target: null,
				remove: false
			});
			jQuery('.tours-list .item .item-inner p').matchHeight({
				byRow: true,
				property: 'height',
				target: null,
				remove: false
			});

			this.resizeImage();
			
		},1000)
  	}

  	/*=================================
	 * Search Ticket
	 *=================================*/
	onSearch() {
		this.initData();
	}

	/*=================================
	 * Add To Cart
	 *=================================*/
	addToCart(item) {
		if (this.sessionStorage.get('cartItems')) {
			let cartItems = this.sessionStorage.get('cartItems');
			let count = 0;
			for(let key in cartItems) {
				if(cartItems[key].id == item.id) {
					cartItems[key].number_adult = +cartItems[key].number_adult + item.order;
				}
				count++;
			}

			let obj = {
				id: item.id,
				name: item.name,
				img: item.album[0].img,
				adult_fare: item.adult_fare,
				children_fare: item.children_fare,
				number_adult: item.order,
				number_children: 0
			};
			cartItems[count] = obj;
			this.sessionStorage.set('cartItems', cartItems);
			

		} else {
			
			let obj = {
				id: item.id,
				name: item.name,
				img: item.album[0].img,
				adult_fare: item.adult_fare,
				children_fare: item.children_fare,
				number_adult: item.order,
				number_children: 0
			};
			let cartItems = [obj];
			this.sessionStorage.set('cartItems', cartItems);
		}
		item.order = 1;

	}

	resizeImage() {
		var a = jQuery('.item-inner').width();
		jQuery('.item-inner > a').height(a * 10 / 16);
	}



	ngOnDestroy() {
		this.subscriptionEvents.unsubscribe();
		this.querySubscription.unsubscribe();
	}

}
