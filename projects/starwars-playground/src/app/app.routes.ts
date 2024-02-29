import { Routes } from '@angular/router';
import { SwPlainTableComponent } from './sw-plain-table/sw-plain-table.component';

export const routes: Routes = [
  { path: 'plain-table', component: SwPlainTableComponent },
  {
    path: 'material-table',
    loadComponent: () =>
      import('./sw-material-table/sw-material-table.component').then(
        (mod) => mod.SwMaterialTableComponent,
      ),
  },
  { path: '', redirectTo: '/plain-table', pathMatch: 'full' },
];
