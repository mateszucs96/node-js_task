import { SUPPORTED_COUNTRIES } from './config';
import { shortenPublicHoliday, validateInput } from './helpers';
import { PublicHoliday, PublicHolidayShort } from './types';

describe('validateYear', () => {
  const currentYear = new Date().getFullYear();
  const invalidYear = 2000;
  const supportedCountry = SUPPORTED_COUNTRIES[0];
  const unsupportedCountry = 'AA';

  it('should return true for a valid year and supported country', () => {
    const example = { year: currentYear, country: supportedCountry };
    expect(validateInput(example)).toBeTruthy();
  });

  it('should throw an error if the year is not the current year', () => {
    const example = { year: invalidYear, country: supportedCountry };
    expect(() => validateInput(example)).toThrow(/Year provided not the current/);
  });

  it('should throw an error if the country is not supported', () => {
    const example = { year: currentYear, country: unsupportedCountry };
    expect(() => validateInput(example)).toThrow(/Country provided is not supported/);
  });
});

describe('shortenPublicHoliday', () => {
  it('should return a shortened holiday object', () => {
    const holiday: PublicHoliday = {
      date: '2025-12-25',
      name: 'Christmas Day',
      localName: 'Weihnachtstag',
      countryCode: 'DE',
      fixed: true,
      global: true,
      counties: ['HU', 'FR'],
      launchYear: 2015,
      types: ['hello', 'world'],
    };

    const expectedOutput: PublicHolidayShort = {
      name: 'Christmas Day',
      localName: 'Weihnachtstag',
      date: '2025-12-25',
    };

    expect(shortenPublicHoliday(holiday)).toEqual(expectedOutput);
  });
});
