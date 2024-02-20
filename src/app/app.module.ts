import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { RouterModule } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { MatFormFieldModule } from '@angular/material/form-field';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatInputModule } from '@angular/material/input';

import { AppComponent } from './app.component';
import { SwMaterialTableComponent } from './sw-material-table/sw-material-table.component';
import { SwPlainTableComponent } from './sw-plain-table/sw-plain-table.component';
import { SwDisplayValueComponent } from './shared/sw-display-value/sw-display-value.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SwPaginationComponent } from './shared/sw-pagination/sw-pagination.component';
import { AppRoutingModule } from './app-routing.module';
import { SwLoadingStateToggleComponent } from './shared/sw-loading-state-toggle/sw-loading-state-toggle.component';

@NgModule({
  declarations: [
    AppComponent,
    SwDisplayValueComponent,
    SwMaterialTableComponent,
    SwPaginationComponent,
    SwPlainTableComponent,
    SwLoadingStateToggleComponent,
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
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
