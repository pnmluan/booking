import { Injectable } from  '@angular/core';
import { Http, Headers } from '@angular/http';

@Injectable()
export class HttpClient {
  constructor(private http: Http) {
    this.http = http;
  }

  createAuthorizationHeader(headers: Headers) {
    headers.append('Content-Type', 'application/json;charset=UTF-8');
    headers.append('Authorization', 'Basic ' + btoa('datvesieure:balobooking'));
  }

  get(url) {
    let headers = new Headers();
    this.createAuthorizationHeader(headers);
    return this.http.get(url, {
      headers: headers
    });
  }

  post(url, data) {
    let headers = new Headers();
    this.createAuthorizationHeader(headers);
    return this.http.post(url, data, {
      headers: headers
    });
  }
}