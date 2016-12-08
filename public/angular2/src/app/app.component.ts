import { Component } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
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
	) {

		this.onSetGobalScript();

		setInterval(() => {
			let routing = this._Router.url;
			// this.onCheckUserSession(routing);
		}, 3000)
	}

	onSetGobalScript() {
		let _Configuration = this._Configuration;

		jQuery('.daterange-single').datetimepicker({
			locale: 'ja',
			format: _Configuration.formatDate,
		});
	}
}
