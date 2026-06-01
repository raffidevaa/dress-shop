import 'dotenv/config';
import { Product } from '../src/models/Product';
import { connectDb } from '../src/database';

const seedProducts = [
  {
    name: 'Elegant Summer Dress',
    price: 49.99,
    imageURL: 'https://images.unsplash.com/photo-1572804013309-59a88b7e92f1',
    category: 'Dresses',
    description: 'A beautiful and airy summer dress.',
  },
  {
    name: 'Casual Blue Jeans',
    price: 39.99,
    imageURL: 'https://images.unsplash.com/photo-1542272604-787c3835535d',
    category: 'Pants',
    description: 'Comfortable casual blue jeans for daily wear.',
  },
  {
    name: 'Formal White Shirt',
    price: 59.99,
    imageURL: 'https://images.unsplash.com/photo-1598033129183-c4f50c736f10',
    category: 'Shirts',
    description: 'A crisp formal white shirt for office or events.',
  },
];

const seed = async () => {
  try {
    await connectDb();
    console.log('Database connected');

    await Product.deleteMany({});
    console.log('Old products deleted');

    await Product.insertMany(seedProducts);
    console.log('Products seeded successfully');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
};

seed();
