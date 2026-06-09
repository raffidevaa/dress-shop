import 'dotenv/config';
import { Product } from '../src/models/Product';
import { Category } from '../src/models/Category';
import { Banner } from '../src/models/Banner';
import { connectDb } from '../src/database';

const u = (id: string) =>
  `https://images.unsplash.com/photo-${id}?w=800&h=800&fit=crop&auto=format&q=80`;

const seedBanners = [
  {
    name: "Women's Collection",
    imageURL: `https://images.unsplash.com/photo-1483985988355-763728e1935b?w=1200&h=600&fit=crop&auto=format&q=80`,
    description: "Explore our latest women's fashion collection.",
  },
  {
    name: "Men's Collection",
    imageURL: `https://images.unsplash.com/photo-1469334031218-e382a71b716b?w=1200&h=600&fit=crop&auto=format&q=80`,
    description: "Discover timeless styles in our men's collection.",
  },
];

const seedCategories = [
  {
    name: 'women',
    imageURL: u('1529139574466-a303027c1d8b'),
  },
  {
    name: 'men',
    imageURL: u('1519085360753-af0119f7cbe7'),
  },
];

const seedProducts = [
  // Women
  {
    name: 'Elegant Summer Dress',
    price: 49.99,
    imageURL: u('1515886657613-9f3515b0c78f'),
    category: 'women',
    description: 'A beautiful and airy summer dress perfect for warm days.',
  },
  {
    name: 'Floral Wrap Blouse',
    price: 34.99,
    imageURL: u('1523381210434-271e8be1f52b'),
    category: 'women',
    description: 'A lightweight floral blouse with a flattering wrap silhouette.',
  },
  {
    name: 'High-Waist Midi Skirt',
    price: 42.99,
    imageURL: u('1509631179647-0177331693ae'),
    category: 'women',
    description: 'A chic midi skirt with a high-waist cut for an elongated look.',
  },
  {
    name: 'Casual Linen Top',
    price: 27.99,
    imageURL: u('1487222477894-8943e31ef7b2'),
    category: 'women',
    description: 'Breathable linen top ideal for casual outings.',
  },
  {
    name: 'Knit Cardigan',
    price: 55.99,
    imageURL: u('1539109136881-3be0616acf4b'),
    category: 'women',
    description: 'Cozy oversized knit cardigan for cooler evenings.',
  },
  {
    name: 'Slim Fit Trousers',
    price: 44.99,
    imageURL: u('1485230895905-ec40ba36b9bc'),
    category: 'women',
    description: 'Tailored slim-fit trousers suitable for work and evenings out.',
  },
  // Men
  {
    name: 'Formal White Shirt',
    price: 59.99,
    imageURL: u('1598033129183-c4f50c736f10'),
    category: 'men',
    description: 'A crisp formal white shirt for office or special events.',
  },
  {
    name: 'Casual Blue Jeans',
    price: 39.99,
    imageURL: u('1542272604-787c3835535d'),
    category: 'men',
    description: 'Comfortable straight-cut blue jeans for everyday wear.',
  },
  {
    name: 'Classic Leather Jacket',
    price: 119.99,
    imageURL: u('1507003211169-0a1dd7228f2d'),
    category: 'men',
    description: 'A timeless leather jacket that elevates any outfit.',
  },
  {
    name: 'Cotton Polo Shirt',
    price: 32.99,
    imageURL: u('1517841905240-472988babdf9'),
    category: 'men',
    description: 'Premium cotton polo shirt for a smart-casual look.',
  },
  {
    name: 'Slim Chino Pants',
    price: 47.99,
    imageURL: u('1552374196-c4e7ffc6e126'),
    category: 'men',
    description: 'Versatile slim-fit chino pants that go from desk to dinner.',
  },
  {
    name: 'Bomber Jacket',
    price: 89.99,
    imageURL: u('1551028719-00167b16eac5'),
    category: 'men',
    description: 'Lightweight bomber jacket with a modern street-style edge.',
  },
];

const seed = async () => {
  try {
    await connectDb();
    console.log('Database connected');

    await Banner.deleteMany({});
    await Category.deleteMany({});
    await Product.deleteMany({});
    console.log('Old data cleared');

    await Banner.insertMany(seedBanners);
    console.log('Banners seeded successfully');

    await Category.insertMany(seedCategories);
    console.log('Categories seeded successfully');

    await Product.insertMany(seedProducts);
    console.log('Products seeded successfully');

    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
};

seed();
