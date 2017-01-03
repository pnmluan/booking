import { Component, OnInit } from '@angular/core';
import { Configuration } from '../../../shared/app.configuration';
import { NewsDataService } from '../../../shared/news.dataservice';
declare let moment: any;

@Component({
  selector: 'app-news',
  templateUrl: './news.component.html',
  providers: [NewsDataService, Configuration]
})
export class NewsComponent implements OnInit {

	public news = [];
	public bannerPath: string;
	constructor(private _NewsDataService: NewsDataService, private _Configuration: Configuration) { }

	ngOnInit() {
		
		this._NewsDataService.getAll().subscribe(res => {

			if (res.data) {

				for (var key in res.data) {
					res.data[key].img = this._NewsDataService.imgPath + res.data[key].img;
					res.data[key].created_at = moment(res.data[key].created_at).format(this._Configuration.viFormatDate);
					this.news.push(res.data[key]);
				}

			}

		});
	}

}


