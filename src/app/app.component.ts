import { Component, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { LibLoadingModalComponent } from 'shared-components';
import { ShowcaseEndpointDisplayValueComponent } from './showcases/showcase-endpoint-display-value.component';
import { ShowcaseLitPaginationComponent } from './showcases/showcase-lit-pagination.component';
import { ShowcasePaginationComponent } from './showcases/showcase-pagination.component';
import { ShowcaseToggleComponent } from './showcases/showcase-toggle.component';

@Component({
  selector: 'app-root',
  standalone: true,
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  imports: [
    ShowcasePaginationComponent,
    ShowcaseEndpointDisplayValueComponent,
    ShowcaseToggleComponent,
    ShowcaseLitPaginationComponent,
  ],
})
export class AppComponent {
  constructor(private _modalService: NgbModal) {}

  openModal(): void {
    this._modalService.open(LibLoadingModalComponent);
  }

  editUser(event: Event) {
    const user = (event as CustomEvent).detail;
    console.log('Edit user', user);
  }
}
