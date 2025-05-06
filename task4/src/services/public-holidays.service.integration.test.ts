import { SUPPORTED_COUNTRIES } from '../config';
import { checkIfTodayIsPublicHoliday, getListOfPublicHolidays, getNextPublicHolidays } from './public-holidays.service';

describe('getListOfPublicHolidays', () => {
  const currentYear = new Date().getFullYear();
  it('should return list of public holidays', () => {
    const listOfPublicHolidays = getListOfPublicHolidays(currentYear, SUPPORTED_COUNTRIES[2]);

    expect(listOfPublicHolidays).not.toEqual(undefined);
  });

  it('a', async () => {
    const country = await checkIfTodayIsPublicHoliday(SUPPORTED_COUNTRIES[0]);
    expect(typeof country).toBe('boolean');
  });

  it('b', async () => {
    const result = await getNextPublicHolidays(SUPPORTED_COUNTRIES[0]);

    expect(Array.isArray(result)).toBe(true);
    expect(result.length).toBeGreaterThan(0);
  });

  it('should return an empty array for an invalid country code', async () => {
    const result = await getNextPublicHolidays('ZZ');
    expect(result).toEqual([]);
  });
});
