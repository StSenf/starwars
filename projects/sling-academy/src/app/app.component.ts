import { NgIf } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import {
  NavigationCancel,
  NavigationEnd,
  NavigationError,
  NavigationStart,
  ResolveEnd,
  ResolveStart,
  Router,
  RouterEvent,
  RouterModule,
} from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { NgbModalRef } from '@ng-bootstrap/ng-bootstrap/modal/modal-ref';
import { LibLoadingModalComponent } from '@shared-components';
import { debounceTime, Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterModule, NgIf],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent implements OnInit, OnDestroy {
  private _onDestroy$ = new Subject<void>();
  private _loadingModalReference: NgbModalRef;

  constructor(
    private _router: Router,
    private _modalService: NgbModal,
  ) {}

  ngOnInit(): void {
    this._router.events
      .pipe(takeUntil(this._onDestroy$), debounceTime(400))
      .subscribe((routerEvent) => {
        this.checkRouterEvent(routerEvent as RouterEvent);
      });
  }

  ngOnDestroy(): void {
    this._onDestroy$.next();
  }

  /**
   * Opens/closes the loading modal.
   * @param routerEvent Current router event
   */
  checkRouterEvent(routerEvent: RouterEvent): void {
    if (
      routerEvent instanceof NavigationStart ||
      routerEvent instanceof ResolveStart
    ) {
      this._loadingModalReference = this._modalService.open(
        LibLoadingModalComponent,
        {
          backdrop: 'static',
        },
      );
    }

    if (
      routerEvent instanceof NavigationEnd ||
      routerEvent instanceof NavigationCancel ||
      routerEvent instanceof NavigationError ||
      routerEvent instanceof ResolveEnd
    ) {
      if (this._loadingModalReference) {
        this._loadingModalReference.close();
      }
    }
  }
}
