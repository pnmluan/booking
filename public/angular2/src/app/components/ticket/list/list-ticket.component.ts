import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { URLSearchParams } from '@angular/http';

import { Configuration } from '../../../shared/app.configuration';

import { CategoryTicketDataService, EntranceTicketDataService } from '../../../shared/';
import { LocalStorageService } from 'angular-2-local-storage';
import { Subscription } from 'rxjs/Rx';
declare let jQuery: any;

@Component({
  selector: 'app-list-ticket',
  templateUrl: './list-ticket.component.html',
  providers: [ CategoryTicketDataService, EntranceTicketDataService]
})
export class ListTicketComponent implements OnInit {
	private subscriptionEvents: Subscription;
	private querySubscription: Subscription;
	public categoryTicketOptions = [];

	params = {};
	listItem = [];
	curRouting?: string;
	view: string = 'grid';
	search: string;
	imgPath: string = this._EntranceTicketDataService.imgPath;

	constructor(
		private _CategoryTicketDataService: CategoryTicketDataService,
		private _EntranceTicketDataService: EntranceTicketDataService,
		private _Configuration: Configuration,
		private _Router: Router,
		private _ActivatedRoute: ActivatedRoute,
		private sessionStorage: LocalStorageService,
	) {

		this.querySubscription = _ActivatedRoute.params.subscribe(
			(params: any) => {
				this.params = params;
			}
		)

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
			if (res.data) {
				let categoryTicketOptions = [];
				for (let key in res.data) {

					var temp = {
						value: res.data[key].clean_url,
						label: res.data[key].name
					};

					categoryTicketOptions.push(temp);
				}
				this.categoryTicketOptions = categoryTicketOptions;
			}
		});
  	}

  	initData() {
  		//get entrance ticket
  		this.search = this.params['clean_url'] || '';
  		if(this.search){
  			let params: URLSearchParams = new URLSearchParams();
			params.set('clean_url', this.search);
			this._CategoryTicketDataService.getAll(params).subscribe(res => {
				if(res.data){
					this.loadEntranceTicketList(res.data[0].id);
				}
			});
  		}else{
  			this.loadEntranceTicketList(this.search);
  		}

		setTimeout(()=>{
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

		jQuery('.preloader').delay(1000).fadeOut("slow");
  	}

  	onChangeView(view) {
		this.view = view;
		setTimeout(() => {
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
		}, 100);

  	}

  	loadEntranceTicketList(category_ticket_id){
		let params: URLSearchParams = new URLSearchParams();
		if(category_ticket_id){
			params.set('category_ticket_id', category_ticket_id);	
		}
  		this._EntranceTicketDataService.getAll(params).subscribe(res => {
			let listItem = [];
			if (res.data) {
				for (let key in res.data) {
					let images = res.data[key].album[0];
					res.data[key].img = images.img ? this.imgPath + images.img : '';
					res.data[key].order = 1;
					listItem.push(res.data[key]);
				}
				this.listItem = listItem;
			}
		});
  	}

  	/*=================================
	 * Search Ticket
	 *=================================*/
	onSearch() {
		//reset list item
		this.listItem = [];
		this._Router.navigate(['list-tickets', this.search]);
		//display loading
		jQuery('.preloader').fadeIn();
	}

	/*=================================
	 * Add To Cart
	 *=================================*/
	addToCart(item) {
		let count = 0;
		let img = '';

		if (item.album[0]) {
			img = item.album[0].img;
		}

		let obj = {
			id: item.id,
			name: item.name,
			departure: null,
			img: img,
			adult_fare: item.adult_fare,
			children_fare: item.children_fare,
			number_adult: item.order,
			number_children: 0
		};

		if (this.sessionStorage.get('cartItems')) {
			let cartItems = this.sessionStorage.get('cartItems');
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
				count++;
			}
			this.sessionStorage.set('cartItems', cartItems);

		} else {
			let cartItems = [obj];
			this.sessionStorage.set('cartItems', cartItems);
			count++;
		}
		item.order = 1;
		this._Configuration.number_order = count;
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
