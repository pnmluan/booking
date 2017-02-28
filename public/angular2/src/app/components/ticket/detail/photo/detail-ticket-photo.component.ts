import { Component, Input, OnInit, AfterViewInit } from '@angular/core';

declare let jQuery: any;

@Component({
	selector: 'detail-ticket-photo',
	templateUrl: './detail-ticket-photo.component.html',
})

export class DetailTicketPhotoComponent implements OnInit {
	@Input() albums: Array<any> = [];
	@Input() imgPath: string;

	constructor(){ }

	ngOnInit(){
		this.loadScript();
	}

	loadScript(){
		console.log('loaded');
		setTimeout(() => {
			function photosGallery() {
				var sync1 = jQuery("#sync1");
				var sync2 = jQuery("#sync2");

				sync1.owlCarousel({
					singleItem: true,
					slideSpeed: 1000,
					navigation: true,
					pagination: false,
					autoPlay: 5000,
					afterAction: syncPosition,
					responsiveRefreshRate: 200,
				});

				sync2.owlCarousel({
					items: 8,
					itemsDesktop: [1199, 8],
					itemsDesktopSmall: [979, 6],
					itemsTablet: [768, 5],
					itemsMobile: [479, 4],
					pagination: false,
					responsiveRefreshRate: 100,
					afterInit: function(el) {
						el.find(".owl-item").eq(0).addClass("synced");
					}
				});

				function syncPosition(el) {
					var current = this.currentItem;
					jQuery("#sync2")
						.find(".owl-item")
						.removeClass("synced")
						.eq(current)
						.addClass("synced")
					if (jQuery("#sync2").data("owlCarousel") !== undefined) {
						center(current)
					}

				}

				jQuery("#sync2").on("click", ".owl-item", function(e) {
					e.preventDefault();
					var number = jQuery(this).data("owlItem");
					sync1.trigger("owl.goTo", number);
				});

				function center(number) {
					var sync2visible = sync2.data("owlCarousel").owl.visibleItems;

					var num = number;
					var found = false;
					for (var i in sync2visible) {
						if (num === sync2visible[i]) {
							var found = true;
						}
					}

					if (found === false) {
						if (num > sync2visible[sync2visible.length - 1]) {
							sync2.trigger("owl.goTo", num - sync2visible.length + 2);
						} else {
							if (num - 1 === -1) {
								num = 0;
							}
							sync2.trigger("owl.goTo", num);
						}
					} else if (num === sync2visible[sync2visible.length - 1]) {
						sync2.trigger("owl.goTo", sync2visible[1]);
					} else if (num === sync2visible[0]) {
						sync2.trigger("owl.goTo", num - 1);
					}
				}
			}
			photosGallery();
		},1000)
	}
}