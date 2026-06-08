import apiClient from '@/lib/apiClient';
import OrderService from '@/services/OrderService';
import { productGenerator } from '@/test/data-generators';

jest.mock('@/lib/apiClient', () => ({
  __esModule: true,
  default: {
    get: jest.fn(),
  },
}));

const mockApiClient = apiClient as jest.Mocked<typeof apiClient>;

describe('OrderService', () => {
  beforeEach(() => {
    jest.spyOn(console, 'error').mockImplementation(() => {});
    jest.clearAllMocks();
  });

  afterEach(() => {
    (console.error as jest.Mock).mockRestore();
  });

  describe('getOrders', () => {
    test('getOrders returns orders on success', async () => {
      const mockOrders = [
        {
          _id: 'order_1',
          total: 100,
          items: [{ quantity: 1, product: productGenerator() }],
          createdAt: new Date(),
        },
      ];
      mockApiClient.get.mockResolvedValueOnce({ data: { data: mockOrders } });

      const result = await OrderService.getOrders();
      expect(result).toEqual(mockOrders);
      expect(mockApiClient.get).toHaveBeenCalledWith('api/orders');
    });

    test('getOrders throws error on failure', async () => {
      mockApiClient.get.mockRejectedValueOnce({ response: { status: 401, data: { message: 'Unauthorized' } } });

      await expect(OrderService.getOrders()).rejects.toThrow('Unauthorized');
    });
  });
});
