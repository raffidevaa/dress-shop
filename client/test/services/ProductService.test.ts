import apiClient from '@/lib/apiClient';
import ProductService, { getProduct } from '@/services/ProductService';
import { productGenerator } from '@/test/data-generators';

jest.mock('@/lib/apiClient', () => ({
  __esModule: true,
  default: {
    get: jest.fn(),
  },
}));

const mockApiClient = apiClient as jest.Mocked<typeof apiClient>;

describe('ProductService', () => {
  beforeEach(() => {
    jest.spyOn(console, 'error').mockImplementation(() => {});
    jest.clearAllMocks();
  });

  afterEach(() => {
    (console.error as jest.Mock).mockRestore();
  });

  describe('getProducts', () => {
    test('getProducts returns products on success', async () => {
      const products = [productGenerator()];
      mockApiClient.get.mockResolvedValueOnce({ data: { data: { products } } });

      const result = await ProductService.getProducts({ page: 1, limit: 10 });
      expect(result).toEqual(products);
      expect(mockApiClient.get).toHaveBeenCalledWith('/api/products', {
        params: { page: 1, limit: 10 },
      });
    });

    test('getProducts throws error on failure', async () => {
      mockApiClient.get.mockRejectedValueOnce({ response: { status: 500 } });
      await expect(ProductService.getProducts()).rejects.toThrow('Server Error: 500');
    });
  });

  describe('getProduct', () => {
    test('getProduct returns product and related products on success', async () => {
      const product = productGenerator();
      const relatedProducts = [productGenerator()];
      mockApiClient.get.mockResolvedValueOnce({ data: { data: { product, relatedProducts } } });

      const result = await getProduct('p_1');
      expect(result).toEqual({ product, relatedProducts });
      expect(mockApiClient.get).toHaveBeenCalledWith('/api/products/p_1');
    });

    test('getProduct throws error on failure', async () => {
      mockApiClient.get.mockRejectedValueOnce({
        response: { status: 404, data: { message: 'Product not found' } },
      });
      await expect(getProduct('p_1')).rejects.toThrow('Product not found');
    });
  });
});
