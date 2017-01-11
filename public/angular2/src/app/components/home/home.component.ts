import { Component, OnInit, AfterViewInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import {
	FormGroup,
	FormControl,
	Validators,
	FormBuilder,
	FormArray
} from "@angular/forms";
import { LocalStorageService } from 'angular-2-local-storage';
import { SelectModule } from 'angular2-select';
import { UUID } from 'angular2-uuid';
import { ModalComponent } from 'ng2-bs3-modal/ng2-bs3-modal';

import { BannerComponent } from './banner';
import { NewsComponent } from './news';
import { CommentComponent } from './comment';
import { Location } from '../../models/Location';

import { Configuration } from '../../shared/app.configuration';
import { LocationDataService, BannerDataService, NewsDataService } from '../../shared';
declare let jQuery: any;
declare let moment: any;


@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  providers: [BannerComponent, NewsComponent, BannerComponent, LocationDataService, BannerDataService, NewsDataService]
})
export class HomeComponent implements OnInit, AfterViewInit {
	@ViewChild('warning') warning: ModalComponent;
	warningMsg = '';
	people = this._Configuration.arr_number_people;
	infants = this._Configuration.arr_number_infants;
	locations = [];
	round_trip = 'off';
	search = {};
	filterBookForm: FormGroup;

	constructor(
		private formBuilder: FormBuilder, 
		private _LocationDataService: LocationDataService, 
		private _Configuration: Configuration,
		private _bannerDataService: BannerDataService, 
		private sessionStorage: LocalStorageService,
		private router: Router) { 

		this.filterBookForm = this.formBuilder.group({
			'round_trip': 'off',
			'from': ['', Validators.required],
			'to': ['', Validators.required],
			'from_date': ['', Validators.required],
			'to_date': '',
			'adult': ['1', Validators.required],
			'children': ['0'],
			'infant': ['0']
		});

		// this.filterBookForm.statusChanges.subscribe(
		// 	(data: any) => console.log(data)
		// );

		this._LocationDataService.getAll().subscribe(res => {

			if (res.data) {
				var locations = [];
				for (var key in res.data) {

					var temp = {
						value: res.data[key].code,
						label: res.data[key].name
					};
					locations.push(temp);

				}
				this.locations = locations;
			}

		});
	}

	

	ngOnInit() {
		
	}

	ngAfterViewInit() {
		setTimeout(function() {
			jQuery('.owl-carousel.customer-comment').owlCarousel({
				navigation: false,
				slideSpeed: 300,
				paginationSpeed: 400,
				singleItem: true,
				autoPlay: 5000
			});

			jQuery('.owl-carousel-home-slider').owlCarousel({
				navigation: true,
				slideSpeed: 300,
				paginationSpeed: 400,
				singleItem: true,
				autoPlay: 5000,
				transitionStyle: "fade",
				pagination: false
			});

			jQuery(".select-adult, .select-child-1, .select-child-2").select2({
			    width: '100%',
			    minimumResultsForSearch: -1
			});
		}, 500);
	}
	
	onSubmit() {


		var objectStore = this.filterBookForm.value;

		if (objectStore.from == objectStore.to) {
			this.warningMsg = 'Điểm đi và Điểm đến không được trùng nhau.';
			this.warning.open();
			return;
		}
		objectStore.from_date = moment(objectStore.from_date, this._Configuration.viFormatDate).format(this._Configuration.dateFormat);
		if (objectStore.from_date < moment().format(this._Configuration.dateFormat)) {
			this.warningMsg = 'Ngày đi phải nhỏ hơn ngày hiện tại.';
			this.warning.open('sm');
			return;
		}
		
		objectStore.adult = jQuery('.select-adult').val();
		objectStore.children = jQuery('.select-child-1').val();
		objectStore.infant = jQuery('.select-child-2').val();

		
		objectStore.from_name = this.getNameFromCode(objectStore.from);
		objectStore.to_name = this.getNameFromCode(objectStore.to);

		if (objectStore.to_date == undefined) {
			objectStore.to_date = '';

		} else {
			objectStore.to_date = moment(objectStore.to_date, this._Configuration.viFormatDate).format(this._Configuration.dateFormat);
			if (objectStore.from_date > objectStore.to_date) {
				this.warningMsg = 'Ngày đi phải nhỏ hơn Ngày đến.';
				this.warning.open();
				return;
			}
			objectStore.to_name = this.getNameFromCode(objectStore.to);
		}

		let uuid = UUID.UUID();
		this.sessionStorage.remove('session_flight');
		this.sessionStorage.remove('session_token');
		this.sessionStorage.set('session_token', uuid);
		this.sessionStorage.set('session_flight', JSON.stringify(objectStore));
		this.router.navigate(['search-result/' + uuid]);
		
		
	}

	selectPlaneOption(round_trip) {
		if(round_trip == 'off') {
			jQuery('#date-back input').prop('disabled', true);
		} else {
			jQuery('#date-back input').prop('disabled', false);
		}
	}

	// Get Name From Code
	protected getNameFromCode(code: string) {
		let label = '';
		for (var key in this.locations) {
			if (this.locations[key].value == code)
				return this.locations[key].label;
		}
		return label;
	}


	onDateChanged(event: any) {
		console.log('onDateChanged(): ', event.date, ' - formatted: ', event.formatted, ' - epoc timestamp: ', event.epoc);
	}

}
