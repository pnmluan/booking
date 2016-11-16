import { Injectable } from '@angular/core';

@Injectable()
export class Configuration {
	public server: string = "http://localhost/booking/public/";
	public apiUrl = this.server + "api/v1/";

	public imgPath = this.server + "backend/assets/apps/img/";
}