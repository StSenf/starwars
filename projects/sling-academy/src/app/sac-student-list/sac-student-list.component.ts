import { AsyncPipe, DatePipe, NgFor, NgIf } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, filter, Observable, switchMap } from 'rxjs';
import { LibPaginationComponent } from 'shared-components';

import { SlingStudentListResponse } from '../shared/interfaces';
import { SlingAcademyService } from '../shared/sling-academy.service';
import { SacDateToAgePipe } from './sac-date-to-age.pipe';

@Component({
  standalone: true,
  selector: 'sac-student-list',
  templateUrl: './sac-student-list.component.html',
  styleUrls: ['sac-student-list.component.scss'],
  imports: [
    NgIf,
    NgFor,
    AsyncPipe,
    SacDateToAgePipe,
    DatePipe,
    LibPaginationComponent,
  ],
})
export class SacStudentListComponent implements OnInit {
  studentListResponse$: Observable<SlingStudentListResponse>;
  currentPage: number = 1;
  currentPageLimit: number = 10;

  private _pageChange$ = new BehaviorSubject<number>(this.currentPage);

  constructor(
    private _slingAcademySrv: SlingAcademyService,
    private _router: Router,
  ) {}

  ngOnInit(): void {
    this.studentListResponse$ = this._pageChange$.pipe(
      switchMap((desiredPage) => {
        const offset =
          desiredPage * this.currentPageLimit - this.currentPageLimit;
        return this._slingAcademySrv.getStudents(offset, this.currentPageLimit);
      }),
      filter((res: SlingStudentListResponse) => !!res === true),
    );

    this.studentListResponse$.subscribe((res) =>
      console.log('student list response', res),
    );
  }

  navigateTo(id: number): void {
    this._router.navigate(['student/' + id]);
  }

  changePage(page: number) {
    this.currentPage = page;
    this._pageChange$.next(page);
  }
}
