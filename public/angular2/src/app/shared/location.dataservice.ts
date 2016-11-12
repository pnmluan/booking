import { Injectable, EventEmitter, Output } from '@angular/core';
import { Response, RequestOptions, RequestOptionsArgs } from '@angular/http';
import { HttpClient } from './http-client';
import { Observable } from 'rxjs/Rx';
import { Location } from '../models/location';
import { Configuration } from '../shared/app.configuration';

@Injectable()
export class LocationDataService {

	private actionUrl: string;


	constructor(private _http: HttpClient, private _configuration: Configuration) {
		this.actionUrl = _configuration.apiUrl + 'location/';
	}


	public getAll() {
		return this._http.get(this.actionUrl + 'index')
			.map(res => res.json())
			.catch(this.handleError);
	}

	private handleError(error: Response) {
		console.error(error);
		return Observable.throw(error.json().error || 'Server error');
	}

}
