import { Injectable, EventEmitter, Output } from '@angular/core';
import { Http, Headers, Response } from '@angular/http';
import { Observable } from 'rxjs/Rx';
import { Configuration } from '../shared/app.configuration';

@Injectable()
export class AirlineDataService {

	private actionUrl: string;


	constructor(private http: Http, private _Configuration: Configuration) {
		this.actionUrl = _Configuration.apiUrl + 'airline/';
	}

	public getAll() {
		return this.http.get(this.actionUrl + 'index')
			.map(res => res.json())
			.catch(this.handleError);
	}

	createAuthorizationHeader(headers: Headers) {
		// headers.append('Content-Type', 'application/json;charset=UTF-8');

		headers.append('Authorization', 'Basic ' + this._Configuration.authentic);
	}



	public vietjet(data) {
		let headers = new Headers();
		this.createAuthorizationHeader(headers);
		return this.http.post(this.actionUrl + 'vietjet', data, { headers: headers, withCredentials: true })
			.map(res => res.json())
			.catch(this.handleError);
	}

	public jetstar(data) {
		let headers = new Headers();
		this.createAuthorizationHeader(headers);
		return this.http.post(this.actionUrl + 'jetstar', data, { headers: headers, withCredentials: true })
			.map(res => res.json())
			.catch(this.handleError);
	}

	public vna(data) {
		let headers = new Headers();
		this.createAuthorizationHeader(headers);
		return this.http.post(this.actionUrl + 'vna', data, { headers: headers})
			.map(res => res.json())
			.catch(this.handleError);
	}

	private handleError(error: Response) {
		console.log(error);
		return Observable.throw(error.json().error || 'Server error');
	}

}
