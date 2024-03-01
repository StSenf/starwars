import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { combineLatest, startWith, Subject, takeUntil } from 'rxjs';
import { LibPaginationComponent } from 'shared-components';

@Component({
  standalone: true,
  selector: 'showcase-pagination',
  templateUrl: './showcase-pagination.component.html',
  imports: [ReactiveFormsModule, LibPaginationComponent],
})
export class ShowcasePaginationComponent implements OnInit, OnDestroy {
  paginationCurrentPage: number = 1;
  paginationPageSize: number;
  paginationTotalRecords: number;

  paginationPageSizeCtrl: FormControl = new FormControl<number>({
    value: 10,
    disabled: false,
  });
  paginationTotalRecordsCtrl: FormControl = new FormControl<number>({
    value: 82,
    disabled: false,
  });

  private _onDestroy$ = new Subject<any>();
  ngOnInit(): void {
    const startValPageSize = this.paginationPageSizeCtrl.getRawValue();
    const startValTotalRecords = this.paginationTotalRecordsCtrl.getRawValue();

    combineLatest([
      this.paginationPageSizeCtrl.valueChanges.pipe(
        startWith(startValPageSize),
      ),
      this.paginationTotalRecordsCtrl.valueChanges.pipe(
        startWith(startValTotalRecords),
      ),
    ])
      .pipe(takeUntil(this._onDestroy$))
      .subscribe(([pageSize, totalRecords]) => {
        this.paginationTotalRecords = totalRecords;
        this.paginationPageSize = pageSize;
      });
  }

  ngOnDestroy(): void {
    this._onDestroy$.next(null);
  }

  changePage(page: number) {
    this.paginationCurrentPage = page;
  }
}
