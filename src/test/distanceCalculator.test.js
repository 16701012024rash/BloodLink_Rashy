import { describe, it, expect } from 'vitest';
import { 
  calculateDistanceKm, 
  formatDistance, 
  estimateTravelTimeMinutes, 
  maskPhoneNumber,
  CITY_COORDINATES 
} from '../utils/distanceCalculator';

describe('Distance & Geolocation Calculator', () => {
  it('calculates accurate distance between Connaught Place and AIIMS Delhi', () => {
    // Connaught Place: 28.6315, 77.2167
    // AIIMS Delhi: 28.5672, 77.2100
    const distance = calculateDistanceKm(28.6315, 77.2167, 28.5672, 77.2100);
    expect(distance).toBeGreaterThan(6.5);
    expect(distance).toBeLessThan(8.0);
  });

  it('calculates 0 km for identical coordinates', () => {
    const distance = calculateDistanceKm(28.6139, 77.2090, 28.6139, 77.2090);
    expect(distance).toBe(0);
  });

  it('returns null when coordinates are missing or null', () => {
    expect(calculateDistanceKm(null, 77.2090, 28.6139, 77.2090)).toBeNull();
    expect(calculateDistanceKm(28.6139, null, 28.6139, 77.2090)).toBeNull();
  });

  it('formats distance nicely for UI', () => {
    expect(formatDistance(0.4)).toBe('400 m away');
    expect(formatDistance(4.5)).toBe('4.5 km away');
    expect(formatDistance(null)).toBe('Distance unavailable');
  });

  it('estimates realistic urban transit travel time', () => {
    // 15 km at 30 km/h = 30 minutes
    const time = estimateTravelTimeMinutes(15, 30);
    expect(time).toBe(30);
  });

  it('masks phone numbers for privacy protection', () => {
    expect(maskPhoneNumber('+91 98765 43210')).toBe('+91 98765 •••••');
    expect(maskPhoneNumber('9876543210')).toBe('98765•••••');
    expect(maskPhoneNumber(null)).toBe('••••••••••');
  });
});
