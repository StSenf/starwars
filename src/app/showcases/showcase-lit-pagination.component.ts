import {
  Component,
  CUSTOM_ELEMENTS_SCHEMA,
  OnDestroy,
  OnInit,
} from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { combineLatest, startWith, Subject, takeUntil } from 'rxjs';

@Component({
  standalone: true,
  selector: 'showcase-lit-pagination',
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  templateUrl: './showcase-lit-pagination.component.html',
  imports: [ReactiveFormsModule],
})
export class ShowcaseLitPaginationComponent implements OnInit, OnDestroy {
  paginationCurrentPage: number = 1;
  paginationPageSize: number = 7;
  paginationTotalRecords: number = 77;

  paginationPageSizeCtrl: FormControl = new FormControl<number>({
    value: 10,
    disabled: false,
  });
  paginationTotalRecordsCtrl: FormControl = new FormControl<number>({
    value: 62,
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

  changePage(event: CustomEvent) {
    console.log('event auf host');
    this.paginationCurrentPage = event.detail.clickedPage;
  }
  listen(event: CustomEvent) {
    console.log('event', event);
  }
}
