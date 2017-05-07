import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { NgForm } from '@angular/forms';
import { URLSearchParams } from '@angular/http';
import { ToasterService } from 'angular2-toaster/angular2-toaster';

@Component({
	selector: 'app-tutorial',
	templateUrl: './tutorial.component.html',
})

export class TutorialComponent implements OnInit {
	contact = {};

	constructor(
		private _ToasterService: ToasterService,
		private _title: Title
	) { }

	ngOnInit() {
		this._title.setTitle('Hướng dẫn | Datvesieure');
	}

}
