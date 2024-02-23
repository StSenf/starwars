import { ComponentFixture, TestBed } from '@angular/core/testing';
import { LibPaginationComponent } from './pagination.component';

describe('SwPaginationComponent', () => {
  let component: LibPaginationComponent;
  let fixture: ComponentFixture<LibPaginationComponent>;

  beforeEach(() => {
    fixture = TestBed.createComponent(LibPaginationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should get correct available page count', () => {
    let availablePageCount: number;

    const count = 82;
    const pageSize = 5;
    const expectedAvailablePageCount: number = Math.ceil(count / pageSize);

    component.currentPage = 1;
    component.currentPageSize = pageSize;
    component.availableRecords = count;
    component.ngOnInit();

    // subscribe to available page count, setter can be checked several times
    component.availablePagesCount$.subscribe(
      (res) => (availablePageCount = res),
    );

    expect(availablePageCount).toBe(expectedAvailablePageCount);

    // use setter a 2nd time
    component.currentPageSize = 10;
    const newAvailablePageCount: number = Math.ceil(count / 10);
    expect(availablePageCount).toBe(newAvailablePageCount);
  });
});
