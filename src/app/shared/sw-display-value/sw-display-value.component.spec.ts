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
    afterEach(() => {
      httpTestingController.verify();
    });

    it('should return correct display value', () => {
      const testPropertyValue: string = 'random name';
      const endpoint: string = '/mock';
      const testData: any = { name: testPropertyValue, age: 30 };

      component.endpoint = endpoint;
      component.displayProperty = 'name';
      component.ngOnInit();

      const req = httpTestingController.expectOne(endpoint);
      expect(req.request.method).toEqual('GET');
      req.flush(testData);

      expect(component.displayValue).toBe(testPropertyValue);
    });

    it('should not return if empty endpoint', () => {
      component.endpoint = '';
      component.displayProperty = 'name';
      component.ngOnInit();

      httpTestingController.expectNone('');
      expect(component.displayValue).toBe(undefined);
    });
  });
});
