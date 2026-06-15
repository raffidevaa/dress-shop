import apiClient from '@/lib/apiClient';
import { Product } from '@/types';

const LOCAL_STORAGE_KEY = 'recently_viewed_products';
const LIMIT = 4;

const getLocalRecentlyViewed = (): Product[] => {
  if (typeof window === 'undefined') return [];
  const stored = localStorage.getItem(LOCAL_STORAGE_KEY);
  return stored ? JSON.parse(stored) : [];
};

const setLocalRecentlyViewed = (products: Product[]) => {
  if (typeof window === 'undefined') return;
  localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(products.slice(0, LIMIT)));
};

const addToRecentlyViewed = async (product: Product, isLoggedIn: boolean): Promise<void> => {
  // Update local storage first (for immediate feedback and guests)
  const localProducts = getLocalRecentlyViewed();
  const filtered = localProducts.filter((p) => p._id !== product._id);
  const updated = [product, ...filtered].slice(0, LIMIT);
  setLocalRecentlyViewed(updated);

  if (isLoggedIn) {
    try {
      await apiClient.post('/api/recently-viewed', { productId: product._id });
    } catch (error) {
      console.error('Error adding to recently viewed API:', error);
    }
  }
};

const getRecentlyViewed = async (isLoggedIn: boolean): Promise<Product[]> => {
  if (isLoggedIn) {
    try {
      const { data } = await apiClient.get('/api/recently-viewed');
      const apiProducts = data.data.recentlyViewed;
      // Sync local with API if API is empty but local has items?
      // Requirement says "Sync data across devices when the user logs in"
      return apiProducts;
    } catch (error) {
      console.error('Error getting recently viewed API:', error);
      return getLocalRecentlyViewed();
    }
  }
  return getLocalRecentlyViewed();
};

const syncRecentlyViewed = async (): Promise<void> => {
  const localProducts = getLocalRecentlyViewed();
  if (localProducts.length === 0) return;

  try {
    // Sync each product to the backend.
    // In a real app, we might want a bulk endpoint, but here we can just loop or skip for now.
    // The requirement says "Sync data across devices when the user logs in".
    for (const product of localProducts.reverse()) {
      // Reverse to maintain order when adding
      await apiClient.post('/api/recently-viewed', { productId: product._id });
    }
    // Optionally clear local storage after sync?
    // Or keep it as a cache. I'll keep it.
  } catch (error) {
    console.error('Error syncing recently viewed:', error);
  }
};

const RecentlyViewedService = {
  addToRecentlyViewed,
  getRecentlyViewed,
  syncRecentlyViewed,
};

export default RecentlyViewedService;
