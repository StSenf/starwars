import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatTableModule } from '@angular/material/table';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterModule } from '@angular/router';
import { NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';
import { LibPaginationComponent, LibToggleComponent } from 'shared-components';
import { AppRoutingModule } from './app-routing.module';

import { AppComponent } from './app.component';
import { SwDisplayValueComponent } from './shared/sw-display-value/sw-display-value.component';
import { SwMaterialTableComponent } from './sw-material-table/sw-material-table.component';
import { SwSortComponent } from './sw-plain-table/sorting/sw-sort.component';
import { SwPlainTableComponent } from './sw-plain-table/sw-plain-table.component';

@NgModule({
  declarations: [
    AppComponent,
    SwDisplayValueComponent,
    SwMaterialTableComponent,
    SwPlainTableComponent,
    SwSortComponent,
  ],
  imports: [
    BrowserAnimationsModule,
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    MatPaginatorModule,
    MatTableModule,
    MatFormFieldModule,
    MatInputModule,
    RouterModule,
    AppRoutingModule,
    NgbTooltipModule,
    LibPaginationComponent,
    LibToggleComponent,
  ],
  providers: [],
  bootstrap: [AppComponent],
  exports: [SwDisplayValueComponent],
})
export class AppModule {}
