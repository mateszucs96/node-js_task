import { SUPPORTED_COUNTRIES } from './config';
import { validateInput } from './helpers';

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
