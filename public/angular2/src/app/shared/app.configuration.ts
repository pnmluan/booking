import { Injectable } from '@angular/core';

@Injectable()
export class Configuration {
	public server: string = "http://localhost:1000/booking/public/";
	public apiUrl = this.server + "api/v1/";
}