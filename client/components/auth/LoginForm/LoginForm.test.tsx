import Router from 'next/router';
import React from 'react';

import { userGenerator } from '@/test/data-generators';
import { act, render, screen, userEvent, waitFor } from '@/test/test-utils';

import LoginForm from './LoginForm';

jest.mock('next/router', () => ({
  push: jest.fn(),
  useRouter() {
    return {
      query: '',
    };
  },
}));

describe('<LoginForm />', () => {
  test('successfully login user and navigated to profile page', async () => {
    render(<LoginForm />);
    const fields = userGenerator();
    const emailInput = screen.getByPlaceholderText(/email/i);
    const passwordInput = screen.getByPlaceholderText(/password/i);

    await act(async () => {
      userEvent.type(emailInput, fields.email);
      userEvent.type(passwordInput, fields.password);
    });

    const submitButton = screen.getByRole('button', { name: /log in/i });
    await act(async () => {
      userEvent.click(submitButton);
    });

    // Wait for the final observable effect instead of transient disabled states
    await waitFor(() => expect(Router.push).toBeCalledWith('/profile'));
  });

  test('display input fields error when input fields is empty on form submit', async () => {
    render(<LoginForm />);
    const submitButton = screen.getByRole('button', { name: /log in/i });

    await act(async () => {
      userEvent.click(submitButton);
    });
    await waitFor(() => expect(screen.getByText('Email is required')).toBeInTheDocument());

    expect(screen.getByText('Password is required')).toBeInTheDocument();
  });
});
