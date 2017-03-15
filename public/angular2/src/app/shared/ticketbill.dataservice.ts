import { Injectable, EventEmitter, Output } from '@angular/core';
import { Http, Headers, Response } from '@angular/http';
import { Observable } from 'rxjs/Rx';

import { Configuration } from '../shared/app.configuration';

@Injectable()
export class TicketBillDataService {

	private actionUrl: string;


	constructor(private _Http: Http, private _configuration: Configuration) {
		this.actionUrl = _configuration.apiUrl + 'ticket_bill/';
	}

	createAuthorizationHeader(headers: Headers) {
		headers.append('Content-Type', 'application/x-www-form-urlencoded;charset=UTF-8');
		headers.append('Authorization', 'Basic ' + this._configuration.authentic);
	}

	public getAll() {
		let headers = new Headers();
		this.createAuthorizationHeader(headers);
		return this._Http.get(this.actionUrl + 'index', { headers: headers })
			.map(res => res.json())
			.catch(this.handleError);
	}

	public create(params) {
		let headers = new Headers();
		this.createAuthorizationHeader(headers);
		return this._Http.post(this.actionUrl + 'create', params.toString(), {
			headers: headers,
			withCredentials: true
		})
			.map(res => res.json())
			.catch(this.handleError);
	}

	private handleError(error: Response) {
		return Observable.throw(error.json().error || 'Server error');
	}

}
