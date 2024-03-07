import { TestBed } from '@angular/core/testing';
import { LoadingStatus, StatusEntry } from './loading-state.interfaces';
import { LoadingStateService } from './loading-state.service';
import { cold } from 'jasmine-marbles';

describe('LoadingStateService', () => {
  let service: LoadingStateService;

  const mockStatusEntryList: StatusEntry[] = [
    {
      status: LoadingStatus.LOADED,
      endpoint: 'mock.de',
      colName: 'mock',
    },
    {
      status: LoadingStatus.LOADING,
      endpoint: 'mock.de',
      colName: 'mock',
    },
  ];

  beforeEach(() => {
    service = TestBed.inject(LoadingStateService);
  });

  describe('createEndpointLoadingList()', () => {
    it('should create list', () => {
      service.createEndpointLoadingList(mockStatusEntryList);

      const expected = cold('b', {
        b: mockStatusEntryList,
      });
      expect((service as any)._endpointLoadingList$).toBeObservable(expected);
      expect((service as any)._endpointLoadingList).toEqual(
        mockStatusEntryList,
      );
    });
  });

  describe('resetEndpointLoadingList()', () => {
    it('should reset list', () => {
      (service as any)._endpointLoadingList = mockStatusEntryList;
      (service as any)._endpointLoadingList$.next(mockStatusEntryList);
      expect((service as any)._endpointLoadingList).toEqual(
        mockStatusEntryList,
      );
      expect((service as any)._endpointLoadingList$).toBeObservable(
        cold('a', {
          a: mockStatusEntryList,
        }),
      );

      service.resetEndpointLoadingList();

      const expected = cold('a', {
        a: [],
      });
      expect((service as any)._endpointLoadingList$).toBeObservable(expected);
      expect((service as any)._endpointLoadingList).toEqual([]);
    });
  });

  describe('changeElementStatus()', () => {
    beforeEach(() => {
      (service as any)._endpointLoadingList = mockStatusEntryList;
      (service as any)._endpointLoadingList$.next(mockStatusEntryList);
    });

    it('should change an element that is found', () => {
      const changeElm: StatusEntry = {
        status: LoadingStatus.ERRONEOUS,
        endpoint: mockStatusEntryList[0].endpoint,
        colName: mockStatusEntryList[0].colName,
      };

      service.changeElementStatus(changeElm);

      const expected = cold('a', {
        a: [changeElm, mockStatusEntryList[1]],
      });
      expect((service as any)._endpointLoadingList$).toBeObservable(expected);
      expect((service as any)._endpointLoadingList).toEqual([
        changeElm,
        mockStatusEntryList[1],
      ]);
    });

    it('should not change anything if element is not found', () => {
      const changeElm: StatusEntry = {
        status: LoadingStatus.ERRONEOUS,
        endpoint: 'hello.de',
        colName: mockStatusEntryList[0].colName,
      };

      service.changeElementStatus(changeElm);

      const expected = cold('a', {
        a: mockStatusEntryList,
      });
      expect((service as any)._endpointLoadingList$).toBeObservable(expected);
      expect((service as any)._endpointLoadingList).toEqual(
        mockStatusEntryList,
      );
    });
  });

  describe('areAllEndpointsLoaded()', () => {
    it('should return correct value', () => {
      (service as any)._endpointLoadingList$ = cold('abc', {
        a: [],
        b: [
          {
            status: LoadingStatus.LOADED,
            endpoint: 'mock.de',
            colName: 'mock',
          },
          {
            status: LoadingStatus.LOADING,
            endpoint: 'mock.com',
            colName: 'mock',
          },
        ],
        c: [
          {
            status: LoadingStatus.LOADED,
            endpoint: 'mock.de',
            colName: 'mock',
          },
          {
            status: LoadingStatus.LOADED,
            endpoint: 'mock.com',
            colName: 'mock',
          },
        ],
      });
      const expected = cold('abc', {
        a: false, // returns false cause empty array
        b: false, // returns false cause not all entries are loaded
        c: true, // returns true cause all entries are loaded
      });

      expect(service.areAllEndpointsLoaded()).toBeObservable(expected);
    });
  });
});
