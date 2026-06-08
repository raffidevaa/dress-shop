const mockInitGA = jest.fn();
const mockLogPageView = jest.fn();

jest.mock('@/utils/analytics', () => ({
  initGA: () => mockInitGA(),
  logPageView: () => mockLogPageView(),
}));

jest.mock('@/components/core/Header', () => {
  return function MockHeader() {
    return <header data-testid="header" />;
  };
});

jest.mock('@/components/core/Footer', () => {
  return function MockFooter() {
    return <footer data-testid="footer" />;
  };
});

jest.mock('next/router', () => ({
  events: {
    on: jest.fn(),
  },
}));

import Layout from '@/components/core/Layout';
import { render, screen, waitFor } from '@/test/test-utils';

describe('<Layout />', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (window as any).GA_INITIALIZED = undefined;
  });

  test('renders header, footer, title, and invokes analytics on mount', async () => {
    render(
      <Layout title="Custom Title">
        <div>content</div>
      </Layout>
    );

    expect(screen.getByTestId('header')).toBeInTheDocument();
    expect(screen.getByTestId('footer')).toBeInTheDocument();
    expect(screen.getByText('content')).toBeInTheDocument();

    await waitFor(() => expect(mockInitGA).toHaveBeenCalled());
    await waitFor(() => expect(mockLogPageView).toHaveBeenCalled());
    await waitFor(() => {
      expect(document.title).toBe('Custom Title');
      expect(document.head.querySelector('title')?.textContent).toBe('Custom Title');
    });
  });
});
