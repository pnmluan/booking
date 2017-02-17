import { Component, OnInit, Output, EventEmitter } from '@angular/core';
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
	@Output('order') orderOutput = new EventEmitter();
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

			function flyToElement(flyer, flyingTo) {
				var $func = jQuery(this);
				var flyerClone = jQuery(flyer).clone();
				jQuery(flyerClone).css({
					position: 'absolute',
					top: jQuery(flyer).offset().top + "px",
					left: jQuery(flyer).offset().left + "px",
					maxWidth: 266,
					opacity: 1,
					'z-index': 1000
				});
				jQuery('body').append(jQuery(flyerClone));
				var gotoX = jQuery(flyingTo).offset().left + "px";
				var gotoY;
				if (jQuery(window).width() < 1200) {
					gotoY = 46;
				} else {
					gotoY = 117;
				}



				jQuery(window).resize(function() {
					if (jQuery(window).width() < 1200) {
						gotoY = 46;
					} else {
						gotoY = 117;
					}
				});

				jQuery(flyerClone).animate({
					opacity: 0.4,
					left: gotoX,
					top: gotoY,
					width: 30,
					height: 34
				}, 700,
					function() {
						jQuery(flyingTo).fadeOut('fast', function() {
							jQuery(flyingTo).fadeIn('fast', function() {
								jQuery(flyerClone).fadeOut('fast', function() {
									jQuery(flyerClone).remove();
								});
							});
						});
					});
			}

			jQuery('.add-to-cart').on('click', function() {
				//Scroll to top if cart icon is hidden on top
				jQuery('html, body').animate({
					'scrollTop': jQuery(".cart_anchor").position().top
				});
				//Select item image and pass to the function
				var itemImg = jQuery(this).closest('.item').find('img').eq(0);
				flyToElement(jQuery(itemImg), jQuery('.cart_anchor'));
			});

			function resizeImage() {
				var a = jQuery('.item-inner').width();
				jQuery('.item-inner > a').height(a * 10 / 16);
			}

			
			
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
		let obj = {
			id: item.id,
			name: item.name,
			img: item.album[0].img,
			adult_fare: item.adult_fare,
			children_fare: item.children_fare,
			number_adult: item.order,
			number_children: 0
		};

		if (this.sessionStorage.get('cartItems')) {
			let cartItems = this.sessionStorage.get('cartItems');
			let count = 0;
			let existed = false;
			
			for(let key in cartItems) {
				if(cartItems[key].id == item.id) {
					cartItems[key].number_adult = +cartItems[key].number_adult + item.order;
					existed = true;
				}
				count++;
			}

			if(!existed){
				cartItems[count] = obj;	
			}
			this.sessionStorage.set('cartItems', cartItems);

		} else {
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
