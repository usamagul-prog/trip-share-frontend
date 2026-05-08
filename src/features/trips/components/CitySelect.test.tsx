import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent, act } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import CitySelect from './CitySelect';

describe('CitySelect', () => {
  it('renders placeholder when no value selected', () => {
    render(<CitySelect value="" onChange={vi.fn()} placeholder="Choose city" />);
    expect(screen.getByPlaceholderText('Choose city')).toBeInTheDocument();
  });

  it('shows dropdown options on focus', async () => {
    render(<CitySelect value="" onChange={vi.fn()} />);
    await userEvent.click(screen.getByRole('textbox'));
    expect(screen.getAllByRole('listitem').length).toBeGreaterThan(0);
  });

  it('filters cities based on typed query', async () => {
    render(<CitySelect value="" onChange={vi.fn()} />);
    const input = screen.getByRole('textbox');
    await userEvent.click(input);
    await userEvent.type(input, 'Isla');
    // After typing, only Islamabad should be in the list
    expect(screen.getByText('Islamabad')).toBeInTheDocument();
    // Cities not matching should not be visible
    expect(screen.queryByText('Lahore')).not.toBeInTheDocument();
  });

  it('calls onChange with selected city on mousedown', async () => {
    const onChange = vi.fn();
    render(<CitySelect value="" onChange={onChange} />);
    await userEvent.click(screen.getByRole('textbox'));
    const karachiOption = screen.getByText('Karachi');
    act(() => { fireEvent.mouseDown(karachiOption); });
    expect(onChange).toHaveBeenCalledWith('Karachi');
  });

  it('closes dropdown after selection', async () => {
    render(<CitySelect value="" onChange={vi.fn()} />);
    await userEvent.click(screen.getByRole('textbox'));
    expect(screen.getAllByRole('listitem').length).toBeGreaterThan(0);
    const item = screen.getAllByRole('listitem')[0];
    act(() => { fireEvent.mouseDown(item); });
    expect(screen.queryAllByRole('listitem')).toHaveLength(0);
  });

  it('is disabled when disabled prop is true', () => {
    render(<CitySelect value="" onChange={vi.fn()} disabled />);
    expect(screen.getByRole('textbox')).toBeDisabled();
  });

  it('calls onChange with empty string when query is cleared after typing', async () => {
    const onChange = vi.fn();
    render(<CitySelect value="" onChange={onChange} />);
    const input = screen.getByRole('textbox');
    await userEvent.click(input);
    await userEvent.type(input, 'L');
    await userEvent.clear(input);
    expect(onChange).toHaveBeenLastCalledWith('');
  });
});
