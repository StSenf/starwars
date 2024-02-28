import { AsyncPipe, DatePipe, NgForOf, NgIf } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { filter, Observable } from 'rxjs';
import { SacDateToAgePipe } from '../sac-student-list/sac-date-to-age.pipe';
import { SlingPostListResponse } from '../shared/interfaces';
import { SlingAcademyService } from '../shared/sling-academy.service';

@Component({
  standalone: true,
  selector: 'sac-post-list',
  templateUrl: './sac-post-list.component.html',
  imports: [AsyncPipe, DatePipe, NgForOf, NgIf, SacDateToAgePipe],
})
export class SacPostListComponent implements OnInit {
  postsResponse$: Observable<SlingPostListResponse>;
  constructor(
    private _slingAcademySrv: SlingAcademyService,
    private _router: Router,
  ) {}

  ngOnInit(): void {
    this.postsResponse$ = this._slingAcademySrv
      .getPosts()
      .pipe(filter((res) => !!res === true));
  }

  navigateTo(id: number): void {
    this._router.navigate(['post/' + id]);
  }
}
