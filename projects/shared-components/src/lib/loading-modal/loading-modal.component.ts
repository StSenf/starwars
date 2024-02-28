import { Component } from '@angular/core';

/**
 * Note: This component ist designed to be used with NgbModal.
 * See: https://ng-bootstrap.github.io/#/components/modal/api
 *
 * Usage example:
 * ...
 * private _modalReference: NgbModalRef;
 * ...
 *
 * constructor(
 *     private _router: Router,
 *     private _modalService: NgbModal,
 * ) {}
 *
 * ngOnInit(): void {
 *  this._router.events
 *    .subscribe((rEv) => {
 *       if (rEv instanceof NavigationStart) {
 *         this._modalReference = this._modalService.open(LibLoadingModalComponent);
 *       }
 *       if (rEv instanceof NavigationEnd) {
 *         this._modalReference.close();
 *       }
 *    });
 * }
 */
@Component({
  standalone: true,
  selector: 'lib-loading-modal',
  template: `
    <div class="py-5 d-flex justify-content-center">
      <strong class="me-4">Loading content...</strong>
      <div
        class="spinner-border ml-auto"
        role="status"
        aria-hidden="true"
      ></div>
    </div>
  `,
})
export class LibLoadingModalComponent {}
