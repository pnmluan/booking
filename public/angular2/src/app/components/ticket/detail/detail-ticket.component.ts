import { Component, OnInit, ViewChild, ViewContainerRef, ComponentFactoryResolver } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { URLSearchParams } from '@angular/http';

import { Configuration } from '../../../shared/app.configuration';
import { EntranceTicketDataService } from '../../../shared/entranceticket.dataservice';

import { Subscription } from 'rxjs/Rx';
import { LocalStorageService } from 'angular-2-local-storage';
import { ToasterModule, ToasterService } from 'angular2-toaster';
import { AgmCoreModule } from 'angular2-google-maps/core';
import { DetailTicketPhotoComponent } from './photo/detail-ticket-photo.component';

declare let jQuery: any;
declare let moment: any;

@Component({
  selector: 'app-detail-ticket',
  templateUrl: './detail-ticket.component.html',
  providers: [ EntranceTicketDataService ]
})

export class DetailTicketComponent implements OnInit {
	private subscriptionEvents: Subscription;
	private subscriptionParam: Subscription;
	public comments = [];
	@ViewChild('photos', {read: ViewContainerRef }) photos: ViewContainerRef;

	filter_from_date: any;
	curRouting?: string;
	albums = [];
	listItem = [];
	_params = {};
	Ticket = {};
	number_children: number = 0;
	number_adult: number = 1;
	isAddPeople = false;
	imgPath: string = this._EntranceTicketDataService.imgPath;
	lat: number;
	lng: number;
	datepickerOptions = { format: this._Configuration.viFormatDate, autoApply: true, locate: 'vi', style: 'big' };

	constructor(
		private _EntranceTicketDataService: EntranceTicketDataService, 
		private _Configuration: Configuration,
		private _Router: Router,
		private _ActivatedRoute: ActivatedRoute,
		private sessionStorage: LocalStorageService,
		private _ToasterService: ToasterService,
		private _componentFactoryResolver: ComponentFactoryResolver
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
  		console.log(this._Configuration.number_order);
  	}

  	ngAfterViewInit(){
  		//event view price
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

  		jQuery('.info-tab li a').click(function() {
			jQuery('.info-tab li a').removeClass('active');
			jQuery(this).addClass('active');

			jQuery('.info-wrapper .item').hide();
			jQuery(jQuery(this).attr('href')).show();
			return false;
		});
  	}

  	initData() {
  		this.photos.clear();
  		this.isAddPeople = false;

  		let childComponent = this._componentFactoryResolver.resolveComponentFactory(DetailTicketPhotoComponent);
		let componentRef = this.photos.createComponent(childComponent);

  		this._EntranceTicketDataService.getByID(this._params['ticket_id']).subscribe(res => {
			if (res.data) {
				this.Ticket = res.data;
				(<DetailTicketPhotoComponent>componentRef.instance).albums = res.data.album;
  				(<DetailTicketPhotoComponent>componentRef.instance).imgPath = this.imgPath;
				this.lat = +this.Ticket['latitude'];
				this.lng = +this.Ticket['longitude'];
				this.loadCategoryTickets(res.data.category_ticket_id);
			}
		})

		
  	}

  	loadCategoryTickets(category_ticket_id){
  		var params: URLSearchParams = new URLSearchParams();
		params.set('category_ticket_id', category_ticket_id);
		params.set('except_id',this._params['ticket_id']);
		this._EntranceTicketDataService.getAll(params).subscribe(res => {
			if (res.data) {
				this.listItem = res.data;
			}
		});
  	}

  	/*=================================
	 * Add To Cart
	 *=================================*/
	addToCart(item) {
		if(this.number_adult == 0){
			this._ToasterService.pop('error', 'Lỗi nhập liệu', 'Vui lòng nhập số người tham quan.');
			return;
		}

		if(!this.filter_from_date){
			this._ToasterService.pop('error', 'Lỗi nhập liệu', 'Vui lòng chọn ngày tham quan.');
			return;
		}

		let booking_date = moment(this.filter_from_date.formatted, this._Configuration.viFormatDate).format(this._Configuration.dateFormat);
		if(booking_date < moment().add(24,'h').format(this._Configuration.dateFormat)){
			this._ToasterService.pop('error', 'Lỗi nhập liệu', 'Vui lòng kiểm tra lại ngày tham quan.');
			return;
		}

		let count = 0;
		let img = '';

		if (item.album[0]) {
			img = item.album[0].img;
		}

		let obj = {
			id: item.id,
			name: item.name,
			departure: this.filter_from_date.formatted,
			img: img,
			adult_fare: item.adult_fare,
			children_fare: item.children_fare,
			number_adult: this.number_adult,
			number_children: this.number_children
		};

		if (this.sessionStorage.get('cartItems')) {
			let cartItems = this.sessionStorage.get('cartItems');
			let existed = false;
			
			for(let key in cartItems) {
				if(cartItems[key].id == item.id) {
					if(cartItems[key].departure == this.filter_from_date.formatted){
						cartItems[key].number_adult = +cartItems[key].number_adult + this.number_adult;
						cartItems[key].number_children = +cartItems[key].number_children + this.number_children;
						existed = true;
					}
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
		this._Configuration.number_order = count;
	}

	onCountNumberAdult(quantity: number, operation?: string){
		if(quantity){
			if(quantity == 1){
				switch(operation){
					case 'plus':
						this.number_adult++;
						break;
					case 'minus':
						this.number_adult = this.number_adult ? this.number_adult - 1 : 0;
						break;
					default:
						this.number_adult = quantity;
						break;
				}
			}else{
				this.number_adult = quantity;
			}
		}
	}

	onCountNumberChildren(quantity: number, operation?: string){
		if(quantity){
			if(quantity == 1){
				switch(operation){
					case 'plus':
						this.number_children++;
						break;
					case 'minus':
						this.number_children = this.number_children ? this.number_children - 1 : 0;
						break;
					default:
						this.number_children = quantity;
						break;
				}
			}else{
				this.number_children = quantity;	
			}
		}
	}

	onClearNumber(quantity: number, field?: string){
		quantity = quantity ? +quantity : 0;
		if(field == 'adult'){
			this.number_adult = quantity;
		}else{
			this.number_children = quantity;
		}
	}

  	onPlusPeople(value) {
		value = value + 1;
  	}

	onMinusPeople(value) {
		if(value > 1) {
			value = value - 1;
		}
  	}

  	onLinkToListTicket(){
		this._Router.navigate(['list-tickets']);
	}

	ngOnDestroy() {
		this.subscriptionEvents.unsubscribe();
		this.subscriptionParam.unsubscribe();
	}

}
