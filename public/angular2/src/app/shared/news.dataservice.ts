import { Injectable, EventEmitter, Output } from '@angular/core';
import { Http, Headers, Response } from '@angular/http';
import { Observable } from 'rxjs/Rx';
import { Configuration } from '../shared/app.configuration';

@Injectable()
export class NewsDataService {

	private actionUrl: string;
	public imgPath: string;

	constructor(private _Http: Http, private _Configuration: Configuration) {
		this.actionUrl = _Configuration.apiUrl + 'news/';
		this.imgPath = _Configuration.imgPath + 'news/';
	}

	createAuthorizationHeader(headers: Headers) {
		headers.append('Content-Type', 'application/x-www-form-urlencoded');
		headers.append('Authorization', 'Basic ' + this._Configuration.authentic);
	}

	public getAll() {
		let headers = new Headers();
		this.createAuthorizationHeader(headers);
		return this._Http.get(this.actionUrl + 'index', { 
			headers: headers })
			.retryWhen(errors => errors.delay(1000))
			.map(res => res.json())
			.catch(this.handleError);

	}

	private handleError(error: Response) {
		return Observable.throw(error.json().error || 'Server error');
	}
}
