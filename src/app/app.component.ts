import { Component } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { LibLoadingModalComponent } from '@shared-components';
import { ShowcaseEndpointDisplayValueComponent } from './showcases/showcase-endpoint-display-value.component';
import { ShowcasePaginationComponent } from './showcases/showcase-pagination.component';
import { ShowcaseToggleComponent } from './showcases/showcase-toggle.component';

@Component({
  selector: 'app-root',
  standalone: true,
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
  imports: [
    ShowcasePaginationComponent,
    ShowcaseEndpointDisplayValueComponent,
    ShowcaseToggleComponent,
  ],
})
export class AppComponent {
  constructor(private _modalService: NgbModal) {}

  openModal(): void {
    this._modalService.open(LibLoadingModalComponent);
  }
}
