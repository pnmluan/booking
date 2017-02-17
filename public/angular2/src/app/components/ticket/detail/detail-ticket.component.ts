import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { URLSearchParams } from '@angular/http';

import { Configuration } from '../../../shared/app.configuration';
import { EntranceTicketDataService } from '../../../shared/entranceticket.dataservice';

import { Subscription } from 'rxjs/Rx';
import { AgmCoreModule } from 'angular2-google-maps/core';

declare let jQuery: any;

@Component({
  selector: 'app-detail-ticket',
  templateUrl: './detail-ticket.component.html',
  providers: [EntranceTicketDataService, Configuration]
})
export class DetailTicketComponent implements OnInit {
	private subscriptionEvents: Subscription;
	private subscriptionParam: Subscription;
	public comments = [];
	filter_from_date: any;
	curRouting?: string;
	listItem = [];
	_params = {};
	Ticket = {};
	category_ticket_id: number;
	number_children: number = 0;
	number_adult: number = 1;
	isAddPeople = false;
	imgPath: string = this._EntranceTicketDataService.imgPath;
	lat: number;
	lng: number;

	constructor(
		private _EntranceTicketDataService: EntranceTicketDataService, 
		private config: Configuration,
		private _Router: Router,
		private _ActivatedRoute: ActivatedRoute,
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
				this.curRouting = routing;
				this.initData();
			}
		});
	}

  	ngOnInit() {
		this._EntranceTicketDataService.getByID(this._params['ticket_id']).subscribe(res => {

			if (res.data) {
				this.Ticket = res.data;
				this.category_ticket_id = res.data.category_ticket_id;
				this.lat = +this.Ticket['latitude'];
				this.lng = +this.Ticket['longitude'];
			}
		})
  	}

  	ngAfterViewInit(){
  		setTimeout(() => {
  			var params: URLSearchParams = new URLSearchParams();
			params.set('category_ticket_id', String(this.category_ticket_id));
			this._EntranceTicketDataService.getAll(params).subscribe(res => {
				let listItem = [];
				if (res.data) {
					for (let key in res.data) {
						if(res.data[key].id != this._params['ticket_id']){
							listItem.push(res.data[key]);	
						}
					}
					this.listItem = listItem;
				}
			});
  		},1000);
  	}

  	initData() {

			setTimeout(() => {
				function photosGallery() {
					var sync1 = jQuery("#sync1");
					var sync2 = jQuery("#sync2");

					sync1.owlCarousel({
						singleItem: true,
						slideSpeed: 1000,
						navigation: true,
						pagination: false,
						autoPlay: 5000,
						afterAction: syncPosition,
						responsiveRefreshRate: 200,
					});

					sync2.owlCarousel({
						items: 8,
						itemsDesktop: [1199, 8],
						itemsDesktopSmall: [979, 6],
						itemsTablet: [768, 5],
						itemsMobile: [479, 4],
						pagination: false,
						responsiveRefreshRate: 100,
						afterInit: function(el) {
							el.find(".owl-item").eq(0).addClass("synced");
						}
					});

					function syncPosition(el) {
						var current = this.currentItem;
						jQuery("#sync2")
							.find(".owl-item")
							.removeClass("synced")
							.eq(current)
							.addClass("synced")
						if (jQuery("#sync2").data("owlCarousel") !== undefined) {
							center(current)
						}

					}

					jQuery("#sync2").on("click", ".owl-item", function(e) {
						e.preventDefault();
						var number = jQuery(this).data("owlItem");
						sync1.trigger("owl.goTo", number);
					});

					function center(number) {
						var sync2visible = sync2.data("owlCarousel").owl.visibleItems;

						var num = number;
						var found = false;
						for (var i in sync2visible) {
							if (num === sync2visible[i]) {
								var found = true;
							}
						}

						if (found === false) {
							if (num > sync2visible[sync2visible.length - 1]) {
								sync2.trigger("owl.goTo", num - sync2visible.length + 2);
							} else {
								if (num - 1 === -1) {
									num = 0;
								}
								sync2.trigger("owl.goTo", num);
							}
						} else if (num === sync2visible[sync2visible.length - 1]) {
							sync2.trigger("owl.goTo", sync2visible[1]);
						} else if (num === sync2visible[0]) {
							sync2.trigger("owl.goTo", num - 1);
						}
					}
				}
				photosGallery();

				jQuery('.info-tab li a').click(function() {
					jQuery('.info-tab li a').removeClass('active');
					jQuery(this).addClass('active');

					jQuery('.info-wrapper .item').hide();
					jQuery(jQuery(this).attr('href')).show();
					return false;
				});

				jQuery('.btn-view-price').click(function() {
					if (!jQuery('.tour-price-details').is(':visible')) {
						jQuery('.tour-price-details').slideDown('fast');
						jQuery(this).addClass('no');
						jQuery(this).html('<i class="fa fa-times"></i> ẨN GIÁ')
					} else {
						jQuery('.tour-price-details').slideUp('fast');
						jQuery(this).removeClass('no');
						jQuery(this).html('<i class="fa fa-check"></i> XEM GIÁ')
					}
					return false;
				});
			}, 1000);

  	}

  	onPlusPeople(value) {
		value = value + 1;
  	}

	onMinusPeople(value) {
		if(value) {
			value = value - 1;
		}
  	}

	ngOnDestroy() {
		this.subscriptionEvents.unsubscribe();
		this.subscriptionParam.unsubscribe();
	}

}
