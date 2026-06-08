jest.mock('@/services/BannerService', () => ({
  __esModule: true,
  default: {
    getBanners: jest.fn(),
  },
}));

jest.mock('@/services/CategoryService', () => ({
  __esModule: true,
  default: {
    getCategories: jest.fn(),
  },
}));

jest.mock('@/services/ProductService', () => ({
  __esModule: true,
  default: {
    getProducts: jest.fn(),
  },
}));

import BannerService from '@/services/BannerService';
import CategoryService from '@/services/CategoryService';
import ProductService from '@/services/ProductService';
import { bannerGenerator, categoryGenerator, productGenerator } from '@/test/data-generators';

import { getStaticProps } from '../../pages/index';

describe('home page getStaticProps', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('returns banners, categories, and products when all services succeed', async () => {
    const banners = [bannerGenerator()];
    const categories = [categoryGenerator()];
    const products = [productGenerator(), productGenerator()];

    (BannerService.getBanners as jest.Mock).mockResolvedValueOnce(banners);
    (CategoryService.getCategories as jest.Mock).mockResolvedValueOnce(categories);
    (ProductService.getProducts as jest.Mock).mockResolvedValueOnce(products);

    await expect(getStaticProps()).resolves.toEqual({
      props: {
        banners,
        categories,
        products,
      },
      revalidate: 60,
    });
  });

  test('falls back to empty arrays when a service fails', async () => {
    const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => undefined);

    (BannerService.getBanners as jest.Mock).mockRejectedValueOnce(new Error('Banners unavailable'));

    await expect(getStaticProps()).resolves.toEqual({
      props: {
        banners: [],
        categories: [],
        products: [],
      },
      revalidate: 60,
    });

    expect(consoleSpy).toHaveBeenCalled();
    consoleSpy.mockRestore();
  });
});
