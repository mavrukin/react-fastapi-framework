/**
 * Authentication types and interfaces.
 */

export interface User {
  email: string;
  name?: string;
  picture?: string;
}

export interface AuthProvider {
  name: 'google' | 'facebook' | 'apple';
  label: string;
}

export const AUTH_PROVIDERS: AuthProvider[] = [
  { name: 'google', label: 'Google' },
  { name: 'facebook', label: 'Facebook' },
  { name: 'apple', label: 'Apple' },
];
