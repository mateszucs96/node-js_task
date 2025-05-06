// eslint-disable-next-line import/no-extraneous-dependencies
import request from 'supertest';
import { PUBLIC_HOLIDAYS_API_URL, SUPPORTED_COUNTRIES } from '../config';

describe('E2E Tests', () => {
  const year = new Date().getFullYear();
  const validCountry = SUPPORTED_COUNTRIES[0];
  const invalidCountry = 'ZZ';
  const invalidYear = 'A@A@';

  describe('GET /PublicHolidays/:year/:country', () => {
    it('should return 200 and list of public holidays', async () => {
      const res = await request(PUBLIC_HOLIDAYS_API_URL).get(`/PublicHolidays/${year}/${validCountry}`);
      expect(res.status).toBe(200);
      expect(Array.isArray(res.body)).toBe(true);
    });

    it('should return 400 for invalid year format', async () => {
      const res = await request(PUBLIC_HOLIDAYS_API_URL).get(`/PublicHolidays/${invalidYear}/${validCountry}`);
      expect(res.status).toBe(400);
    });

    it('should return 404 for unknown country code', async () => {
      const res = await request(PUBLIC_HOLIDAYS_API_URL).get(`/PublicHolidays/${year}/${invalidCountry}`);
      expect(res.status).toBe(404);
    });
  });

  describe('GET /NextPublicHolidays/:country', () => {
    it('should return 200 and upcoming holidays', async () => {
      const res = await request(PUBLIC_HOLIDAYS_API_URL).get(`/NextPublicHolidays/${validCountry}`);
      expect(res.status).toBe(200);
      expect(Array.isArray(res.body)).toBe(true);
    });
  });
});
