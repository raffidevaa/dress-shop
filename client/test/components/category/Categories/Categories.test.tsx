import Categories from '@/components/category/Categories/Categories';
import { categoryGenerator } from '@/test/data-generators';
import { render, screen } from '@/test/test-utils';

test('renders list of categories', () => {
  const fakeCategories = [categoryGenerator(), categoryGenerator()];
  render(<Categories categories={fakeCategories} />);

  fakeCategories.forEach((category) => {
    expect(screen.getByText(category.name)).toBeInTheDocument();
    expect(screen.getByAltText(category.name)).toBeInTheDocument();
    expect(screen.getByAltText(category.name)).toBeInTheDocument();
  });
});
