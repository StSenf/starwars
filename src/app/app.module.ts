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
import { SwDisplayValueComponent } from './shared/sw-display-value.component';

@NgModule({
  declarations: [
    AppComponent,
    SwMaterialTableComponent,
    SwPlainTableComponent,
    SwDisplayValueComponent,
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    RouterModule,
    HttpClientModule,
    // AppRoutingModule
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
