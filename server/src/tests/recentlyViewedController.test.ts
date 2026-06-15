import { Request, Response } from 'express';
import { addRecentlyViewed, getRecentlyViewed } from '../controllers/recentlyViewedController';
import { RecentlyViewed } from '../models';

jest.mock('../models', () => ({
  RecentlyViewed: {
    find: jest.fn(),
    findOneAndUpdate: jest.fn(),
    deleteMany: jest.fn(),
  },
}));

describe('RecentlyViewed Controller', () => {
  let mockRequest: Partial<Request>;
  let mockResponse: Partial<Response>;
  let responseJson: Record<string, any>;

  beforeEach(() => {
    mockRequest = {
      user: { _id: 'user123' } as unknown as any,
      body: { productId: 'prod123' },
    };
    responseJson = {} as Record<string, any>;
    mockResponse = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockImplementation((result) => {
        responseJson = result;
      }),
    };
    jest.clearAllMocks();
  });

  describe('addRecentlyViewed', () => {
    it('should add a recently viewed product and keep only 4', async () => {
      const mockFind = RecentlyViewed.find as jest.Mock;
      const mockFindOneAndUpdate = RecentlyViewed.findOneAndUpdate as jest.Mock;
      const mockDeleteMany = RecentlyViewed.deleteMany as jest.Mock;

      mockFind.mockReturnValue({
        sort: jest.fn().mockResolvedValue([
          { _id: '1' }, { _id: '2' }, { _id: '3' }, { _id: '4' }, { _id: '5' }
        ]),
      });

      await addRecentlyViewed(mockRequest as Request, mockResponse as Response);

      expect(mockFindOneAndUpdate).toHaveBeenCalled();
      expect(mockDeleteMany).toHaveBeenCalledWith({
        _id: { $in: ['5'] }
      });
      expect(mockResponse.status).toHaveBeenCalledWith(200);
      expect(responseJson.status).toBe('success');
    });

    it('should return 400 if productId is missing', async () => {
      mockRequest.body = {};
      await addRecentlyViewed(mockRequest as Request, mockResponse as Response);
      expect(mockResponse.status).toHaveBeenCalledWith(400);
    });
  });

  describe('getRecentlyViewed', () => {
    it('should return 4 most recent products', async () => {
      const mockFind = RecentlyViewed.find as jest.Mock;
      mockFind.mockReturnValue({
        sort: jest.fn().mockReturnThis(),
        limit: jest.fn().mockReturnThis(),
        populate: jest.fn().mockResolvedValue([
          { product: { name: 'P1' } },
          { product: { name: 'P2' } }
        ]),
      });

      await getRecentlyViewed(mockRequest as Request, mockResponse as Response);

      expect(mockResponse.status).toHaveBeenCalledWith(200);
      expect(responseJson.data.recentlyViewed).toHaveLength(2);
    });
  });
});
