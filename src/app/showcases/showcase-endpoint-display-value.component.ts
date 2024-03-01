import { NgForOf, NgIf } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import {
  combineLatest,
  distinctUntilChanged,
  startWith,
  Subject,
  takeUntil,
} from 'rxjs';
import { LibEndpointDisplayValueComponent } from 'shared-components';

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
  standalone: true,
  selector: 'showcase-endpoint-display-value',
  templateUrl: './showcase-endpoint-display-value.component.html',
  imports: [
    LibEndpointDisplayValueComponent,
    ReactiveFormsModule,
    NgForOf,
    NgIf,
  ],
  styles: `
    lib-endpoint-display-value {
      display: block;
    }
    .btn-info {
    height: 37px;
    align-self: flex-end;
    color: white;
    margin-left: 24px;
  }`,
})
export class ShowcaseEndpointDisplayValueComponent
  implements OnInit, OnDestroy
{
  endpointConfiguration = ENDPOINT_CONFIGURATION;
  endpointPropertyOptions: string[] = ENDPOINT_CONFIGURATION[0].propertyOptions;
  endpointCurrentEp: string;
  endpointCurrentProp: string;
  endpointChoiceMade = false;

  endpointCtrl: FormControl = new FormControl<any>({
    value: null,
    disabled: false,
  });
  endpointPropertyCtrl: FormControl = new FormControl<any>({
    value: null,
    disabled: false,
  });

  private _onDestroy$ = new Subject<any>();

  ngOnInit(): void {
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
  }

  ngOnDestroy(): void {
    this._onDestroy$.next(null);
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
