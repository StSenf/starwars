import { AsyncPipe, DatePipe, NgFor, NgIf } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { filter, Observable } from 'rxjs';
import { SlingStudentResponse } from '../shared/interfaces';
import { SlingAcademyService } from '../shared/sling-academy.service';
import { SacDateToAgePipe } from './sac-date-to-age.pipe';

@Component({
  standalone: true,
  selector: 'sac-student-list',
  templateUrl: './sac-student-list.component.html',
  imports: [NgIf, NgFor, AsyncPipe, SacDateToAgePipe, DatePipe],
})
export class SacStudentListComponent implements OnInit {
  apiResponse$: Observable<SlingStudentResponse>;

  constructor(private _slingAcademySrv: SlingAcademyService) {}

  ngOnInit(): void {
    this.apiResponse$ = this._slingAcademySrv
      .getStudents()
      .pipe(filter((res) => !!res === true));

    this.apiResponse$.subscribe((res) => console.log('api response', res));
  }
}
