import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { SlingStudentResponse } from './interfaces';

@Injectable({ providedIn: 'root' })
export class SlingAcademyService {
  constructor(private _http: HttpClient) {}

  public getStudents(): Observable<SlingStudentResponse> {
    const endpoint = 'https://api.slingacademy.com/v1/sample-data/users';

    return this._http.get<any>(endpoint);
  }
}
