import { Injectable } from '@angular/core';

@Injectable()
export class Configuration {
	public server: string = "http://localhost/booking/public/";
	public apiUrl = this.server + "api/v1/";
	public userAuth = 'datvesieure';
	public passAuth = 'balobooking';
	public authentic = btoa(this.userAuth + ':' + this.passAuth);

	public imgPath = this.server + "backend/assets/apps/img/";
	public formatDate = "dddd - DD/MM/YYYY";
	public viFormatDate = "DD/MM/YYYY";
}
