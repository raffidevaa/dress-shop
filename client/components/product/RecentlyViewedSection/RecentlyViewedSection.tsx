import React, { useEffect, useState } from 'react';

import { Heading } from '@/components/ui';
import useUser from '@/hooks/user/useUser';
import RecentlyViewedService from '@/services/RecentlyViewedService';
import { Product } from '@/types';

import ProductCard from '../ProductCard';

import styles from './RecentlyViewedSection.module.css';

const RecentlyViewedSection = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const { data: currentUser } = useUser();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRecentlyViewed = async () => {
      try {
        const data = await RecentlyViewedService.getRecentlyViewed(!!currentUser);
        setProducts(data);
      } catch (error) {
        console.error('Failed to fetch recently viewed products', error);
      } finally {
        setLoading(false);
      }
    };

    fetchRecentlyViewed();
  }, [currentUser]);

  if (loading) return null;
  if (products.length === 0) return null;

  return (
    <div className={styles.container}>
      <Heading>Recently Viewed Products</Heading>
      <div className={styles.scrollContainer}>
        {products.map((product) => (
          <div className={styles.cardWrapper} key={product._id}>
            <ProductCard product={product} />
          </div>
        ))}
      </div>
    </div>
  );
};

export default RecentlyViewedSection;
