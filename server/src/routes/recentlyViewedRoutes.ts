import { Router } from 'express';
import { getRecentlyViewed, addRecentlyViewed } from '../controllers/recentlyViewedController';
import { protect } from '../middleware';

const router = Router();

router
  .route('/')
  .get(protect, getRecentlyViewed)
  .post(protect, addRecentlyViewed);

export { router as recentlyViewedRoutes };
