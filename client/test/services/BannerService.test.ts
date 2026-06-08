import apiClient from '@/lib/apiClient';
import BannerService from '@/services/BannerService';
import { bannerGenerator } from '@/test/data-generators';

jest.mock('@/lib/apiClient', () => ({
  __esModule: true,
  default: {
    get: jest.fn(),
  },
}));

const mockApiClient = apiClient as jest.Mocked<typeof apiClient>;

describe('BannerService', () => {
  beforeEach(() => {
    jest.spyOn(console, 'error').mockImplementation(() => {});
    jest.clearAllMocks();
  });

  afterEach(() => {
    (console.error as jest.Mock).mockRestore();
  });

  describe('getBanners', () => {
    test('getBanners returns banner data on success', async () => {
      const banners = [bannerGenerator(), bannerGenerator()];
      mockApiClient.get.mockResolvedValueOnce({ data: { data: banners } });

      const result = await BannerService.getBanners();
      expect(result).toEqual(banners);
      expect(mockApiClient.get).toHaveBeenCalledWith('/api/banners');
    });

    test('getBanners throws error on failure', async () => {
      mockApiClient.get.mockRejectedValueOnce({
        response: { data: { message: 'Could not load banners' } },
      });
      await expect(BannerService.getBanners()).rejects.toThrow('Could not load banners');
    });
  });
});
