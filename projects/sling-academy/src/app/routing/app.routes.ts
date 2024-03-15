import { Routes } from '@angular/router';
import { SacStudentListComponent } from '../sac-student-list/sac-student-list.component';
import { SacStudentDetailComponent } from '../sac-student-list/student-detail/sac-student-detail.component';
import { PostResolverByStudentId } from './sac-post-by-studentId.resolver';
import { PostDetailResolver } from './sac-post-detail.resolver';
import { StudentDetailResolver } from './sac-student-detail.resolver';

export const routes: Routes = [
  { path: 'students', component: SacStudentListComponent },
  {
    path: 'student/:id',
    component: SacStudentDetailComponent,
    resolve: {
      studentPosts: PostResolverByStudentId,
      studentDetails: StudentDetailResolver,
    },
  },
  {
    path: 'posts',
    loadComponent: () =>
      import('../sac-post-list/sac-post-list.component').then(
        (mod) => mod.SacPostListComponent,
      ),
  },
  {
    path: 'post/:id',
    loadComponent: () =>
      import('../sac-post-list/post-detail/sac-post-detail.component').then(
        (mod) => mod.SacPostDetailComponent,
      ),
    resolve: {
      postDetails: PostDetailResolver,
    },
  },
  { path: '', redirectTo: '/students', pathMatch: 'full' },
  { path: '**', redirectTo: '/students', pathMatch: 'full' }, // Wildcard route for a not found page
];
