import { Request, Response } from 'express';
import { RecentlyViewed } from '../models';
import { User as UserTypes } from '../types';

export const getRecentlyViewed = async (req: Request, res: Response) => {
  try {
    const user = req.user as UserTypes;
    const recentlyViewed = await RecentlyViewed.find({ user: user._id })
      .sort({ viewedAt: -1 })
      .limit(4)
      .populate('product');

    res.status(200).json({
      status: 'success',
      data: {
        recentlyViewed: recentlyViewed.map((rv) => rv.product),
      },
    });
  } catch {
    res.status(500).json({ message: 'Error in getting recently viewed products' });
  }
};

export const addRecentlyViewed = async (req: Request, res: Response) => {
  try {
    const user = req.user as UserTypes;
    const { productId } = req.body;

    if (!productId) {
      return res.status(400).json({ message: 'Product ID is required' });
    }

    // Upsert the record to update viewedAt
    await RecentlyViewed.findOneAndUpdate(
      { user: user._id, product: productId },
      { viewedAt: new Date() },
      { upsert: true, new: true }
    );

    // Keep only the latest 4
    const allRecent = await RecentlyViewed.find({ user: user._id }).sort({ viewedAt: -1 });

    if (allRecent.length > 4) {
      const idsToDelete = allRecent.slice(4).map((rv) => rv._id);
      await RecentlyViewed.deleteMany({ _id: { $in: idsToDelete } });
    }

    res.status(200).json({ status: 'success', message: 'Recently viewed product updated' });
  } catch {
    res.status(500).json({ message: 'Error in updating recently viewed products' });
  }
};
