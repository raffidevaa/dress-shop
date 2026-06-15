import { render, screen, fireEvent } from '@testing-library/react';
import React from 'react';

import Pagination from '@/components/ui/Pagination';

describe('<Pagination />', () => {
  it('renders the correct number of page items', () => {
    render(<Pagination total={30} limit={10} active={1} onChange={jest.fn()} />);
    const listItems = screen.getAllByRole('listitem');
    expect(listItems.length).toBe(3);
  });

  it('renders the active page as a span, not a button', () => {
    render(<Pagination total={30} limit={10} active={2} onChange={jest.fn()} />);
    expect(screen.getByText('2').tagName).toBe('SPAN');
    expect(screen.queryByRole('button', { name: '2' })).not.toBeInTheDocument();
  });

  it('renders non-active pages as buttons', () => {
    render(<Pagination total={30} limit={10} active={1} onChange={jest.fn()} />);
    expect(screen.getByRole('button', { name: '2' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: '3' })).toBeInTheDocument();
  });

  it('calls onChange with the correct page number when a button is clicked', () => {
    const onChange = jest.fn();
    render(<Pagination total={30} limit={10} active={1} onChange={onChange} />);
    fireEvent.click(screen.getByRole('button', { name: '3' }));
    expect(onChange).toHaveBeenCalledWith(3);
  });

  it('renders a single page with no buttons when total equals limit', () => {
    render(<Pagination total={10} limit={10} active={1} onChange={jest.fn()} />);
    expect(screen.queryAllByRole('button').length).toBe(0);
    expect(screen.getByText('1')).toBeInTheDocument();
  });

  it('rounds up total/limit to determine page count', () => {
    render(<Pagination total={25} limit={10} active={1} onChange={jest.fn()} />);
    const listItems = screen.getAllByRole('listitem');
    expect(listItems.length).toBe(3);
  });
});
