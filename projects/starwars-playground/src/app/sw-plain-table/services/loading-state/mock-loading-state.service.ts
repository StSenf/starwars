import { Observable, of } from 'rxjs';
import { StatusEntry } from './loading-state.interfaces';

export class MockLoadingStateService {
  createEndpointLoadingList(list: StatusEntry[]) {}
  resetEndpointLoadingList() {}
  changeElementStatus() {}
  areAllEndpointsLoaded(): Observable<boolean> {
    return of(false);
  }
}
