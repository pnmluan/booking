import { Component, OnInit } from '@angular/core';
import { Configuration } from '../../../shared/app.configuration';
import { Comment } from '../../../models/comment';
import { CommentDataService } from '../../../shared/comment.dataservice';


@Component({
  selector: 'app-comment',
  templateUrl: './comment.component.html',
  providers: [CommentDataService, Configuration]
})
export class CommentComponent implements OnInit {

	public comment: Comment;
	public comments = [];
	constructor(private _commentDataService: CommentDataService, private config: Configuration) { }

  	ngOnInit() {
		this._commentDataService.getAll().subscribe(res => {

			if (res.data) {

				var comments = [];
				for (var i = 0; i < res.data.length; i = i +2) {
					var temp = [];
					if (res.data[i]) {
						if (res.data[i]['img']) {
							res.data[i]['img'] = this._commentDataService.imgPath + res.data[i]['img'];
						}
						
						temp.push(res.data[i]);
					}
					if (res.data[i+1]) {
						if (res.data[i + 1]['img']) {
							res.data[i + 1]['img'] = this._commentDataService.imgPath + res.data[i + 1]['img'];
						}
						
						temp.push(res.data[i+1]);
					} else {
						temp.push(new Comment());
					}
					comments.push(temp);
				}
				this.comments = comments;

			}
		})
  	}

	

}
