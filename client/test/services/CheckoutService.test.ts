import apiClient from '@/lib/apiClient';
import CheckOutService from '@/services/CheckoutService';

jest.mock('@/lib/apiClient', () => ({
  __esModule: true,
  default: {
    post: jest.fn(),
  },
}));

const mockApiClient = apiClient as jest.Mocked<typeof apiClient>;

describe('CheckOutService', () => {
  beforeEach(() => {
    jest.spyOn(console, 'error').mockImplementation(() => {});
    jest.clearAllMocks();
  });

  afterEach(() => {
    (console.error as jest.Mock).mockRestore();
  });

  describe('stripeCharge', () => {
    test('stripeCharge returns data on success', async () => {
      const mockData = { success: true };
      mockApiClient.post.mockResolvedValueOnce({ data: { data: mockData } });

      const result = await CheckOutService.stripeCharge('pm_123');
      expect(result).toEqual(mockData);
      expect(mockApiClient.post).toHaveBeenCalledWith('api/checkout/create-stripe-charge', {
        paymentMethodId: 'pm_123',
      });
    });

    test('stripeCharge throws error on failure', async () => {
      mockApiClient.post.mockRejectedValueOnce({
        response: { status: 500, data: { message: 'Stripe Error' } },
      });

      await expect(CheckOutService.stripeCharge('pm_123')).rejects.toThrow('Stripe Error');
    });
  });

  describe('createPaypalTransaction', () => {
    test('createPaypalTransaction returns orderID on success', async () => {
      const mockData = { orderID: 'PAYPAL_123' };
      mockApiClient.post.mockResolvedValueOnce({ data: { data: mockData } });

      const result = await CheckOutService.createPaypalTransaction();
      expect(result).toEqual(mockData);
      expect(mockApiClient.post).toHaveBeenCalledWith('api/checkout/create-paypal-transaction');
    });

    test('createPaypalTransaction throws error on failure', async () => {
      mockApiClient.post.mockRejectedValueOnce({
        response: { status: 400, data: { message: 'Paypal Error' } },
      });

      await expect(CheckOutService.createPaypalTransaction()).rejects.toThrow('Paypal Error');
    });
  });

  describe('capturePaypalTransaction', () => {
    test('capturePaypalTransaction succeeds', async () => {
      mockApiClient.post.mockResolvedValueOnce({ data: { success: true } });

      await expect(CheckOutService.capturePaypalTransaction('PAYPAL_123')).resolves.toBeDefined();
      expect(mockApiClient.post).toHaveBeenCalledWith('api/checkout/capture-paypal-transaction', {
        orderID: 'PAYPAL_123',
      });
    });

    test('capturePaypalTransaction throws error on failure', async () => {
      mockApiClient.post.mockRejectedValueOnce({ response: { status: 500 } });

      await expect(CheckOutService.capturePaypalTransaction('PAYPAL_123')).rejects.toThrow(
        'Server Error: 500'
      );
    });
  });
});
