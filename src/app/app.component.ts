import { NgForOf, NgIf } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import {
  combineLatest,
  distinctUntilChanged,
  startWith,
  Subject,
  takeUntil,
} from 'rxjs';
import {
  LibEndpointDisplayValueComponent,
  LibLoadingModalComponent,
  LibPaginationComponent,
  LibToggleComponent,
} from 'shared-components';

interface EndpointConfiguration {
  endpoint: string;
  selectOption: string;
  propertyOptions: string[];
}

const ENDPOINT_CONFIGURATION: EndpointConfiguration[] = [
  {
    endpoint: 'https://swapi.dev/api/planets/1',
    selectOption: 'Star Wars Planet 1',
    propertyOptions: ['name', 'diameter', 'climate'],
  },
  {
    endpoint: 'https://swapi.dev/api/people/1',
    selectOption: 'Star Wars People 1',
    propertyOptions: ['name', 'gender', 'hair_color'],
  },
  {
    endpoint: 'https://swapi.dev/api/films/3',
    selectOption: 'Star Wars Film 3',
    propertyOptions: ['title', 'opening_crawl', 'director'],
  },
];

@Component({
  selector: 'app-root',
  standalone: true,
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
  imports: [
    LibPaginationComponent,
    LibToggleComponent,
    LibEndpointDisplayValueComponent,
    ReactiveFormsModule,
    NgForOf,
    NgIf,
  ],
})
export class AppComponent implements OnInit {
  paginationCurrentPage: number = 1;
  paginationPageSize: number;
  paginationTotalRecords: number;
  toggleLabelText: string;
  toggleTooltipText: string;

  endpointConfiguration = ENDPOINT_CONFIGURATION;
  endpointPropertyOptions: string[] = ENDPOINT_CONFIGURATION[0].propertyOptions;
  endpointCurrentEp: string;
  endpointCurrentProp: string;
  endpointChoiceMade = false;

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
  endpointCtrl: FormControl = new FormControl<any>({
    value: null,
    disabled: false,
  });
  endpointPropertyCtrl: FormControl = new FormControl<any>({
    value: null,
    disabled: false,
  });

  private _onDestroy$ = new Subject<any>();

  constructor(private _modalService: NgbModal) {}

  ngOnInit(): void {
    const startValPageSize = this.paginationPageSizeCtrl.getRawValue();
    const startValTotalRecords = this.paginationTotalRecordsCtrl.getRawValue();
    const startValToggleLabel = this.toggleLabelCtrl.getRawValue();
    const startValToggleTooltip = this.toggleTooltipCtrl.getRawValue();

    combineLatest([
      this.endpointCtrl.valueChanges.pipe(startWith(null)),
      this.endpointPropertyCtrl.valueChanges.pipe(startWith(null)),
    ])
      .pipe(
        takeUntil(this._onDestroy$),
        distinctUntilChanged((a, b) => JSON.stringify(a) === JSON.stringify(b)),
      )
      .subscribe(([epChoice, propChoice]) => {
        if (propChoice && epChoice) {
          this.endpointChoiceMade = true;
          this.endpointPropertyCtrl.disable();
          this.endpointCtrl.disable();
        }

        this.endpointPropertyOptions = epChoice?.propertyOptions;
        this.endpointCurrentEp = epChoice?.endpoint;
        this.endpointPropertyCtrl.setValue(propChoice);
        this.endpointCurrentProp = propChoice;
      });

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

    combineLatest([
      this.toggleLabelCtrl.valueChanges.pipe(startWith(startValToggleLabel)),
      this.toggleTooltipCtrl.valueChanges.pipe(
        startWith(startValToggleTooltip),
      ),
    ])
      .pipe(takeUntil(this._onDestroy$))
      .subscribe(([toggleLabel, toggleTooltip]) => {
        this.toggleLabelText = toggleLabel;
        this.toggleTooltipText = toggleTooltip;
      });
  }

  ngOnDestroy(): void {
    this._onDestroy$.next(null);
  }

  changePage(page: number) {
    this.paginationCurrentPage = page;
  }

  openModal(): void {
    this._modalService.open(LibLoadingModalComponent);
  }

  clearSelection(): void {
    this.endpointChoiceMade = false;
    this.endpointPropertyCtrl.enable();
    this.endpointCtrl.enable();

    this.endpointCurrentEp = null;
    this.endpointCurrentProp = null;
    this.endpointPropertyOptions = null;
    this.endpointPropertyCtrl.setValue(null);
    this.endpointCtrl.setValue(null);
  }
}
