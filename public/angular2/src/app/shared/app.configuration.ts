import { Injectable } from '@angular/core';

@Injectable()
export class Configuration {
	public server: string = "http://localhost/booking/public/";
	// public server: string = "http://datvesieure.com/public/";
	public apiUrl = this.server + "api/v1/";
	public userAuth = 'datvesieure';
	public passAuth = 'balobooking';
	public authentic = btoa(this.userAuth + ':' + this.passAuth);

	public imgPath = this.server + "backend/assets/apps/img/";
	public longFormatDate = "dddd - DD/MM/YYYY";
	public viFormatDate = "DD/MM/YYYY";
	public dateFormat = 'YYYY-MM-DD';
	public longDateTime = 'YYYY-MM-DD HH:mm:ss';
	public longFormatDateTime = "HH:mm-dddd-DD/MM/YYYY";
	public session_expired = 30/60; //Session 15 mins

	public arr_number_people = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10'];
	public arr_number_infants = ['1','2'];
}
