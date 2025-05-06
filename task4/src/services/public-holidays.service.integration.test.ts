import { SUPPORTED_COUNTRIES } from '../config';
import { checkIfTodayIsPublicHoliday, getListOfPublicHolidays, getNextPublicHolidays } from './public-holidays.service';

describe('Integration', () => {
  const currentYear = new Date().getFullYear();
  const validCountry = SUPPORTED_COUNTRIES[0];

  describe('getListOfPublicHolidays', () => {
    it('should return a non-empty list of public holidays', async () => {
      const holidays = await getListOfPublicHolidays(currentYear, validCountry);
      expect(Array.isArray(holidays)).toBe(true);
      expect(holidays.length).toBeGreaterThan(0);
      holidays.forEach((holiday) => {
        expect(holiday).toHaveProperty('name');
        expect(holiday).toHaveProperty('localName');
        expect(holiday).toHaveProperty('date');
      });
    });
  });

  describe('checkIfTodayIsPublicHoliday', () => {
    it('should return a boolean', async () => {
      const result = await checkIfTodayIsPublicHoliday(validCountry);
      expect(typeof result).toBe('boolean');
    });
  });

  describe('getNextPublicHolidays', () => {
    it('should return a non-empty list of upcoming holidays', async () => {
      const holidays = await getNextPublicHolidays(validCountry);
      expect(Array.isArray(holidays)).toBe(true);
      expect(holidays.length).toBeGreaterThan(0);
      holidays.forEach((holiday) => {
        expect(holiday).toHaveProperty('name');
        expect(holiday).toHaveProperty('localName');
        expect(holiday).toHaveProperty('date');
      });
    });
  });
});
