import { Component, ElementRef, QueryList, ViewChildren } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Observable, of, Subject } from 'rxjs';
import { LoadingStateService } from '../services/loading-state/loading-state.service';
import { MockLoadingStateService } from '../services/loading-state/mock-loading-state.service';
import { SwStableLoadingDirective } from './loading.directive';

class MockLoadingStateAllEpLoaded {
  areAllEndpointsLoaded(): Observable<boolean> {
    return of(true);
  }
}
@Component({
  standalone: true,
  imports: [SwStableLoadingDirective],
  template: ` <table
    swStableLoading
    [isTableApiCallCompleted]="isApiCallCompleted$"
    [isStableRenderingActive]="isStableTplRenderingActive$"
  >
    <thead>
      <tr>
        <th>Name</th>
        <th>Movies</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td>Luke Skywalker</td>
        <td>
          <div #swStableLoadingContentCell>Film 1, Film 2</div>
        </td>
      </tr>
      <tr>
        <td>R2-D2</td>
        <td>
          <div #swStableLoadingContentCell class="random">Film 3, Film 4</div>
        </td>
      </tr>
    </tbody>
  </table>`,
})
class TestHostComponent {
  isApiCallCompleted$ = new Subject<boolean>();
  isStableTplRenderingActive$ = new Subject<boolean>();

  @ViewChildren('swStableLoadingContentCell')
  cells: QueryList<ElementRef>;
}
describe('SwStableLoadingDirective', () => {
  let testHostComponent: TestHostComponent;
  let fixture: ComponentFixture<TestHostComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        {
          provide: LoadingStateService,
          useValue: new MockLoadingStateService(),
        },
      ],
    });
  });

  /**
   * Method will compile test set up.
   * Attention: You MUST use it in every test case of this file.
   *
   * To use TestBed.overrideProvider() with different values this is necessary.
   * Because the TestBed is frozen after each call of TestBed.compileComponents()
   * TestBed.inject() or TestBed.createComponent().
   */
  const compileTestSetUp = () => {
    fixture = TestBed.createComponent(TestHostComponent);
    testHostComponent = fixture.componentInstance;
    fixture.detectChanges();
  };

  it('should create', () => {
    compileTestSetUp();
    expect(testHostComponent).toBeDefined();
  });

  it(
    'should not include CSS class "invisible-styling"' +
      'if stable rendering active,' +
      'api call not complete,' +
      'all endpoints not loaded yet',
    () => {
      compileTestSetUp();
      testHostComponent.isStableTplRenderingActive$.next(true);
      testHostComponent.isApiCallCompleted$.next(false);

      testHostComponent.cells.forEach((cell) => {
        expect(cell.nativeElement.classes).not.toContain('invisible-styling');
      });
    },
  );

  it(
    'should include CSS class "invisible-styling"' +
      'if stable rendering active,' +
      'api call complete,' +
      'all endpoints not loaded yet',
    () => {
      compileTestSetUp();
      testHostComponent.isStableTplRenderingActive$.next(true);
      testHostComponent.isApiCallCompleted$.next(true);

      testHostComponent.cells.forEach((cell) => {
        expect(cell.nativeElement.className).toBe('invisible-styling');
      });
    },
  );

  it(
    'should include CSS class "visible-styling"' +
      'if stable rendering active,' +
      'api call complete,' +
      'all endpoints are loaded',
    () => {
      TestBed.overrideProvider(LoadingStateService, {
        useValue: new MockLoadingStateAllEpLoaded(),
      });
      compileTestSetUp();

      testHostComponent.isStableTplRenderingActive$.next(true);
      testHostComponent.isApiCallCompleted$.next(true);

      testHostComponent.cells.forEach((cell) => {
        console.log(cell.nativeElement.className);
        expect(cell.nativeElement.className).toBe('visible-styling');
      });
    },
  );
});
