import axios from 'axios';
import { PublicHoliday } from '../types';
import * as service from './public-holidays.service';
import * as helpers from '../helpers';

jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;
jest.mock('../helpers', () => ({
  ...jest.requireActual('../helpers'),
  shortenPublicHoliday: jest.fn(),
  validateInput: jest.fn(),
}));

describe('public-holidays.service', () => {
  const mockHoliday: PublicHoliday = {
    date: '2025-01-01',
    localName: 'New Year’s Day',
    name: 'New Year’s Day',
    countryCode: 'GB',
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
    (helpers.shortenPublicHoliday as jest.Mock).mockImplementation(() => shortHoliday);
    (helpers.validateInput as jest.Mock).mockImplementation(() => true);
  });

  describe('getListOfPublicHolidays', () => {
    it('should return shortened holidays when API succeeds', async () => {
      mockedAxios.get.mockResolvedValueOnce({ data: [mockHoliday] });

      const result = await service.getListOfPublicHolidays(2025, 'GB');
      expect(helpers.validateInput).toHaveBeenCalledWith({ year: 2025, country: 'GB' });
      expect(result).toEqual([shortHoliday]);
    });

    it('should return empty array when API fails', async () => {
      mockedAxios.get.mockRejectedValueOnce(new Error('API failed'));

      const result = await service.getListOfPublicHolidays(2025, 'GB');
      expect(result).toEqual([]);
    });
  });

  describe('checkIfTodayIsPublicHoliday', () => {
    it('should return true when status is 200', async () => {
      mockedAxios.get.mockResolvedValueOnce({ status: 200 });

      const result = await service.checkIfTodayIsPublicHoliday('GB');
      expect(helpers.validateInput).toHaveBeenCalledWith({ country: 'GB' });
      expect(result).toBe(true);
    });

    it('should return false when API fails', async () => {
      mockedAxios.get.mockRejectedValueOnce(new Error('API error'));
      const result = await service.checkIfTodayIsPublicHoliday('GB');
      expect(result).toBe(false);
    });
  });

  describe('getNextPublicHolidays', () => {
    it('should return shortened holidays when API succeeds', async () => {
      mockedAxios.get.mockResolvedValueOnce({ data: [mockHoliday] });

      const result = await service.getNextPublicHolidays('GB');
      expect(result).toEqual([shortHoliday]);
    });

    it('should return empty array when API fails', async () => {
      mockedAxios.get.mockRejectedValueOnce(new Error('Error'));
      const result = await service.getNextPublicHolidays('GB');
      expect(result).toEqual([]);
    });
  });
});
