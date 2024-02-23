import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatTableModule } from '@angular/material/table';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { MatFormFieldModule } from '@angular/material/form-field';
import { ReactiveFormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';

import { SwMaterialTableComponent } from './sw-material-table.component';

describe('SwMaterialTableComponent', () => {
  let component: SwMaterialTableComponent;
  let fixture: ComponentFixture<SwMaterialTableComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [SwMaterialTableComponent],
      imports: [
        NoopAnimationsModule,
        MatPaginatorModule,
        MatTableModule,
        ReactiveFormsModule,
        MatFormFieldModule,
        MatInputModule,
        HttpClientTestingModule,
      ],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SwMaterialTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should compile', () => {
    expect(component).toBeTruthy();
  });
});
