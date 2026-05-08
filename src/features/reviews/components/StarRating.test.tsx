import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import StarRating from './StarRating';

describe('StarRating', () => {
  it('renders correct aria-label for given value', () => {
    render(<StarRating value={3} />);
    expect(screen.getByLabelText('Rating: 3 out of 5')).toBeInTheDocument();
  });

  it('renders custom max stars', () => {
    render(<StarRating value={2} max={3} />);
    expect(screen.getByLabelText('Rating: 2 out of 3')).toBeInTheDocument();
  });

  it('does not respond to clicks in non-interactive mode', async () => {
    const onChange = vi.fn();
    render(<StarRating value={3} onChange={onChange} />);
    const stars = document.querySelectorAll('span > span');
    await userEvent.click(stars[0]);
    expect(onChange).not.toHaveBeenCalled();
  });

  it('calls onChange when interactive and a star is clicked', async () => {
    const onChange = vi.fn();
    render(<StarRating value={2} interactive onChange={onChange} />);
    const stars = screen.getAllByRole('group')[0].querySelectorAll('span');
    await userEvent.click(stars[4]); // 5th star
    expect(onChange).toHaveBeenCalledWith(5);
  });

  it('renders filled stars for the given value', () => {
    render(<StarRating value={4} />);
    const wrapper = screen.getByLabelText('Rating: 4 out of 5');
    const stars = Array.from(wrapper.querySelectorAll('span')).map((s) => s.textContent);
    expect(stars.filter((s) => s === '★')).toHaveLength(4);
    expect(stars.filter((s) => s === '☆')).toHaveLength(1);
  });
});
