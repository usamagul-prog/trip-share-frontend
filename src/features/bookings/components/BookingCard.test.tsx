import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import BookingCard from './BookingCard';
import type { BookingWithTrip } from '@/features/trips/types';

vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return { ...actual, useNavigate: () => vi.fn() };
});

const futureDate = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString();

const baseBooking: BookingWithTrip = {
  _id: 'b1',
  trip: {
    _id: 't1',
    origin: 'Karachi',
    destination: 'Hyderabad',
    departure_time: futureDate,
    fare: 800,
    driver: { name: 'Ahmed' },
  },
  pickup_point: 'Saddar',
  status: 'pending',
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
};

function renderCard(booking: BookingWithTrip = baseBooking, onCancel?: () => void) {
  return render(
    <MemoryRouter>
      <BookingCard booking={booking} onCancel={onCancel} />
    </MemoryRouter>,
  );
}

function getCancelButton() {
  // The Card also has role="button", filter to the actual <button> element
  return screen.getAllByRole('button').find((el) => el.tagName === 'BUTTON' && /cancel booking/i.test(el.textContent ?? ''));
}

describe('BookingCard', () => {
  it('renders origin and destination', () => {
    renderCard();
    expect(screen.getByText(/Karachi.*Hyderabad/)).toBeInTheDocument();
  });

  it('renders fare', () => {
    renderCard();
    expect(screen.getByText('PKR 800')).toBeInTheDocument();
  });

  it('renders pickup point', () => {
    renderCard();
    expect(screen.getByText(/Pickup: Saddar/)).toBeInTheDocument();
  });

  it('renders status badge', () => {
    renderCard();
    expect(screen.getByText('pending')).toBeInTheDocument();
  });

  it('shows Cancel button for upcoming pending bookings', () => {
    const onCancel = vi.fn();
    renderCard(baseBooking, onCancel);
    expect(getCancelButton()).toBeDefined();
  });

  it('calls onCancel when Cancel is clicked', async () => {
    const onCancel = vi.fn();
    renderCard(baseBooking, onCancel);
    const cancelBtn = getCancelButton();
    expect(cancelBtn).toBeDefined();
    await userEvent.click(cancelBtn!);
    expect(onCancel).toHaveBeenCalledOnce();
  });

  it('does not show Cancel button for completed bookings', () => {
    renderCard({ ...baseBooking, status: 'completed' });
    expect(getCancelButton()).toBeUndefined();
  });

  it('shows Leave Review button for completed bookings', () => {
    renderCard({ ...baseBooking, status: 'completed' });
    const reviewBtn = screen.getAllByRole('button').find(
      (el) => el.tagName === 'BUTTON' && /leave review/i.test(el.textContent ?? ''),
    );
    expect(reviewBtn).toBeDefined();
  });

  it('does not show Cancel when trip is in the past', () => {
    const pastDate = new Date(Date.now() - 1000).toISOString();
    renderCard({ ...baseBooking, trip: { ...baseBooking.trip, departure_time: pastDate } });
    expect(getCancelButton()).toBeUndefined();
  });
});
