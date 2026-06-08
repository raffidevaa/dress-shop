import React from 'react';

import SearchCategory from '@/components/search/SearchCategory';
import { render, screen, fireEvent } from '@/test/test-utils';

describe('<SearchCategory />', () => {
  test('renders tabs and handles clicks', () => {
    const onChangeTab = jest.fn();
    render(<SearchCategory active="men" onChangeTab={onChangeTab} />);

    const menTab = screen.getByRole('button', { name: 'Men' });
    const womenTab = screen.getByRole('button', { name: 'Women' });

    expect(menTab).toHaveClass('active');
    expect(womenTab).not.toHaveClass('active');

    fireEvent.click(womenTab);
    expect(onChangeTab).toHaveBeenCalledWith('women');
  });
});
