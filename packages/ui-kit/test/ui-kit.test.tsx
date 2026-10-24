import { act, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Button, Modal, ToastProvider, useToast } from '../src';

describe('Button', () => {
  it('defaults to a secondary, type=button button', () => {
    render(<Button>Save</Button>);
    const button = screen.getByRole('button', { name: 'Save' });
    expect(button).toHaveAttribute('type', 'button');
    expect(button.className).toContain('secondary');
  });

  it('takes a kind', () => {
    render(<Button kind="danger">Delete</Button>);
    expect(screen.getByRole('button', { name: 'Delete' }).className).toContain('danger');
  });
});

describe('Modal', () => {
  it('renders nothing when closed', () => {
    render(
      <Modal open={false} onClose={() => {}} title="Edit">
        body
      </Modal>,
    );
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });

  it('is named by its title and closes on Escape', async () => {
    const onClose = vi.fn();
    render(
      <Modal open onClose={onClose} title="Edit task">
        <input aria-label="Title" />
      </Modal>,
    );
    expect(screen.getByRole('dialog', { name: 'Edit task' })).toBeInTheDocument();
    expect(screen.getByLabelText('Title')).toHaveFocus();
    await userEvent.keyboard('{Escape}');
    expect(onClose).toHaveBeenCalled();
  });
});

describe('useToast', () => {
  it('shows a message in the live region', async () => {
    vi.useFakeTimers();
    function Saver() {
      const toast = useToast();
      return <button onClick={() => toast('Saved')}>go</button>;
    }
    render(
      <ToastProvider>
        <Saver />
      </ToastProvider>,
    );
    act(() => screen.getByRole('button', { name: 'go' }).click());
    expect(screen.getByRole('status')).toHaveTextContent('Saved');
    act(() => vi.advanceTimersByTime(4000));
    expect(screen.getByRole('status')).toHaveTextContent('');
    vi.useRealTimers();
  });
});
