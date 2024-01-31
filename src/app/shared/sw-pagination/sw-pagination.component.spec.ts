import { SwPaginationComponent } from './sw-pagination.component';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';

describe('SwPaginationComponent', () => {
  let component: SwPaginationComponent;
  let fixture: ComponentFixture<SwPaginationComponent>;

  let httpTestingController: HttpTestingController;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [SwPaginationComponent],
      imports: [HttpClientTestingModule],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SwPaginationComponent);
    component = fixture.componentInstance;
    httpTestingController = TestBed.inject(HttpTestingController);
    fixture.detectChanges();
  });

  it('should get correct available page count', () => {
    let availablePageCount: number;

    const count = 82;
    const pageSize = 5;
    const expectedAvailablePageCount: number = Math.ceil(count / pageSize);

    const endpoint: string = '/mock';
    const testData: any = { count, title: 'cool' };

    component.endpoint = endpoint;
    component.currentPage = 1;
    component.pageSize = pageSize;
    component.ngOnInit();

    // subscribe to available page count, setter can be checked several times
    component.availablePagesCount$.subscribe(
      (res) => (availablePageCount = res),
    );

    // flush http response once
    const req = httpTestingController.expectOne(endpoint);
    expect(req.request.method).toEqual('GET');
    req.flush(testData);

    expect(availablePageCount).toBe(expectedAvailablePageCount);

    // use setter a 2nd time
    component.pageSize = 10;
    const newAvailablePageCount: number = Math.ceil(count / 10);
    expect(availablePageCount).toBe(newAvailablePageCount);
  });
});
