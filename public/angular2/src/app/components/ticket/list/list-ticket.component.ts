import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { URLSearchParams } from '@angular/http';

import { Configuration } from '../../../shared/app.configuration';

import { CategoryTicketDataService } from '../../../shared/categoryticket.dataservice';
import { EntranceTicketDataService } from '../../../shared/entranceticket.dataservice';

import { Subscription } from 'rxjs/Rx';

@Component({
  selector: 'app-list-ticket',
  templateUrl: './list-ticket.component.html',
  providers: [CategoryTicketDataService, EntranceTicketDataService]
})
export class ListTicketComponent implements OnInit {
	private subscriptionEvents: Subscription;
	public categoryTicketOptions = [];
	listItem = [];
	curRouting?: string;
	search = {};
	constructor(
		private _CategoryTicketDataService: CategoryTicketDataService, 
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
		this._CategoryTicketDataService.getAll().subscribe(res => {
			let categoryTicketOptions = [];
			if (res.data) {
				for (let key in res.data) {

					var temp = {
						value: res.data[key].id,
						label: res.data[key].name
					};

					categoryTicketOptions.push(temp);

				}
				this.categoryTicketOptions = categoryTicketOptions;
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
		this.initData();
	}

	ngOnDestroy() {
		this.subscriptionEvents.unsubscribe();
	}

}
