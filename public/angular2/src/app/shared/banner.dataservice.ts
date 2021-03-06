import { Injectable, EventEmitter, Output } from '@angular/core';
import { Http, Headers, Response } from '@angular/http';
import { Observable } from 'rxjs/Rx';
import { Configuration } from '../shared/app.configuration';

@Injectable()
export class BannerDataService {

	private actionUrl: string;
	public imgPath: string;

	constructor(private _Http: Http, private _Configuration: Configuration) {
		this.actionUrl = _Configuration.apiUrl + 'banner/';
		this.imgPath = _Configuration.imgPath + 'banner/';
	}

	createAuthorizationHeader(headers: Headers) {
		headers.append('Content-Type', 'application/x-www-form-urlencoded');
		headers.append('Authorization', 'Basic ' + this._Configuration.authentic);
	}

	public getAll() {
		let headers = new Headers();
		this.createAuthorizationHeader(headers);
		return this._Http.get(this.actionUrl + 'index', { headers: headers })
			.map(res => res.json())
			.catch(this.handleError);

	}

	// public GetSingle = (id: number): Observable<Comment> => {
	// 	return this._Http.get(this.actionUrl + id)
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

	// 	return this._Http.post(this.actionUrl, toAdd, options)
	// 		.map((response: Response) => <Comment>response.json())
	// 		.do(() => this.foodAdded.emit(null))
	// 		.catch(this.handleError);
	// }

	// public Update = (id: number, foodToUpdate: Comment): Observable<Comment> => {
	// 	let options = this.prepareOptions(null);

	// 	return this._Http.put(this.actionUrl + id, JSON.stringify(foodToUpdate), options)
	// 		.map((response: Response) => <Comment>response.json())
	// 		.catch(this.handleError);
	// }

	// public DeleteFood = (id: number): Observable<Response> => {
	// 	return this._Http.delete(this.actionUrl + id)
	// 		.do(() => this.foodDeleted.emit(null))
	// 		.catch(this.handleError);
	// }

	private handleError(error: Response) {
		return Observable.throw(error.json().error || 'Server error');
	}
}
