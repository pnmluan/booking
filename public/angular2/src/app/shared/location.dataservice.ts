import { Injectable, EventEmitter, Output } from '@angular/core';
import { Http, Headers, Response } from '@angular/http';
import { HttpClient } from './http-client';
import { Observable } from 'rxjs/Rx';
import { Location } from '../models/location';
import { Configuration } from '../shared/app.configuration';

@Injectable()
export class LocationDataService {

	private actionUrl: string;


	constructor(private _Http: Http, private _configuration: Configuration) {
		this.actionUrl = _configuration.apiUrl + 'location/';
	}

	createAuthorizationHeader(headers: Headers) {
		headers.append('Content-Type', 'application/json;charset=UTF-8');
		headers.append('Authorization', 'Basic ' + this._configuration.authentic);
	}

	public getAll() {
		let headers = new Headers();
		this.createAuthorizationHeader(headers);
		return this._Http.get(this.actionUrl + 'index', {headers: headers})
			.map(res => res.json())
			.catch(this.handleError);
	}

	private handleError(error: Response) {
		console.error(error);
		return Observable.throw(error.json().error || 'Server error');
	}

}
