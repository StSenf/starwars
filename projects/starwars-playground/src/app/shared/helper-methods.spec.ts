import {
  replaceUrlListWithResourceNames,
  replaceUrlWithResourceName,
  searchFirstSortableColumn,
} from './helper-methods';
import { SwDotTechResource, SwSpecies } from './interfaces';
import { STANDARD_SORT_DIRECTION } from './plain-table-constants';
import { SwTableConfig } from './plain-table.interfaces';

describe('HelperMethods', () => {
  describe('searchFirstSortableColumn()', () => {
    it('should return empty object if no tableConfig provided', () => {
      expect(searchFirstSortableColumn({} as SwTableConfig)).toEqual({});
    });

    it('should return empty object if no columnConfig provided', () => {
      const noColConfig: SwTableConfig = {
        dotTechEndpoint: 'www.dot.com',
        searchPhrase: 'Dotty',
      } as SwTableConfig;

      expect(searchFirstSortableColumn(noColConfig)).toEqual({});
    });

    it('should return empty object if no searchable column provided', () => {
      const noSearchableCol: SwTableConfig = {
        dotTechEndpoint: 'www.dot.com',
        searchPhrase: 'Dotty',
        columnConfig: [
          {
            columnDisplayProperty: 'name',
            columnTitle: 'Planet',
          },
          {
            columnDisplayProperty: 'diameter',
            columnTitle: 'Diameter (in kilometers)',
          },
        ],
      } as SwTableConfig;

      expect(searchFirstSortableColumn(noSearchableCol)).toEqual({});
    });

    it('should return first searchable column', () => {
      const noSearchableCol: SwTableConfig = {
        dotTechEndpoint: 'www.dot.com',
        searchPhrase: 'Dotty',
        columnConfig: [
          {
            columnDisplayProperty: 'name',
            columnTitle: 'Planet',
          },
          {
            columnDisplayProperty: 'diameter',
            columnTitle: 'Diameter (in kilometers)',
            isSortable: true,
          },
          {
            columnDisplayProperty: 'climate',
            columnTitle: 'Climate',
            isSortable: true,
          },
        ],
      } as SwTableConfig;

      expect(searchFirstSortableColumn(noSearchableCol)).toEqual({
        colName: 'diameter',
        direction: STANDARD_SORT_DIRECTION,
      });
    });
  });

  describe('replaceUrlWithResourceName()', () => {
    const species: SwSpecies = {
      name: 'Mockarade',
      homeworld: 'www.dot.com/planet/2',
    } as SwSpecies;

    const allPlanetsWithMatchingUrl = [
      { uid: '1', name: 'Planet Janet', url: 'www.dot.com/planet/janet' },
      { uid: '2', name: 'Planet 2', url: species.homeworld },
    ];

    it('should return the correct name if equal url found', () => {
      expect(
        replaceUrlWithResourceName(
          species,
          'homeworld',
          allPlanetsWithMatchingUrl,
        ),
      ).toBe('Planet 2');
    });

    it('should return "no data provided" if no equal url found', () => {
      const allPlanetsNoMatchingUrl = [
        { uid: '1', name: 'Planet A', url: 'www.dot.com/planet/a' },
        { uid: '13', name: 'Planet B', url: 'www.dot.com/planet/b' },
      ];

      expect(
        replaceUrlWithResourceName(
          species,
          'homeworld',
          allPlanetsNoMatchingUrl,
        ),
      ).toBe('no data provided');
    });

    it('should return "no data provided" if empty resource list provided', () => {
      expect(replaceUrlWithResourceName(species, 'homeworld', [])).toBe(
        'no data provided',
      );
    });

    it('should return "no data provided" if no entity provided', () => {
      expect(
        replaceUrlWithResourceName(
          {} as SwSpecies,
          'homeworld',
          allPlanetsWithMatchingUrl,
        ),
      ).toBe('no data provided');
    });

    it('should return "no data provided" if entity property wrong', () => {
      expect(
        replaceUrlWithResourceName(
          species,
          'classification',
          allPlanetsWithMatchingUrl,
        ),
      ).toBe('no data provided');
    });
  });

  describe('replaceUrlListWithResourceNames()', () => {
    const speciesWithPpl: SwSpecies = {
      name: 'Mockarade',
      people: ['www.dot.com/people/1', 'www.dot.com/people/2'],
    } as SwSpecies;
    const allPeopleWithMatchingUrls: SwDotTechResource[] = [
      { uid: '1', name: 'Person 1', url: speciesWithPpl.people[0] },
      { uid: '2', name: 'Person 2', url: speciesWithPpl.people[1] },
      { uid: '3', name: 'Person 3', url: 'www.dot.com/people/3' },
    ];

    it('should return correct name list', () => {
      expect(
        replaceUrlListWithResourceNames(
          speciesWithPpl,
          'people',
          allPeopleWithMatchingUrls,
        ),
      ).toEqual(['Person 1', 'Person 2']);
    });

    it('should return "no data provided" in case no equal url found', () => {
      const allPeopleWithUnMatchingUrls = [
        { uid: '1', name: 'Person 1', url: 'www.dot.com/people/11' },
        { uid: '2', name: 'Person 2', url: speciesWithPpl.people[1] },
        { uid: '3', name: 'Person 3', url: 'www.dot.com/people/3' },
      ];

      expect(
        replaceUrlListWithResourceNames(
          speciesWithPpl,
          'people',
          allPeopleWithUnMatchingUrls,
        ),
      ).toEqual(['no data provided', 'Person 2']);
    });

    it('should return "no data provided" if empty resource list provided', () => {
      expect(
        replaceUrlListWithResourceNames(speciesWithPpl, 'people', []),
      ).toEqual(['no data provided', 'no data provided']);
    });

    it('should return undefined if no entity provided', () => {
      expect(
        replaceUrlListWithResourceNames(
          {} as SwSpecies,
          'people',
          allPeopleWithMatchingUrls,
        ),
      ).toBe(undefined);
    });

    it('should return undefined if entity property wrong', () => {
      expect(
        replaceUrlListWithResourceNames(
          speciesWithPpl,
          'homeworld',
          allPeopleWithMatchingUrls,
        ),
      ).toBe(undefined);
    });
  });
});
