import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { LibEndpointDisplayValueComponent } from './endpoint-display-value.component';

describe('LibEndpointDisplayValueComponent', () => {
  let component: LibEndpointDisplayValueComponent;
  let fixture: ComponentFixture<LibEndpointDisplayValueComponent>;
  let httpTestingController: HttpTestingController;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });

    httpTestingController = TestBed.inject(HttpTestingController);
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LibEndpointDisplayValueComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  describe('ngOnInit()', () => {
    afterEach(() => {
      httpTestingController.verify();
    });

    it('should display the correct value', () => {
      let displayValue: string;
      const mockResponse = { name: 'Jane Doe', age: 30 };
      component.endpoint = 'www.mock.de';
      component.propertyToDisplay = 'name';
      component.ngOnInit();

      component.displayValue$.subscribe((res) => (displayValue = res));

      const req = httpTestingController.expectOne('www.mock.de');
      expect(req.request.method).toEqual('GET');
      req.flush(mockResponse);

      expect(displayValue).toBe('Jane Doe');
    });
  });
});
