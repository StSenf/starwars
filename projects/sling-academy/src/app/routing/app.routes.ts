import { Routes } from '@angular/router';
import { SacStudentListComponent } from '../sac-student-list/sac-student-list.component';
import { SacStudentDetailComponent } from '../sac-student-list/student-detail/sac-student-detail.component';
import { PostResolverByStudentId } from './sac-post-by-studentId.resolver';
import { StudentDetailResolver } from './sac-student-detail.resolver';

export const routes: Routes = [
  { path: 'students', component: SacStudentListComponent },
  {
    path: 'student/:id',
    component: SacStudentDetailComponent,
    resolve: {
      studentPosts: PostResolverByStudentId,
      // studentPhotos: PhotoResolverByStudentId,
      studentDetails: StudentDetailResolver,
    },
  },
  // {
  //   path: 'photos',
  //   loadComponent: () =>
  //     import('./sac-photo-list/sac-photo-list.component').then(
  //       (mod) => mod.SacPhotoListComponent,
  //     ),
  //   resolve: {
  //     photos: PhotoResolver,
  //   },
  // },
  // {
  //   path: 'posts',
  //   loadComponent: () =>
  //     import('./sac-post-list/sac-post-list.component').then(
  //       (mod) => mod.SacPostListComponent,
  //     ),
  //   resolve: {
  //     posts: PostResolver,
  //   },
  // },
  { path: '', redirectTo: '/students', pathMatch: 'full' },
];
