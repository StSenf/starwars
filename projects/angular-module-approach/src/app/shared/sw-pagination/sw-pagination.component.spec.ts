import { SwPaginationComponent } from './sw-pagination.component';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

describe('SwPaginationComponent', () => {
  let component: SwPaginationComponent;
  let fixture: ComponentFixture<SwPaginationComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [SwPaginationComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SwPaginationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should get correct available page count', () => {
    let availablePageCount: number;

    const count = 82;
    const pageSize = 5;
    const expectedAvailablePageCount: number = Math.ceil(count / pageSize);

    component.currentPage = 1;
    component.pageSize = pageSize;
    component.availableRecords = count;
    component.ngOnInit();

    // subscribe to available page count, setter can be checked several times
    component.availablePagesCount$.subscribe(
      (res) => (availablePageCount = res),
    );

    expect(availablePageCount).toBe(expectedAvailablePageCount);

    // use setter a 2nd time
    component.pageSize = 10;
    const newAvailablePageCount: number = Math.ceil(count / 10);
    expect(availablePageCount).toBe(newAvailablePageCount);
  });
});
