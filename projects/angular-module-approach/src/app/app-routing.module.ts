import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SwPlainTableComponent } from './sw-plain-table/sw-plain-table.component';
import { SwMaterialTableComponent } from './sw-material-table/sw-material-table.component';

const routes: Routes = [
  { path: 'plain-table', component: SwPlainTableComponent },
  { path: 'material-table', component: SwMaterialTableComponent },
  { path: '', redirectTo: '/plain-table', pathMatch: 'full' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
