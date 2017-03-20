import { Component, OnInit } from '@angular/core';
declare let jQuery: any;
@Component({
  selector: 'app-introdution',
  templateUrl: './introdution.component.html'
})
export class IntrodutionComponent implements OnInit {

  constructor() { }

  ngOnInit() {
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
