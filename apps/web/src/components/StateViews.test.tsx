import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { EmptyState, ErrorState, Loading, NotFound } from './StateViews';

describe('state views', () => {
  it('loading is a labelled progress indicator', () => {
    render(<Loading label="Loading tasks" />);
    expect(screen.getByRole('progressbar', { name: 'Loading tasks' })).toBeInTheDocument();
  });

  it('empty shows its title', () => {
    render(<EmptyState title="No tasks yet" />);
    expect(screen.getByText('No tasks yet')).toBeInTheDocument();
  });

  it('error is an alert with a retry', async () => {
    const onRetry = vi.fn();
    render(<ErrorState message="boom" onRetry={onRetry} />);
    expect(screen.getByRole('alert')).toHaveTextContent('boom');
    await userEvent.click(screen.getByRole('button', { name: 'Try again' }));
    expect(onRetry).toHaveBeenCalled();
  });

  it('not-found links home', () => {
    render(<NotFound />);
    expect(screen.getByRole('heading', { name: 'Page not found' })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Back to Plotline' })).toHaveAttribute('href', '/');
  });
});
