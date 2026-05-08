import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import TripCard from './TripCard';
import type { Trip } from '../types';

const mockNavigate = vi.fn();
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return { ...actual, useNavigate: () => mockNavigate };
});

const baseTrip: Trip = {
  _id: 'trip-1',
  driver: { _id: 'd1', name: 'Ali Khan', phone: '03001234567', avg_rating: 4.5, review_count: 10 },
  origin: 'Islamabad',
  destination: 'Lahore',
  departure_time: new Date('2026-08-01T08:00:00').toISOString(),
  seats_total: 4,
  seats_available: 2,
  fare: 1500,
  status: 'scheduled',
  createdAt: new Date().toISOString(),
};

function renderCard(trip: Trip = baseTrip) {
  return render(
    <MemoryRouter>
      <TripCard trip={trip} />
    </MemoryRouter>,
  );
}

describe('TripCard', () => {
  it('renders origin and destination', () => {
    renderCard();
    expect(screen.getByText(/Islamabad.*Lahore/)).toBeInTheDocument();
  });

  it('renders seats availability', () => {
    renderCard();
    expect(screen.getByText('2/4 seats')).toBeInTheDocument();
  });

  it('renders fare in PKR', () => {
    renderCard();
    expect(screen.getByText('PKR 1,500')).toBeInTheDocument();
  });

  it('renders scheduled status badge', () => {
    renderCard();
    expect(screen.getByText('scheduled')).toBeInTheDocument();
  });

  it('renders cancelled status badge for cancelled trip', () => {
    renderCard({ ...baseTrip, status: 'cancelled' });
    expect(screen.getByText('cancelled')).toBeInTheDocument();
  });

  it('navigates to trip detail on click', async () => {
    renderCard();
    await userEvent.click(screen.getByText(/Islamabad.*Lahore/));
    expect(mockNavigate).toHaveBeenCalledWith('/trips/trip-1');
  });

  it('shows star rating when driver has rating', () => {
    renderCard();
    expect(screen.getByLabelText(/Rating: 4.5 out of 5/)).toBeInTheDocument();
  });

  it('does not show star rating when avg_rating is 0', () => {
    renderCard({ ...baseTrip, driver: { ...baseTrip.driver, avg_rating: 0 } });
    expect(screen.queryByLabelText(/Rating:/)).not.toBeInTheDocument();
  });
});
