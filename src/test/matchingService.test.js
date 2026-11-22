import { describe, it, expect } from 'vitest';
import { matchingService } from '../services/matchingService';

describe('Real-Time Donor Matching Engine', () => {
  const sampleDonors = [
    {
      id: 'd-1',
      name: 'Amit Kumar',
      bloodGroup: 'O+',
      latitude: 28.6139,
      longitude: 77.2090,
      isAvailable: true,
      isVerified: true,
      lastDonated: 'First Time Donor',
      age: 28,
      weight: 68
    },
    {
      id: 'd-2',
      name: 'Priya Sharma',
      bloodGroup: 'A+',
      latitude: 28.5672,
      longitude: 77.2100, // ~5 km away
      isAvailable: true,
      isVerified: true,
      lastDonated: 'First Time Donor',
      age: 26,
      weight: 55
    },
    {
      id: 'd-3',
      name: 'Vikram Singh',
      bloodGroup: 'O-',
      latitude: 28.5273,
      longitude: 77.2144, // ~9 km away
      isAvailable: true,
      isVerified: true,
      lastDonated: 'First Time Donor',
      age: 32,
      weight: 75
    },
    {
      id: 'd-4',
      name: 'Inactive Donor',
      bloodGroup: 'A+',
      latitude: 28.6139,
      longitude: 77.2090,
      isAvailable: false, // Inactive
      isVerified: true,
      lastDonated: 'First Time Donor'
    },
    {
      id: 'd-5',
      name: 'Far Away Donor',
      bloodGroup: 'A+',
      latitude: 19.0760, // Mumbai (1100 km away)
      longitude: 72.8777,
      isAvailable: true,
      isVerified: true,
      lastDonated: 'First Time Donor'
    }
  ];

  it('matches only compatible donors for A+ patient within 25 km', () => {
    const request = {
      bloodGroup: 'A+',
      componentType: 'Whole Blood',
      latitude: 28.6139,
      longitude: 77.2090,
      hospitalName: 'AIIMS New Delhi'
    };

    const matches = matchingService.findMatches({
      request,
      donors: sampleDonors,
      maxRadiusKm: 25,
      requireAvailable: true
    });

    // Should match Amit (O+), Priya (A+), and Vikram (O-)
    // Should NOT match Inactive Donor (unavailable) or Far Away Donor (>25km)
    expect(matches.length).toBe(3);
    const donorIds = matches.map(m => m.donorId);
    expect(donorIds).toContain('d-1');
    expect(donorIds).toContain('d-2');
    expect(donorIds).toContain('d-3');
    expect(donorIds).not.toContain('d-4');
    expect(donorIds).not.toContain('d-5');
  });

  it('sorts matched donors by distance in ascending order', () => {
    const request = {
      bloodGroup: 'A+',
      componentType: 'Whole Blood',
      latitude: 28.6139,
      longitude: 77.2090
    };

    const matches = matchingService.findMatches({
      request,
      donors: sampleDonors,
      maxRadiusKm: 50
    });

    expect(matches[0].distanceKm).toBeLessThanOrEqual(matches[1].distanceKm);
    expect(matches[1].distanceKm).toBeLessThanOrEqual(matches[2].distanceKm);
  });

  it('strictly restricts O- patient to O- donors only', () => {
    const request = {
      bloodGroup: 'O-',
      componentType: 'Whole Blood',
      latitude: 28.6139,
      longitude: 77.2090
    };

    const matches = matchingService.findMatches({
      request,
      donors: sampleDonors,
      maxRadiusKm: 50
    });

    expect(matches.length).toBe(1);
    expect(matches[0].donorId).toBe('d-3'); // Vikram Singh (O-)
  });
});
