import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { URLSearchParams } from '@angular/http';

@Component({
	selector: 'app-about',
	templateUrl: './about.component.html',
})

export class AboutComponent implements OnInit {
	contact = {};

	constructor() { }

	ngOnInit() { }

}
