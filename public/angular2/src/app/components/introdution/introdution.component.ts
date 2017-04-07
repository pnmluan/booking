import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';

declare let jQuery: any;

@Component({
  selector: 'app-introdution',
  templateUrl: './introdution.component.html'
})

export class IntrodutionComponent implements OnInit {

	constructor(
		private _title: Title
	) { }

	ngOnInit() {
		this._title.setTitle('Giới thiệu | Datvesieure');

		jQuery('.intro-services-inner .item .item-inner h3').matchHeight({
			byRow: true,
			property: 'height',
			target: null,
			remove: false
		});
		jQuery('.intro-services-inner .item .item-inner p').matchHeight({
			byRow: true,
			property: 'height',
			target: null,
			remove: false
		});
	}

}
