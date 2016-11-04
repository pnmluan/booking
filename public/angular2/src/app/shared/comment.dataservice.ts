import { Injectable, EventEmitter, Output } from '@angular/core';
import { Http, Response, Headers, RequestOptions, RequestOptionsArgs } from '@angular/http';
import { Observable } from 'rxjs/Rx';
import { Comment } from '../models/comment';
import { Configuration } from '../shared/app.configuration';

@Injectable()
export class CommentDataService {

	private actionUrl: string;


	// @Output() foodAdded: EventEmitter<any> = new EventEmitter();
	// @Output() foodDeleted: EventEmitter<any> = new EventEmitter();

	constructor(private _http: Http, private _configuration: Configuration) {
		this.actionUrl = _configuration.apiUrl + 'comment/';
	}

	protected createAuthorizationHeader() {
		var headers = new Headers();
		headers.append('Content-Type', 'application/json');
		headers.append('Authorization', 'Basic ' +
			btoa('datvesieure:balobooking'));
		return headers;
	}

	public getAll() {
		console.log(this.actionUrl + 'index');
		return this._http.get(this.actionUrl + 'index', {headers: this.createAuthorizationHeader()})
			.map(res => res.json())
			.catch(this.handleError);

		// return this._http.get(this.actionUrl + 'index')
		// 	.map(res => res.json())
		// 	.catch(this.handleError);
	}

	// public GetSingle = (id: number): Observable<Comment> => {
	// 	return this._http.get(this.actionUrl + id)
	// 		.map((response: Response) => <Comment>response.json())
	// 		.catch(this.handleError);
	// }

	// public Add = (Comment: Comment): Observable<Comment> => {
	// 	let toAdd: string = JSON.stringify(
	// 		{
	// 			name: Comment.name,
	// 			calories: Comment.calories,
	// 			created: new Date()
	// 		});

		// let options = this.prepareOptions(null);

	// 	return this._http.post(this.actionUrl, toAdd, options)
	// 		.map((response: Response) => <Comment>response.json())
	// 		.do(() => this.foodAdded.emit(null))
	// 		.catch(this.handleError);
	// }

	// public Update = (id: number, foodToUpdate: Comment): Observable<Comment> => {
	// 	let options = this.prepareOptions(null);

	// 	return this._http.put(this.actionUrl + id, JSON.stringify(foodToUpdate), options)
	// 		.map((response: Response) => <Comment>response.json())
	// 		.catch(this.handleError);
	// }

	// public DeleteFood = (id: number): Observable<Response> => {
	// 	return this._http.delete(this.actionUrl + id)
	// 		.do(() => this.foodDeleted.emit(null))
	// 		.catch(this.handleError);
	// }

	private handleError(error: Response) {
		console.error(error);
		return Observable.throw(error.json().error || 'Server error');
	}


	private prepareOptions = (options: RequestOptionsArgs): RequestOptionsArgs => {
		options = options || {};

		if (!options.headers) {
			options.headers = new Headers();
		}

		options.headers.append('Content-Type', 'application/json');

		return options;
	}
}
