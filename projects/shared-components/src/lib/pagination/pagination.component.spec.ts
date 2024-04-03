import { ComponentFixture, TestBed } from '@angular/core/testing';
import { LibPaginationComponent } from './pagination.component';
import Spy = jasmine.Spy;
import SpyInstance = jest.SpyInstance;

describe('SwPaginationComponent', () => {
  let component: LibPaginationComponent;
  let fixture: ComponentFixture<LibPaginationComponent>;

  beforeEach(() => {
    fixture = TestBed.createComponent(LibPaginationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should get correct available count', () => {
    const count = 82;
    const pageSize = 5;
    const expectedAvailablePageCount: number = Math.ceil(count / pageSize);

    component.currentPage = 1;
    component.currentPageSize = pageSize;
    component.availableRecords = count;
    component.ngOnInit();

    expect(component.availablePagesCount).toBe(expectedAvailablePageCount);

    // use setter a 2nd time
    component.currentPageSize = 10;
    const newAvailablePageCount: number = Math.ceil(count / 10);
    expect(component.availablePagesCount).toBe(newAvailablePageCount);
  });

  it('should return correct pages array', () => {
    let availablePages;

    const count = 1000;
    const pageSize = 10;

    component.currentPage = 1;
    component.currentPageSize = pageSize;
    component.availableRecords = count;
    component.ngOnInit();

    // subscribe to available page count, setter can be checked several times
    component.availablePages$.subscribe((res) => (availablePages = res));
    expect(availablePages).toEqual([1, 2, 3, '...', 99, 100]);

    // use setter again
    component.currentPage = 2;
    expect(availablePages).toEqual([1, 2, 3, 4, '...', 99, 100]);

    // use setter again
    component.currentPage = 7;
    expect(availablePages).toEqual([
      1,
      2,
      '...',
      5,
      6,
      7,
      8,
      9,
      '...',
      99,
      100,
    ]);

    // use setter again
    component.currentPage = 99;
    expect(availablePages).toEqual([1, 2, '...', 97, 98, 99, 100]);
  });

  describe('clicking page element', () => {
    let clickEventSpy: SpyInstance;

    beforeEach(() => {
      clickEventSpy = jest.spyOn(component.clickedPage, 'next');
    });

    afterEach(() => {
      clickEventSpy.mockReset();
      clickEventSpy.mockRestore();
    });

    describe('changePage()', () => {
      it("should not trigger event if clicked on '...'", () => {
        component.changePage('...');
        expect(clickEventSpy).not.toHaveBeenCalled();
      });

      it('should trigger event on page click', () => {
        component.changePage(12);
        expect(clickEventSpy).toHaveBeenCalledWith(12);
      });
    });

    describe('clickPrevious()', () => {
      it('should not trigger event if on last page', () => {
        component.currentPage = 1;
        component.currentPageSize = 10;
        component.availableRecords = 100;
        component.ngOnInit();

        (component as any).clickPrevious();
        expect(clickEventSpy).not.toHaveBeenCalled();
      });

      it('should trigger event', () => {
        component.currentPage = 5;
        component.currentPageSize = 10;
        component.availableRecords = 100;
        component.ngOnInit();

        (component as any).clickPrevious();
        expect(clickEventSpy).toHaveBeenCalled();
      });
    });

    describe('clickNext()', () => {
      it('should not trigger event if on last page', () => {
        component.currentPage = 100 / 10;
        component.currentPageSize = 10;
        component.availableRecords = 100;
        component.ngOnInit();

        (component as any).clickNext();
        expect(clickEventSpy).not.toHaveBeenCalled();
      });

      it('should trigger event', () => {
        component.currentPage = 5;
        component.currentPageSize = 10;
        component.availableRecords = 100;
        component.ngOnInit();

        (component as any).clickNext();
        expect(clickEventSpy).toHaveBeenCalled();
      });
    });
  });
});
