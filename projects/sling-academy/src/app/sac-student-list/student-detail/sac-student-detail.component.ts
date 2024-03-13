import { DatePipe, NgForOf, NgIf } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Data, Router } from '@angular/router';
import { take } from 'rxjs';
import {
  SlingPost,
  SlingStudent,
  SlingStudentDetailResponse,
} from '../../shared/interfaces';
import { SacDateToAgePipe } from '../sac-date-to-age.pipe';

@Component({
  standalone: true,
  selector: 'sac-student-detail',
  templateUrl: './sac-student-detail.component.html',
  styleUrls: ['./sac-student-detail.component.scss'],
  imports: [DatePipe, NgForOf, NgIf, SacDateToAgePipe],
})
export class SacStudentDetailComponent implements OnInit {
  student: SlingStudent;
  studentPosts: SlingPost[];
  constructor(
    private _activatedRoute: ActivatedRoute,
    private _router: Router,
  ) {}

  ngOnInit(): void {
    this._activatedRoute.data.pipe(take(1)).subscribe((data: Data) => {
      this.student = (
        data['studentDetails'] as SlingStudentDetailResponse
      ).user;
      this.studentPosts = data['studentPosts'] as SlingPost[];
    });
  }

  navigateTo(id: number): void {
    this._router.navigate(['post/' + id]);
  }
}
