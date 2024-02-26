import { Routes } from '@angular/router';
import { SacStudentListComponent } from './sac-student-list/sac-student-list.component';

export const routes: Routes = [
  { path: 'students', component: SacStudentListComponent },
  // {
  //   path: 'student/:id',
  //   component: SacStudentDetailComponent,
  //   resolve: {
  //     studentPosts: PostResolverByStudentId,
  //     studentPhotos: PhotoResolverByStudentId,
  //     studentDetails: StudentDetailResolver,
  //   },
  // },
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
