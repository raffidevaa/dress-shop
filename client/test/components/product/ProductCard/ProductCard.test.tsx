import ProductCard from '@/components/product/ProductCard';
import { productGenerator } from '@/test/data-generators';
import { render, screen } from '@/test/test-utils';
import formatPrice from '@/utils/formatPrice';

test('renders all the product information correctly', () => {
  const fakeProduct = productGenerator();
  render(<ProductCard product={fakeProduct} />);

  const productName = screen.getByText(fakeProduct.name);
  const productPrice = screen.getByText(formatPrice(fakeProduct.price));

  expect(productName).toBeInTheDocument();
  expect(productPrice).toBeInTheDocument();
});
