import { Injectable, EventEmitter, Output } from '@angular/core';
import { Response, RequestOptions, RequestOptionsArgs } from '@angular/http';
import { HttpClient } from './http-client';
import { Observable } from 'rxjs/Rx';
import { Configuration } from '../shared/app.configuration';

@Injectable()
export class BannerDataService {

	private actionUrl: string;


	// @Output() foodAdded: EventEmitter<any> = new EventEmitter();
	// @Output() foodDeleted: EventEmitter<any> = new EventEmitter();

	constructor(private _http: HttpClient, private _configuration: Configuration) {
		this.actionUrl = _configuration.apiUrl + 'banner/';
	}

	public getAll() {
		return this._http.get(this.actionUrl + 'index')
			.map(res => res.json())
			.catch(this.handleError);

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
}
