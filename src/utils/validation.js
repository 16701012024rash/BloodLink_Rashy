/**
 * Validation utilities for forms, medical fields, and geolocation
 */

export function isValidEmail(email) {
  if (!email || typeof email !== 'string') return false;
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email.trim());
}

export function isValidIndianPhone(phone) {
  if (!phone || typeof phone !== 'string') return false;
  // Accepts formats: +91 9876543210, 9876543210, 09876543210, +91-98765-43210
  const digitsOnly = phone.replace(/\D/g, '');
  return digitsOnly.length === 10 || (digitsOnly.length === 12 && digitsOnly.startsWith('91'));
}

export function isValidBloodGroup(bg) {
  const valid = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];
  return valid.includes(bg);
}

export function isValidCoordinate(lat, lon) {
  if (lat == null || lon == null) return false;
  const numLat = Number(lat);
  const numLon = Number(lon);
  return (
    !isNaN(numLat) &&
    !isNaN(numLon) &&
    numLat >= -90 &&
    numLat <= 90 &&
    numLon >= -180 &&
    numLon <= 180
  );
}

export function validatePassword(password) {
  if (!password || password.length < 6) {
    return { isValid: false, message: 'Password must be at least 6 characters long' };
  }
  return { isValid: true, message: '' };
}
