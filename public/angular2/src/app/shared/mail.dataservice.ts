import { Injectable, EventEmitter, Output } from '@angular/core';
import { Http, Headers, Response } from '@angular/http';
import { Observable } from 'rxjs/Rx';
import { Configuration } from '../shared/app.configuration';

@Injectable()
export class MailDataService {

	private actionUrl: string;
	public imgPath: string;

	constructor(private _Http: Http, private _Configuration: Configuration) {
		this.actionUrl = _Configuration.apiUrl + 'mail/';
		this.imgPath = _Configuration.imgPath + 'mail/';
	}

	createAuthorizationHeader(headers: Headers) {
		headers.append('Content-Type', 'application/x-www-form-urlencoded');
		headers.append('Authorization', 'Basic ' + this._Configuration.authentic);
	}

	public sendInfoPayment(params) {
		let headers = new Headers();
		this.createAuthorizationHeader(headers);
		return this._Http.post(this.actionUrl + 'sendInfoPayment', params.toString(), {
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
