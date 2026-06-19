import { Schema, model, Document, Types } from 'mongoose';

const { ObjectId } = Schema.Types;

export interface RecentlyViewedDocument extends Document {
  user: Types.ObjectId;
  product: Types.ObjectId;
  viewedAt: Date;
}

const RecentlyViewedSchema = new Schema(
  {
    user: {
      type: ObjectId,
      ref: 'User',
      required: true,
    },
    product: {
      type: ObjectId,
      ref: 'Product',
      required: true,
    },
    viewedAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

// Ensure one record per user-product pair
RecentlyViewedSchema.index({ user: 1, product: 1 }, { unique: true });

export const RecentlyViewed = model<RecentlyViewedDocument>('RecentlyViewed', RecentlyViewedSchema);
