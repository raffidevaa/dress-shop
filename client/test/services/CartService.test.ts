import apiClient from '@/lib/apiClient';
import CartService from '@/services/CartService';
import { cartItemGenerator } from '@/test/data-generators';

jest.mock('@/lib/apiClient', () => ({
  __esModule: true,
  default: {
    get: jest.fn(),
    post: jest.fn(),
    put: jest.fn(),
    delete: jest.fn(),
  },
}));

const mockApiClient = apiClient as jest.Mocked<typeof apiClient>;

describe('CartService', () => {
  beforeEach(() => {
    jest.spyOn(console, 'error').mockImplementation(() => {});
    jest.clearAllMocks();
  });

  afterEach(() => {
    (console.error as jest.Mock).mockRestore();
  });

  describe('getCart', () => {
    test('getCart returns cart data on success', async () => {
      const cart = { items: [cartItemGenerator()], total: 100 };
      mockApiClient.get.mockResolvedValueOnce({ data: { data: cart } });

      const result = await CartService.getCart();
      expect(result).toEqual(cart);
      expect(mockApiClient.get).toHaveBeenCalledWith('api/cart');
    });

    test('getCart throws error on failure', async () => {
      mockApiClient.get.mockRejectedValueOnce({ response: { status: 500 } });
      await expect(CartService.getCart()).rejects.toThrow('Server Error: 500');
    });
  });

  describe('addCartItem', () => {
    test('addCartItem returns added item on success', async () => {
      const cartItem = cartItemGenerator();
      mockApiClient.post.mockResolvedValueOnce({ data: { data: cartItem } });

      const result = await CartService.addCartItem('prod_1', 2);
      expect(result).toEqual(cartItem);
      expect(mockApiClient.post).toHaveBeenCalledWith('api/cart', { quantity: 2, productId: 'prod_1' });
    });

    test('addCartItem throws error on failure', async () => {
      mockApiClient.post.mockRejectedValueOnce({ response: { status: 400 } });
      await expect(CartService.addCartItem('p', 1)).rejects.toThrow('Server Error: 400');
    });
  });

  describe('removeCartItem', () => {
    test('removeCartItem succeeds on success', async () => {
      mockApiClient.delete.mockResolvedValueOnce({ data: { success: true } });
      await expect(CartService.removeCartItem('prod_1')).resolves.toBeDefined();
      expect(mockApiClient.delete).toHaveBeenCalledWith('api/cart', { data: { productId: 'prod_1' } });
    });

    test('removeCartItem throws error on failure', async () => {
      mockApiClient.delete.mockRejectedValueOnce({ response: { status: 404 } });
      await expect(CartService.removeCartItem('p')).rejects.toThrow('Server Error: 404');
    });
  });

  describe('updateQuantityCarItem', () => {
    test('updateQuantityCarItem succeeds on success', async () => {
      mockApiClient.put.mockResolvedValueOnce({ data: { success: true } });
      await expect(CartService.updateQuantityCarItem('prod_1', 5)).resolves.toBeDefined();
      expect(mockApiClient.put).toHaveBeenCalledWith('api/cart', { productId: 'prod_1', quantity: 5 });
    });

    test('updateQuantityCarItem throws error on failure', async () => {
      mockApiClient.put.mockRejectedValueOnce({ response: { status: 400 } });
      await expect(CartService.updateQuantityCarItem('p', 1)).rejects.toThrow('Server Error: 400');
    });
  });
});
