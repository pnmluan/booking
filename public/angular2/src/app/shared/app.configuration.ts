import { Injectable } from '@angular/core';

@Injectable()
export class Configuration {
	public server: string = "http://localhost/booking/public/";
	// public server: string = "http://datvesieure.com/public/";
	public apiUrl = this.server + "api/";
	public userAuth = 'datvesieure';
	public passAuth = 'balobooking';
	public authentic = btoa(this.userAuth + ':' + this.passAuth);

	public imgPath = this.server + "backend/assets/apps/img/";
	public longFormatDate = "dddd - DD/MM/YYYY";
	public viFormatDate = "DD/MM/YYYY";
	public dateFormat = 'YYYY-MM-DD';
	public formatDate = 'YYYY-MM-DD';
	public longDateTime = 'YYYY-MM-DD HH:mm:ss';
	public longFormatDateTime = "HH:mm-dddd-DD/MM/YYYY";
	public session_expired = 30 / 60; //Session 15 mins

	public arr_number_people = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10'];
	public arr_number_infants = ['1', '2'];
	public number_order: number = 0;


	public bank_accounts = {
		vietcombank: {
			icon: 'assets/img/bank/bank-logo-VCB.jpg',
			number_account: '0451000328295',
			branch: 'Vietcombank chi nhánh Thành Công, Hà Nội'
		},
		bidv: {
			icon: '',
			number_account: '31310000341958',
			branch: 'BIDV chi nhánh Bắc Sài Gòn, TPHCM'
		},
		techcombank: {
			icon: '',
			number_account: '19031034880011',
			branch: 'Techcombank chi nhánh Hà Nội'
		}
	};

}