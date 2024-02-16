import { Observable, of } from 'rxjs';
import { StatusEntry } from '../model/loading-state.interfaces';

export class MockLoadingStateService {
  createEndpointLoadingList(list: StatusEntry[]) {}
  changeElementStatus() {}
  isEndpointListEmpty(): Observable<boolean> {
    return of(true);
  }
  areAllEndpointsLoaded(): Observable<boolean> {
    return of(false);
  }
  resetEndpointLoadingList() {}
}
