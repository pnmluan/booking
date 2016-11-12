import { Injectable, EventEmitter, Output } from '@angular/core';
import { Response, RequestOptions, RequestOptionsArgs } from '@angular/http';
import { HttpClient } from './http-client';
import { Observable } from 'rxjs/Rx';
import { Comment } from '../models/comment';
import { Configuration } from '../shared/app.configuration';

@Injectable()
export class CommentDataService {

	private actionUrl: string;


	// @Output() foodAdded: EventEmitter<any> = new EventEmitter();
	// @Output() foodDeleted: EventEmitter<any> = new EventEmitter();

	constructor(private _http: HttpClient, private _configuration: Configuration) {
		this.actionUrl = _configuration.apiUrl + 'comment/';
	}

	public getAll() {
		console.log(this.actionUrl + 'index');
		return this._http.get(this.actionUrl + 'index')
			.map(res => res.json())
			.catch(this.handleError);
	}

	private handleError(error: Response) {
		console.error(error);
		return Observable.throw(error.json().error || 'Server error');
	}


	// private prepareOptions = (options: RequestOptionsArgs): RequestOptionsArgs => {
	// 	options = options || {};

	// 	if (!options.headers) {
	// 		options.headers = new Headers();
	// 	}

	// 	options.headers.append('Content-Type', 'application/json');

	// 	return options;
	// }
}
