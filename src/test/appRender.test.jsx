import React from 'react';
import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import App from '../App';
import { AuthProvider } from '../context/AuthContext';
import { BloodRequestProvider } from '../context/BloodRequestContext';
import { NotificationProvider } from '../context/NotificationContext';

const renderAtRoute = (path) =>
  render(
    <MemoryRouter initialEntries={[path]}>
      <AuthProvider>
        <BloodRequestProvider>
          <NotificationProvider>
            <App />
          </NotificationProvider>
        </BloodRequestProvider>
      </AuthProvider>
    </MemoryRouter>
  );

describe('App Route Smoke Tests', () => {
  it('renders landing page (/) without crashing', () => {
    const { container } = renderAtRoute('/');
    expect(container).toBeTruthy();
  });

  it('renders find-donors page (/find-donors) without crashing', () => {
    const { container } = renderAtRoute('/find-donors');
    expect(container).toBeTruthy();
  });

  it('renders emergency request page (/emergency-request) without crashing', () => {
    const { container } = renderAtRoute('/emergency-request');
    expect(container).toBeTruthy();
  });

  it('renders login page (/login) without crashing', () => {
    const { container } = renderAtRoute('/login');
    expect(container).toBeTruthy();
  });

  it('renders register page (/register) without crashing', () => {
    const { container } = renderAtRoute('/register');
    expect(container).toBeTruthy();
  });

  it('renders notifications page (/notifications) without crashing', () => {
    const { container } = renderAtRoute('/notifications');
    expect(container).toBeTruthy();
  });
});
