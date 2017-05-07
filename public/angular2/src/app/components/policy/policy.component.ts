import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { NgForm } from '@angular/forms';
import { URLSearchParams } from '@angular/http';
import { ToasterService } from 'angular2-toaster/angular2-toaster';

@Component({
	selector: 'app-policy',
	templateUrl: './policy.component.html',
})

export class PolicyComponent implements OnInit {
	contact = {};

	constructor(
		private _ToasterService: ToasterService,
		private _title: Title
	) { }

	ngOnInit() {
		this._title.setTitle('  | Datvesieure');
	}
}
