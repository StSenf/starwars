import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

// import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { SwMaterialTableComponent } from './sw-material-table/sw-material-table.component';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { RouterModule } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { SwPlainTableComponent } from './sw-plain-table/sw-plain-table.component';
import { SwDisplayValueComponent } from './shared/sw-display-value/sw-display-value.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SwPaginationComponent } from './shared/sw-pagination/sw-pagination.component';

@NgModule({
  declarations: [
    AppComponent,
    SwDisplayValueComponent,
    SwMaterialTableComponent,
    SwPaginationComponent,
    SwPlainTableComponent,
  ],
  imports: [
    BrowserAnimationsModule,
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    MatPaginatorModule,
    MatSortModule,
    MatTableModule,
    RouterModule,
    // AppRoutingModule
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
