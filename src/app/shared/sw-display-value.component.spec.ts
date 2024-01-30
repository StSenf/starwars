import { SwDisplayValueComponent } from './sw-display-value.component';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';

describe('SwDisplayValueComponent', () => {
  let component: SwDisplayValueComponent;
  let fixture: ComponentFixture<SwDisplayValueComponent>;

  let httpTestingController: HttpTestingController;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [SwDisplayValueComponent],
      imports: [HttpClientTestingModule],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SwDisplayValueComponent);
    component = fixture.componentInstance;
    httpTestingController = TestBed.inject(HttpTestingController);

    fixture.detectChanges();
  });

  describe('http get request', () => {
    let displayValueResult = undefined;

    afterEach(() => {
      httpTestingController.verify();
      displayValueResult = undefined;
    });

    it('should return correct display value', () => {
      const testPropertyValue: string = 'random name';
      const endpoint: string = '/mock';
      const testData: any = { name: testPropertyValue, age: 30 };

      component.endpoint = endpoint;
      component.displayProperty = 'name';
      component.ngOnInit();

      component.displayValue$.subscribe((dv) => (displayValueResult = dv));

      const req = httpTestingController.expectOne(endpoint);
      expect(req.request.method).toEqual('GET');
      req.flush(testData);

      expect(displayValueResult).toBe(testPropertyValue);
    });

    it('should not return if empty endpoint', () => {
      component.endpoint = '';
      component.displayProperty = 'name';
      component.ngOnInit();

      component.displayValue$.subscribe((dv) => (displayValueResult = dv));

      httpTestingController.expectNone('');
      expect(displayValueResult).toBe(undefined);
    });
  });
});
