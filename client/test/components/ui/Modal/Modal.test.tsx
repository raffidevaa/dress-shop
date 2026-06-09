import { render, screen, fireEvent } from '@testing-library/react';
import React from 'react';

import Modal from '@/components/ui/Modal';

describe('<Modal />', () => {
  it('renders modal content when visible is true', () => {
    render(
      <Modal title="Test Modal" visible={true} onClose={jest.fn()}>
        <p>Modal body</p>
      </Modal>
    );
    expect(screen.getByText('Test Modal')).toBeInTheDocument();
    expect(screen.getByText('Modal body')).toBeInTheDocument();
  });

  it('renders nothing when visible is false', () => {
    render(
      <Modal title="Hidden Modal" visible={false} onClose={jest.fn()}>
        <p>Hidden body</p>
      </Modal>
    );
    expect(screen.queryByText('Hidden Modal')).not.toBeInTheDocument();
    expect(screen.queryByText('Hidden body')).not.toBeInTheDocument();
  });

  it('calls onClose when the close button is clicked', () => {
    const onClose = jest.fn();
    render(
      <Modal title="Closeable" visible={true} onClose={onClose}>
        <p>Content</p>
      </Modal>
    );
    fireEvent.click(screen.getByRole('button'));
    expect(onClose).toHaveBeenCalledTimes(1);
  });
});
