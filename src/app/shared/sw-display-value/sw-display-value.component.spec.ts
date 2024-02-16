import { SwDisplayValueComponent } from './sw-display-value.component';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';
import { SwapiService } from '../../services/swapi.service';
import { SwFilm, SwTableColConfig } from '../model/interfaces';
import { of } from 'rxjs';
import { MockSwapiService } from '../mocks/mock-swapi.service';

describe('SwDisplayValueComponent', () => {
  let component: SwDisplayValueComponent;
  let fixture: ComponentFixture<SwDisplayValueComponent>;

  let httpTestingController: HttpTestingController;
  let swapiSrv: SwapiService;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [SwDisplayValueComponent],
      imports: [HttpClientTestingModule],
      providers: [
        {
          provide: SwapiService,
          useClass: MockSwapiService,
        },
      ],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SwDisplayValueComponent);
    component = fixture.componentInstance;
    httpTestingController = TestBed.inject(HttpTestingController);
    swapiSrv = TestBed.inject(SwapiService);

    component.endpoint = 'mock';
    component.rowIndex = 101;
    component.colConfig = {
      columnDisplayProperty: 'mock',
      urlDisplayProperty: 'mock',
    } as SwTableColConfig;

    fixture.detectChanges();
  });

  it('should return correct display value', () => {
    let result = '';
    const expectedTitle = 'A new hope';

    component.colConfig = {
      columnDisplayProperty: 'mock',
      urlDisplayProperty: 'title',
    } as SwTableColConfig;

    spyOn(swapiSrv, 'getCellData').and.returnValue(
      of({
        title: expectedTitle,
        episode_id: 4,
        characters: [
          'https://swapi.dev/api/people/1',
          'https://swapi.dev/api/people/3',
        ],
      } as SwFilm),
    );

    component.ngOnInit();
    component.displayValue$.subscribe((val) => (result = val)).unsubscribe();

    expect(result).toBe(expectedTitle);
  });
  it('should return undefined if properties dont match', () => {
    let result = '';

    component.colConfig = {
      columnDisplayProperty: 'mock',
      urlDisplayProperty: 'NOT_MATCHING_PROPERTY_NAME',
    } as SwTableColConfig;

    spyOn(swapiSrv, 'getCellData').and.returnValue(
      of({
        title: 'A new hope',
        episode_id: 4,
        characters: [
          'https://swapi.dev/api/people/1',
          'https://swapi.dev/api/people/3',
        ],
      } as SwFilm),
    );

    component.ngOnInit();
    component.displayValue$.subscribe((val) => (result = val)).unsubscribe();

    expect(result).toBe(undefined);
  });
});
