import apiClient from '@/lib/apiClient';
import CategoryService from '@/services/CategoryService';
import { categoryGenerator } from '@/test/data-generators';

jest.mock('@/lib/apiClient', () => ({
  __esModule: true,
  default: {
    get: jest.fn(),
  },
}));

const mockApiClient = apiClient as jest.Mocked<typeof apiClient>;

describe('CategoryService', () => {
  beforeEach(() => {
    jest.spyOn(console, 'error').mockImplementation(() => {});
    jest.clearAllMocks();
  });

  afterEach(() => {
    (console.error as jest.Mock).mockRestore();
  });

  describe('getCategories', () => {
    test('getCategories returns categories on success', async () => {
      const categories = [categoryGenerator()];
      mockApiClient.get.mockResolvedValueOnce({ data: { data: categories } });

      const result = await CategoryService.getCategories();
      expect(result).toEqual(categories);
      expect(mockApiClient.get).toHaveBeenCalledWith('/api/categories');
    });

    test('getCategories throws error on failure', async () => {
      mockApiClient.get.mockRejectedValueOnce({ response: { status: 500 } });
      await expect(CategoryService.getCategories()).rejects.toThrow('Server Error: 500');
    });
  });
});
