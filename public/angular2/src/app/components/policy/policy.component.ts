import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { NgForm } from '@angular/forms';
import { URLSearchParams } from '@angular/http';
import { ToasterService } from 'angular2-toaster/angular2-toaster';
declare let jQuery: any;
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
		this._title.setTitle(' Điều khoản | Datvesieure');
		setTimeout(() => {
			jQuery("a[href^=#]").click(function(e) {
				e.preventDefault();
				var dest = jQuery(this).attr('href');
				jQuery('html,body').animate({ scrollTop: jQuery(dest).offset().top - 120 }, 'fast');
			});

			jQuery('.in-this-article').stick_in_parent();

			jQuery(".select-from, .select-to").select2({
				width: '100%'
			});
		}, 100);
	}
}
