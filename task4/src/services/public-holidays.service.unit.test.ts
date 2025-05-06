import axios from 'axios';
import { PublicHoliday } from '../types';
import * as service from './public-holidays.service';
import * as helpers from '../helpers';

jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

jest.mock('../helpers', () => ({
  ...jest.requireActual('../helpers'),
  validateInput: jest.fn(),
}));

describe('public-holidays.service', () => {
  const mockHoliday: PublicHoliday = {
    date: '2025-01-01',
    localName: 'New Year’s Day',
    name: 'New Year’s Day',
    countryCode: 'US',
    fixed: true,
    global: true,
    counties: null,
    launchYear: 1967,
    types: ['Public'],
  };

  const shortHoliday = {
    name: 'New Year’s Day',
    localName: 'New Year’s Day',
    date: '2025-01-01',
  };

  beforeEach(() => {
    jest.clearAllMocks();
    jest.spyOn(helpers, 'shortenPublicHoliday').mockImplementation(() => shortHoliday);
  });

  describe('getListOfPublicHolidays', () => {
    it('should return shortened holidays when API succeeds', async () => {
      mockedAxios.get.mockResolvedValueOnce({ data: [mockHoliday] });

      const result = await service.getListOfPublicHolidays(2025, 'US');
      expect(helpers.validateInput).toHaveBeenCalledWith({ year: 2025, country: 'US' });
      expect(result).toEqual([shortHoliday]);
    });

    it('should return empty array when API fails', async () => {
      mockedAxios.get.mockRejectedValueOnce(new Error('API failed'));

      const result = await service.getListOfPublicHolidays(2025, 'US');
      expect(result).toEqual([]);
    });
  });

  describe('checkIfTodayIsPublicHoliday', () => {
    it('should return true when status is 200', async () => {
      mockedAxios.get.mockResolvedValueOnce({ status: 200 });

      const result = await service.checkIfTodayIsPublicHoliday('US');
      expect(helpers.validateInput).toHaveBeenCalledWith({ country: 'US' });
      expect(result).toBe(true);
    });

    it('should return false when API fails', async () => {
      mockedAxios.get.mockRejectedValueOnce(new Error('API error'));
      const result = await service.checkIfTodayIsPublicHoliday('US');
      expect(result).toBe(false);
    });
  });

  describe('getNextPublicHolidays', () => {
    it('should return shortened holidays when API succeeds', async () => {
      mockedAxios.get.mockResolvedValueOnce({ data: [mockHoliday] });

      const result = await service.getNextPublicHolidays('US');
      expect(result).toEqual([shortHoliday]);
    });

    it('should return empty array when API fails', async () => {
      mockedAxios.get.mockRejectedValueOnce(new Error('Error'));
      const result = await service.getNextPublicHolidays('US');
      expect(result).toEqual([]);
    });
  });
});
