import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { NgForm } from '@angular/forms';
import { URLSearchParams } from '@angular/http';
import { ToasterService } from 'angular2-toaster/angular2-toaster';

@Component({
	selector: 'app-about',
	templateUrl: './about.component.html',
})

export class AboutComponent implements OnInit {
	contact = {};

	constructor(
		private _ToasterService: ToasterService,
		private _title: Title
	) { }

	ngOnInit() {
		this._title.setTitle('Liên hệ | Datvesieure');
	}

	onSubmit(form: NgForm){
		if(form.valid){
			
		}else{
			this._ToasterService.pop('warning', '登録しました。');
		}
	}
}
