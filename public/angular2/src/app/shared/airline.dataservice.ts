import { Injectable, EventEmitter, Output } from '@angular/core';
import { Response, RequestOptions, RequestOptionsArgs } from '@angular/http';
import { HttpClient } from './http-client';
import { Observable } from 'rxjs/Rx';
import { Configuration } from '../shared/app.configuration';

@Injectable()
export class AirlineDataService {

	private actionUrl: string;


	constructor(private _http: HttpClient, private _configuration: Configuration) {
		this.actionUrl = _configuration.apiUrl + 'airline/';
	}

	public getAll() {
		return this._http.get(this.actionUrl + 'index')
			.map(res => res.json())
			.catch(this.handleError);
	}

	public vietjet(data) {
		return this._http.post(this.actionUrl + 'vietjet', data)
			.map(res => res.json())
			.catch(this.handleError);
	}

	public jetstar(data) {
		return this._http.post(this.actionUrl + 'jetstar', data)
			.map(res => res.json())
			.catch(this.handleError);
	}

	private handleError(error: Response) {
		console.log(error);
		return Observable.throw(error.json().error || 'Server error');
	}

}
