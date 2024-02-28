import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable, switchMap } from 'rxjs';
import {
  SlingPost,
  SlingPostListResponse,
  SlingStudent,
  SlingStudentListResponse,
} from './interfaces';

@Injectable({ providedIn: 'root' })
export class SlingAcademyService {
  constructor(private _http: HttpClient) {}

  getStudents(
    offset: number = 0,
    limit: number = 10,
  ): Observable<SlingStudentListResponse> {
    const endpoint = `https://api.slingacademy.com/v1/sample-data/users?offset=${offset}&limit=${limit}`;

    return this._http.get<SlingStudentListResponse>(endpoint);
  }

  getStudentById(id: string): Observable<SlingStudent> {
    const endpoint = `https://api.slingacademy.com/v1/sample-data/users/${id}`;

    return this._http.get<SlingStudent>(endpoint);
  }

  getPostsByStudentId(studentId: string): Observable<SlingPost[]> {
    const endpoint = `https://api.slingacademy.com/v1/sample-data/blog-posts`;

    // API has no search parameter for posts
    // therefore we need to get all posts and then filter for the student ID
    return this._http.get<SlingPostListResponse>(endpoint).pipe(
      switchMap((firstResp: SlingPostListResponse) =>
        this._http.get<SlingPostListResponse>(
          endpoint + `?limit=${firstResp.total_blogs}`,
        ),
      ),
      map((secondResp: SlingPostListResponse) => {
        return secondResp.blogs.filter(
          (post: SlingPost) => post.user_id === Number(studentId),
        );
      }),
    );
  }

  getPosts(
    offset: number = 0,
    limit: number = 10,
  ): Observable<SlingPostListResponse> {
    const endpoint = `https://api.slingacademy.com/v1/sample-data/blog-posts?offset=${offset}&limit=${limit}`;

    return this._http.get<SlingPostListResponse>(endpoint);
  }

  getPostById(id: string): Observable<SlingPost> {
    const endpoint = `https://api.slingacademy.com/v1/sample-data/blog-posts/${id}`;

    return this._http.get<SlingPost>(endpoint);
  }
}
