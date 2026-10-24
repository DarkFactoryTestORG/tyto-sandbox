import type { Task } from '@plotline/shared';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { TaskCard } from './TaskCard';

const task: Task = {
  id: 't1',
  projectId: 'p1',
  title: 'Write the launch plan',
  description: '',
  status: 'open',
  assignee: { id: 'u1', name: 'Olivia Owner', avatarUrl: null },
  dueDate: null,
  labels: [{ id: 'l1', name: 'bug', color: '#d93f0b' }],
  createdAt: '2026-10-01T09:00:00.000Z',
  updatedAt: '2026-10-01T09:00:00.000Z',
  completedAt: null,
};

describe('TaskCard', () => {
  it('shows the title, labels and the assignee', () => {
    render(<TaskCard task={task} onOpen={() => {}} />);
    expect(screen.getByRole('button', { name: 'Write the launch plan' })).toBeInTheDocument();
    expect(screen.getByRole('list', { name: 'Labels' })).toHaveTextContent('bug');
    expect(screen.getByTitle('Olivia Owner')).toHaveTextContent('OO');
  });

  it('opens the task', async () => {
    const onOpen = vi.fn();
    render(<TaskCard task={task} onOpen={onOpen} />);
    await userEvent.click(screen.getByRole('button', { name: 'Write the launch plan' }));
    expect(onOpen).toHaveBeenCalledWith(task);
  });
});
