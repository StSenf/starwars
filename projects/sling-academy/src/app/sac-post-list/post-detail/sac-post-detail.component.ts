import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Data } from '@angular/router';
import { take } from 'rxjs';
import { SlingPost, SlingPostResponse } from '../../shared/interfaces';

@Component({
  standalone: true,
  selector: 'sac-post-detail',
  templateUrl: './sac-post-detail.component.html',
  styleUrls: ['./sac-post-detail.component.scss'],
  imports: [DatePipe],
})
export class SacPostDetailComponent implements OnInit {
  post: SlingPost;

  constructor(private _activatedRoute: ActivatedRoute) {}

  ngOnInit() {
    this._activatedRoute.data.pipe(take(1)).subscribe((data: Data) => {
      this.post = (data['postDetails'] as SlingPostResponse).blog;
    });
  }
}
