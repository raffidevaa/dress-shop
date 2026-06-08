import apiClient from '@/lib/apiClient';
import WishlistService from '@/services/WishlistService';
import { productGenerator } from '@/test/data-generators';

jest.mock('@/lib/apiClient', () => ({
  __esModule: true,
  default: {
    get: jest.fn(),
    post: jest.fn(),
    delete: jest.fn(),
  },
}));

const mockApiClient = apiClient as jest.Mocked<typeof apiClient>;

describe('WishlistService', () => {
  beforeEach(() => {
    jest.spyOn(console, 'error').mockImplementation(() => {});
    jest.clearAllMocks();
  });

  afterEach(() => {
    (console.error as jest.Mock).mockRestore();
  });

  describe('getWishlist', () => {
    test('getWishlist returns wishlist items on success', async () => {
      const mockWishlist = [
        { _id: 'wish_1', product: productGenerator() },
        { _id: 'wish_2', product: productGenerator() },
      ];
      mockApiClient.get.mockResolvedValueOnce({ data: { data: mockWishlist } });

      const result = await WishlistService.getWishlist();
      expect(result).toEqual(mockWishlist);
      expect(mockApiClient.get).toHaveBeenCalledWith('api/wishlist');
    });

    test('getWishlist throws error on failure', async () => {
      mockApiClient.get.mockRejectedValueOnce({ response: { status: 500 } });

      await expect(WishlistService.getWishlist()).rejects.toThrow('Server Error: 500');
    });
  });

  describe('addWishlistItem', () => {
    test('addWishlistItem returns added item on success', async () => {
      const mockItem = { _id: 'wish_1', product: productGenerator() };
      mockApiClient.post.mockResolvedValueOnce({ data: { data: mockItem } });

      const result = await WishlistService.addWishlistItem('prod_123');
      expect(result).toEqual(mockItem);
      expect(mockApiClient.post).toHaveBeenCalledWith('api/wishlist', { productId: 'prod_123' });
    });

    test('addWishlistItem throws error on failure', async () => {
      mockApiClient.post.mockRejectedValueOnce({ response: { status: 400, data: { message: 'Already in wishlist' } } });

      await expect(WishlistService.addWishlistItem('prod_123')).rejects.toThrow('Already in wishlist');
    });
  });

  describe('removeWishlistItem', () => {
    test('removeWishlistItem succeeds on success', async () => {
      mockApiClient.delete.mockResolvedValueOnce({ data: { success: true } });

      await expect(WishlistService.removeWishlistItem('prod_123')).resolves.toBeDefined();
      expect(mockApiClient.delete).toHaveBeenCalledWith('api/wishlist', { data: { productId: 'prod_123' } });
    });

    test('removeWishlistItem throws error on failure', async () => {
      mockApiClient.delete.mockRejectedValueOnce({ response: { status: 404, data: { message: 'Not found' } } });

      await expect(WishlistService.removeWishlistItem('prod_123')).rejects.toThrow('Not found');
    });
  });
});
