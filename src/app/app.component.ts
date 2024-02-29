import { Component, OnInit } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { combineLatest, startWith } from 'rxjs';
import {
  LibLoadingModalComponent,
  LibPaginationComponent,
  LibToggleComponent,
} from 'shared-components';

@Component({
  selector: 'app-root',
  standalone: true,
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
  imports: [LibPaginationComponent, LibToggleComponent, ReactiveFormsModule],
})
export class AppComponent implements OnInit {
  paginationCurrentPage: number = 1;
  paginationPageSize: number;
  paginationTotalRecords: number;
  toggleLabelText: string;
  toggleTooltipText: string;

  paginationPageSizeCtrl: FormControl = new FormControl<number>({
    value: 10,
    disabled: false,
  });
  paginationTotalRecordsCtrl: FormControl = new FormControl<number>({
    value: 82,
    disabled: false,
  });
  toggleLabelCtrl: FormControl = new FormControl<string>({
    value: 'Activate specific behaviour',
    disabled: false,
  });
  toggleTooltipCtrl: FormControl = new FormControl<string>({
    value: 'When activated, everything works!',
    disabled: false,
  });
  toggleCtrl: FormControl = new FormControl<boolean>({
    value: true,
    disabled: false,
  });

  constructor(private _modalService: NgbModal) {}

  ngOnInit(): void {
    const startValPageSize = this.paginationPageSizeCtrl.getRawValue();
    const startValTotalRecords = this.paginationTotalRecordsCtrl.getRawValue();
    const startValToggleLabel = this.toggleLabelCtrl.getRawValue();
    const startValToggleTooltip = this.toggleTooltipCtrl.getRawValue();

    combineLatest([
      this.paginationPageSizeCtrl.valueChanges.pipe(
        startWith(startValPageSize),
      ),
      this.paginationTotalRecordsCtrl.valueChanges.pipe(
        startWith(startValTotalRecords),
      ),
      this.toggleLabelCtrl.valueChanges.pipe(startWith(startValToggleLabel)),
      this.toggleTooltipCtrl.valueChanges.pipe(
        startWith(startValToggleTooltip),
      ),
    ]).subscribe(([pageSize, totalRecords, toggleLabel, toggleTooltip]) => {
      this.paginationTotalRecords = totalRecords;
      this.paginationPageSize = pageSize;
      this.toggleLabelText = toggleLabel;
      this.toggleTooltipText = toggleTooltip;
    });
  }

  changePage(page: number) {
    this.paginationCurrentPage = page;
  }

  openModal(): void {
    this._modalService.open(LibLoadingModalComponent);
  }
}
