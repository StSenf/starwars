import { AsyncPipe, DatePipe, NgForOf, NgIf } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, filter, Observable, switchMap } from 'rxjs';
import { LibPaginationComponent } from 'shared-components';
import { SlingPostListResponse } from '../shared/interfaces';
import { SlingAcademyService } from '../shared/sling-academy.service';

@Component({
  standalone: true,
  selector: 'sac-post-list',
  templateUrl: './sac-post-list.component.html',
  imports: [AsyncPipe, DatePipe, NgForOf, NgIf, LibPaginationComponent],
})
export class SacPostListComponent implements OnInit {
  postsResponse$: Observable<SlingPostListResponse>;
  currentPage: number = 1;
  currentPageLimit: number = 10;

  private _pageChange$ = new BehaviorSubject<number>(this.currentPage);
  constructor(
    private _slingAcademySrv: SlingAcademyService,
    private _router: Router,
  ) {}

  ngOnInit(): void {
    this.postsResponse$ = this._pageChange$.pipe(
      switchMap((desiredPage) => {
        const offset =
          desiredPage * this.currentPageLimit - this.currentPageLimit;
        return this._slingAcademySrv.getPosts(offset, this.currentPageLimit);
      }),
      filter((res: SlingPostListResponse) => !!res === true),
    );
  }

  navigateTo(id: number): void {
    this._router.navigate(['post/' + id]);
  }

  changePage(page: number) {
    this.currentPage = page;
    this._pageChange$.next(page);
  }
}
