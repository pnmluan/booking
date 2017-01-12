import { Component } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { HttpInterceptorService } from 'ng2-http-interceptor';
import { LoadingAnimateService } from 'ng2-loading-animate';
import { Configuration } from './shared/app.configuration';
import { Http } from '@angular/http';

declare var jQuery: any;

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
	constructor(
		private _Http: Http,
		private _Router: Router,
		private _Configuration: Configuration,
		private _HttpInterceptorService: HttpInterceptorService,
		private _LoadingAnimateService: LoadingAnimateService,
	) {

		_HttpInterceptorService.request().addInterceptor((data, method) => {
			this._LoadingAnimateService.setValue(true);
			return data;
		});

		_HttpInterceptorService.response().addInterceptor((res, method) => {
			this._LoadingAnimateService.setValue(false);
			return res;
		});

		this.onSetGobalScript();

		setInterval(() => {
			let routing = this._Router.url;
			// this.onCheckUserSession(routing);
		}, 3000)
	}

	ngAfterContentChecked() {

	}

	onSetGobalScript() {
		// setTimeout(() => {
		// 	let _Configuration = this._Configuration;

		// 	jQuery('.datetimepicker').datetimepicker({
		// 		locale: 'vi',
		// 		format: _Configuration.viFormatDate,
		// 	});

		// }, 1000)
		
	}
}
