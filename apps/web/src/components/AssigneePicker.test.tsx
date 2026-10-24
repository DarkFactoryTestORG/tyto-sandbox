import type { Member } from '@plotline/shared';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { AssigneePicker } from './AssigneePicker';

const member = (n: number): Member => ({
  membershipId: `m${n}`,
  role: 'member',
  joinedAt: '2026-01-01T00:00:00.000Z',
  user: { id: `u${n}`, name: `Person ${n}`, avatarUrl: null, email: `p${n}@plotline.test` },
});
const members = [member(1), member(2), member(3)];

describe('AssigneePicker', () => {
  it('shows the current assignee', () => {
    render(<AssigneePicker members={members} value={members[1]!.user} onChange={() => {}} />);
    expect(screen.getByRole('button', { name: 'Assignee' })).toHaveTextContent('Person 2');
  });

  it('lists Unassigned and every member, and picks one by click', async () => {
    const onChange = vi.fn();
    render(<AssigneePicker members={members} value={null} onChange={onChange} />);
    await userEvent.click(screen.getByRole('button', { name: 'Assignee' }));
    const options = screen.getAllByRole('option');
    expect(options).toHaveLength(4);
    expect(options[0]).toHaveTextContent('Unassigned');
    expect(options[3]).toHaveTextContent('Person 3');
    await userEvent.click(screen.getByRole('option', { name: /Person 3/ }));
    expect(onChange).toHaveBeenCalledWith(members[2]!.user);
    expect(screen.queryByRole('listbox')).not.toBeInTheDocument();
  });

  it('picks with the arrow keys and Enter', async () => {
    const onChange = vi.fn();
    render(<AssigneePicker members={members} value={null} onChange={onChange} />);
    await userEvent.click(screen.getByRole('button', { name: 'Assignee' }));
    await userEvent.keyboard('{ArrowDown}{ArrowDown}{Enter}');
    expect(onChange).toHaveBeenCalledWith(members[1]!.user);
  });

  it('closes on Escape without choosing', async () => {
    const onChange = vi.fn();
    render(<AssigneePicker members={members} value={null} onChange={onChange} />);
    await userEvent.click(screen.getByRole('button', { name: 'Assignee' }));
    await userEvent.keyboard('{Escape}');
    expect(screen.queryByRole('listbox')).not.toBeInTheDocument();
    expect(onChange).not.toHaveBeenCalled();
  });
});
