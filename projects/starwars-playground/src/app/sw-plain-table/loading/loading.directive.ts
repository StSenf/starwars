import {
  AfterContentInit,
  ContentChildren,
  Directive,
  ElementRef,
  Input,
  OnDestroy,
  QueryList,
} from '@angular/core';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import {
  combineLatest,
  distinctUntilChanged,
  filter,
  mergeMap,
  Subject,
  takeUntil,
} from 'rxjs';
import { LibLoadingModalComponent } from 'shared-components';
import { LoadingStateService } from '../services/loading-state/loading-state.service';

@Directive({
  standalone: true,
  selector: '[swStableLoading]',
})
export class SwStableLoadingDirective implements AfterContentInit, OnDestroy {
  /** If set to true, the overall API call of the table is completed. */
  @Input() isTableApiCallCompleted: Subject<boolean>;

  /** If set to false, no manipulation to the table cells should be done. */
  @Input() isStableRenderingActive: Subject<boolean>;

  @ContentChildren('swStableLoadingContentCell', { descendants: true })
  contentCells: QueryList<ElementRef>;

  private _onDestroy$: Subject<boolean> = new Subject<boolean>();
  private _modalReference: NgbModalRef;

  constructor(
    private _loadingStateService: LoadingStateService,
    private _modalService: NgbModal,
  ) {}

  // ToDo: after content init führt dazu, dass kurz content geladen und dann ausgeblendet
  // aktuell abgefangen durhc platzierung von ngClass im content child
  ngAfterContentInit(): void {
    // check Service if everything is ready + API call completed + Loading State Active
    // if so: forEach cell.nativeElement.className = 'visible-styling'
    this.isStableRenderingActive
      .pipe(
        filter((isStableRenderingActive) => isStableRenderingActive === true),
        mergeMap(() => {
          return combineLatest([
            this.isTableApiCallCompleted,
            this._loadingStateService.areAllEndpointsLoaded(),
          ]);
        }),
        distinctUntilChanged((a, b) => JSON.stringify(a) === JSON.stringify(b)),
        takeUntil(this._onDestroy$),
      )
      .subscribe(([isTableApiCallCompleted, areAllEndpointsLoaded]) => {
        // ToDo: implementation stopped cause StarWars Api is down
        console.log('bin im change stuffs');
        console.log('isTableApiCallCompleted', isTableApiCallCompleted);
        console.log('areAllEndpointsLoaded', areAllEndpointsLoaded);
        if (
          isTableApiCallCompleted === true &&
          areAllEndpointsLoaded === true
        ) {
          console.log('will die element visible machen');
          if (this._modalReference) {
            this._modalReference.close();
            this._modalReference = undefined;
          }

          this.contentCells.forEach(
            (cell: ElementRef) =>
              (cell.nativeElement.className = 'visible-styling'),
          );
        }

        if (
          isTableApiCallCompleted === true &&
          areAllEndpointsLoaded === false
        ) {
          console.log('will die element unsichtbar machen');
          this._modalReference = this._modalService.open(
            LibLoadingModalComponent,
          );

          // ToDo: das hier wird scheinbar nicht ausgeführt .. nur das im HTML von Plain Table greift, warum?
          this.contentCells.forEach(
            (cell: ElementRef) =>
              (cell.nativeElement.className = 'invisible-styling'),
          );
        }
      });
  }

  ngOnDestroy(): void {
    this._onDestroy$.next(true);
    this._onDestroy$.complete();
  }
}
