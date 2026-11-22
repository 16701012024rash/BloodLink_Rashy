/**
 * Geolocation & Haversine Distance Calculation Utilities
 */

const EARTH_RADIUS_KM = 6371;

/**
 * Calculates straight-line distance in kilometers between two GPS coordinates
 * using the Haversine formula.
 */
export function calculateDistanceKm(lat1, lon1, lat2, lon2) {
  if (lat1 == null || lon1 == null || lat2 == null || lon2 == null) {
    return null;
  }

  const dLat = toRadians(lat2 - lat1);
  const dLon = toRadians(lon2 - lon1);

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRadians(lat1)) *
      Math.cos(toRadians(lat2)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distance = EARTH_RADIUS_KM * c;

  return Math.round(distance * 10) / 10; // Round to 1 decimal place
}

function toRadians(degrees) {
  return (degrees * Math.PI) / 180;
}

/**
 * Formats distance with unit for UI display
 */
export function formatDistance(distanceKm) {
  if (distanceKm == null) return 'Distance unavailable';
  if (distanceKm < 1) return `${Math.round(distanceKm * 1000)} m away`;
  return `${distanceKm.toFixed(1)} km away`;
}

/**
 * Estimates urban transit travel time based on distance (assumes 30 km/h average)
 */
export function estimateTravelTimeMinutes(distanceKm, averageSpeedKmh = 30) {
  if (distanceKm == null) return null;
  const hours = distanceKm / averageSpeedKmh;
  const minutes = Math.ceil(hours * 60);
  return Math.max(minutes, 5); // Minimum 5 mins
}

/**
 * Known coordinate center points for major Indian cities (for fallback when geolocation is denied)
 */
export const CITY_COORDINATES = {
  'New Delhi': { lat: 28.6139, lon: 77.2090 },
  'Delhi NCR': { lat: 28.5355, lon: 77.3910 },
  'Mumbai': { lat: 19.0760, lon: 72.8777 },
  'Bangalore': { lat: 12.9716, lon: 77.5946 },
  'Hyderabad': { lat: 17.3850, lon: 78.4867 },
  'Chennai': { lat: 13.0827, lon: 80.2707 },
  'Kolkata': { lat: 22.5726, lon: 88.3639 },
  'Pune': { lat: 18.5204, lon: 73.8567 },
  'Ahmedabad': { lat: 23.0225, lon: 72.5714 },
  'Jaipur': { lat: 26.9124, lon: 75.7873 },
  'Lucknow': { lat: 26.8467, lon: 80.9462 },
  'Chandigarh': { lat: 30.7333, lon: 76.7794 }
};

/**
 * Masks phone number for privacy preservation until consent/acceptance
 * Example: "+91 98765 43210" -> "+91 98765 •••••"
 */
export function maskPhoneNumber(phone) {
  if (!phone) return '••••••••••';
  const clean = phone.trim();
  if (clean.length <= 5) return '••••••';
  return clean.substring(0, clean.length - 5) + '•••••';
}
