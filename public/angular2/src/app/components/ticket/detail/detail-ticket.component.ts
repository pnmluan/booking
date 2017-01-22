import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { URLSearchParams } from '@angular/http';

import { Configuration } from '../../../shared/app.configuration';
import { EntranceTicketDataService } from '../../../shared/entranceticket.dataservice';

import { Subscription } from 'rxjs/Rx';

@Component({
  selector: 'app-detail-ticket',
  templateUrl: './detail-ticket.component.html',
  providers: [EntranceTicketDataService, Configuration]
})
export class DetailTicketComponent implements OnInit {
	private subscriptionEvents: Subscription;
	public comments = [];
	curRouting?: string;

	constructor(
		private _EntranceTicketDataService: EntranceTicketDataService, 
		private config: Configuration,
		private _Router: Router) { 

		this.subscriptionEvents = this._Router.events.subscribe((val) => {
			let routing = this._Router.url;
			if (this.curRouting != routing) {
				this.curRouting = routing;
				this.initData();
			}
		});
	}

  	ngOnInit() {
		this._EntranceTicketDataService.getAll().subscribe(res => {

			if (res.data) {


			}
		})
  	}

  	initData() {

  	}

	ngOnDestroy() {
		this.subscriptionEvents.unsubscribe();
	}

}
