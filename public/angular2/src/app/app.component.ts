import { Component, ViewChild } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { HttpInterceptorService } from 'ng-http-interceptor';
import { ToasterConfig } from 'angular2-toaster/angular2-toaster';
import { LoadingAnimateService } from 'ng2-loading-animate';
import { ModalComponent } from 'ng2-bs3-modal/ng2-bs3-modal';
import { LocalStorageService } from 'angular-2-local-storage';
import { Configuration } from './shared/app.configuration';
import { EntranceTicketDataService } from './shared';
import { Http } from '@angular/http';

declare var jQuery: any;

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  providers: [EntranceTicketDataService]
})
export class AppComponent {
	@ViewChild('warning') warningModal: ModalComponent;
	@ViewChild('cart') cartModal: ModalComponent;
	private session_expired?: any;
	public toasterconfig: ToasterConfig =
	new ToasterConfig({
		limit: 7,
		showCloseButton: true,
		positionClass: "toast-bottom-right",
		timeout: "6000"
	});
	curRouting?: string;
	warningMsg: string = '';
	first_time = true;

	private _opened: boolean = false;
	public number_order: number = 0;
	cartItems: any;
	sumPrice: number = 0;
	imgPath: string = this._EntranceTicketDataService.imgPath;
	
	constructor(
		private _Http: Http,
		private _Router: Router,
		private _Configuration: Configuration,
		private _HttpInterceptorService: HttpInterceptorService,
		private _LoadingAnimateService: LoadingAnimateService,
		private _LocalStorageService: LocalStorageService,
		private _EntranceTicketDataService: EntranceTicketDataService,
		private sessionStorage: LocalStorageService
	) {
		this.session_expired = this._Configuration.session_expired;

		var current_href = window.location.href;
		let current_domain = window.location.origin;
		current_href = current_href.replace(current_domain, '');
		this._Router.events.subscribe((val) => {
			if (current_href.match(/^\/search-result.*/i)) {
				let now = new Date().getTime();
				this._LocalStorageService.set('user_session_start', now);
			}

		});

		_HttpInterceptorService.request().addInterceptor((data, method) => {
			this._LoadingAnimateService.setValue(true);
			return data;
		});

		_HttpInterceptorService.response().addInterceptor((res, method) => {
			this._LoadingAnimateService.setValue(false);
			return res;
		});

		this.onSetGlobalScript();

		setInterval(() => {
			this.checkUserSession();
		}, 3000);

		let cartItems = this.sessionStorage.get('cartItems');
		if(cartItems){
			for(let key in cartItems){
				this.number_order++;
			}
		}
		this._Configuration.number_order = this.number_order;
	}

	ngAfterContentChecked() {
		let routing = this._Router.url;
		if (this.curRouting != routing) {
			this.curRouting = routing;
			let now = new Date().getTime();
			this._LocalStorageService.set('user_session_start', now);
			this.onSetGlobalScript();
		}
	}

	// Set Global script JS
	onSetGlobalScript() {
		setTimeout(() => {
			let _Configuration = this._Configuration;

			jQuery('.datetimepicker').datetimepicker({
				locale: 'vi',
				format: _Configuration.viFormatDate,
			});

			jQuery(window).scroll(function(){ 
				if (jQuery(this).scrollTop() > 100) { 
					jQuery('#scroll').fadeIn(); 
				} else { 
					jQuery('#scroll').fadeOut(); 
				} 
			});

			jQuery('#scroll').click(function(){ 
				jQuery("html, body").animate({ scrollTop: 0 }, 600); 
				return false; 
			}); 

		}, 1000);

		// setTimeout(() => {

		// 	jQuery("html").niceScroll({
		// 		cursorcolor: "#ccc",
		// 		cursorborder: "0px solid #fff",
		// 		railpadding: { top: 0, right: 0, left: 0, bottom: 0 },
		// 		cursorwidth: "5px",
		// 		cursorborderradius: "0px",
		// 		cursoropacitymin: 0,
		// 		cursoropacitymax: 0.7,
		// 		boxzoom: true,
		// 		horizrailenabled: false,
		// 		autohidemode: false
		// 	});

		// }, 200);                                                                                                                                                                                                                                                                                                                                                                                                                                                                    
		
	}

	// Go Home Page
	onGoHome() {
		this.first_time = true;
		this.warningModal.close();
		let now = new Date().getTime();
		this._LocalStorageService.set('user_session_start', now);
		setTimeout(() => {
			this._Router.navigate(['home']);
		}, 1000);
		
	}

	// Search Again
	onSearchAgain() {
		this.first_time = true;
		let now = new Date().getTime();
		this._LocalStorageService.set('user_session_start', now);
		this.warningModal.close();
		
	}

	/*=================================
	 * Open Popup Cart
	 *=================================*/
	onOpenCart() {
		if (this._Configuration.number_order) {
			this.cartModal.open();
			this.loadCartItemsStorage();
		}
		
	}

	/*=================================
	 * Toggle Sidebar
	 *=================================*/
	loadCartItemsStorage() {
		this.cartItems = this._LocalStorageService.get('cartItems');
		let sum = 0;
		for (let key in this.cartItems) {
			var item = this.cartItems[key];
			sum = sum + item.number_adult * item.adult_fare + item.number_children * item.children_fare;
		}
		this.sumPrice = sum;
	}

	/*=================================
	 * Link to cart-ticket
	 *=================================*/
	onLinkToCartTicket() {
		this.cartModal.close();
		this._Router.navigate(['cart-ticket']);
	}

	protected checkUserSession() {
		let now = new Date().getTime();
		var user_session_start = this._LocalStorageService.get('user_session_start');

		if (now - +user_session_start > this.session_expired * 60 * 60 * 1000) {
			let routing = this._Router.url;

			if (routing.match(/^\/search-result.*/i) && this.first_time) {
				
				this.warningMsg = 'Bạn đã không thao tác gì trong một thời gian, dữ liệu chuyến bay có thể đã thay đổi, vui lòng thực hiện tìm kiếm lại!';
				this.warningModal.open('sm');
				this.first_time = false;
			}
			
			
		}
	}
}
