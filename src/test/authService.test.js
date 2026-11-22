import { describe, it, expect } from 'vitest';
import { authService } from '../services/authService';
import { isValidEmail, isValidIndianPhone, validatePassword } from '../utils/validation';

describe('Unified Authentication & Secret Admin Access', () => {
  it('validates email addresses properly', () => {
    expect(isValidEmail('test@bloodlink.org')).toBe(true);
    expect(isValidEmail('invalid-email')).toBe(false);
    expect(isValidEmail('')).toBe(false);
    expect(isValidEmail(null)).toBe(false);
  });

  it('validates Indian mobile numbers', () => {
    expect(isValidIndianPhone('+91 98765 43210')).toBe(true);
    expect(isValidIndianPhone('9876543210')).toBe(true);
    expect(isValidIndianPhone('12345')).toBe(false);
  });

  it('validates minimum password length', () => {
    expect(validatePassword('123456').isValid).toBe(true);
    expect(validatePassword('12345').isValid).toBe(false);
  });

  it('creates unified normal user profile on signup', async () => {
    const res = await authService.signUp({
      email: 'maria@example.com',
      password: 'password123',
      fullName: 'Maria Rodriguez',
      phone: '+91 98760 11223',
      city: 'New Delhi',
      isDonor: false
    });

    expect(res.user.email).toBe('maria@example.com');
    expect(res.user.full_name).toBe('Maria Rodriguez');
    expect(res.user.isAdmin).toBe(false);
    expect(res.user.isDonor).toBe(false);
  });

  it('allows normal user to opt-in as donor during registration', async () => {
    const res = await authService.signUp({
      email: 'amit@example.com',
      password: 'password123',
      fullName: 'Amit Kumar',
      phone: '+91 98765 43210',
      city: 'New Delhi',
      isDonor: true,
      bloodGroup: 'O+'
    });

    expect(res.user.isDonor).toBe(true);
    expect(res.user.bloodGroup).toBe('O+');
    expect(res.user.isAdmin).toBe(false);
  });

  it('verifies secret admin key and rejects unauthorized keys', async () => {
    const correctKey = 'BLOODLINK_SECURE_ADMIN_2026_ROOT';
    const wrongKey = 'wrong_random_key_123';

    const isAuthorized = await authService.verifyAdminKey(correctKey);
    const isRejected = await authService.verifyAdminKey(wrongKey);

    expect(isAuthorized).toBe(true);
    expect(isRejected).toBe(false);
  });
});
