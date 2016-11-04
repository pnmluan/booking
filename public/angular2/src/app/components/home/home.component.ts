import { Component, OnInit } from '@angular/core';
import { Comment } from '../../models/comment';
import { Configuration } from '../../shared/app.configuration';
import { CommentDataService } from '../../shared/comment.dataservice';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
  providers: [CommentDataService]
})
export class HomeComponent implements OnInit {

	constructor(private _CommentDataService: CommentDataService, private _configuration: Configuration) { }

	public comments: Comment[] = [];
	// public commentUrl = this._configuration.server + 'images/comment/';


	ngOnInit() {
		this._CommentDataService.getAll().subscribe(res => {

			if (res.status == 'success') {

				for (var key in res.data) {
					// res.data[key]['file'] = this.commentUrl + res.data[key]['file'];
					this.comments.push(res.data[key]);
				}
				console.log(this.comments);
			}
		})
	}

}
