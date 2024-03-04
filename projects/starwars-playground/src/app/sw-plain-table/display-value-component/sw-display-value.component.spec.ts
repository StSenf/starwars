import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { of } from 'rxjs';
import { SwFilm } from '../../shared/interfaces';
import { MockSwapiService } from '../services/mock-swapi.service';
import { SwapiService } from '../services/swapi.service';
import { SwDisplayValueComponent } from './sw-display-value.component';

describe('SwDisplayValueComponent', () => {
  let component: SwDisplayValueComponent;
  let fixture: ComponentFixture<SwDisplayValueComponent>;

  let swapiSrv: SwapiService;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
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
    swapiSrv = TestBed.inject(SwapiService);

    component.endpoint = 'mock';
    component.rowIndex = 101;
    component.propertyToDisplay = 'title';
    component.colName = 'species';

    fixture.detectChanges();
  });

  it('should return correct display value', () => {
    let result = '';
    const expectedTitle = 'A new hope';

    component.propertyToDisplay = 'title';
    component.colName = 'mock';

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

    component.propertyToDisplay = 'NOT_MATCHING_PROPERTY_NAME';
    component.colName = 'mock';

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
