import { User } from '../types';
import { SignUpFormData } from '../components/SignUpDialog';

// This is the base URL of your future backend server.
// For development, it might be 'http://localhost:5000/api/auth'
const API_URL = '/api/auth'; // Using a relative path for proxying in development

/**
 * --- REAL AUTHENTICATION SERVICE ---
 * The functions below are designed to communicate with a real backend API.
 * You would replace the mock logic in the components with these functions.
 */

/**
 * Logs in a user by sending their credentials to the backend.
 * @param email The user's email.
 * @param password The user's password.
 * @returns A promise that resolves to the user data and a token.
 */
export const loginWithApi = async (email: string, password: string): Promise<{ token: string; user: User }> => {
  const response = await fetch(`${API_URL}/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || 'Login failed');
  }

  const data = await response.json(); // Expected: { token: "...", user: {...} }
  
  // In a real app, you would store this token securely (e.g., in localStorage or a cookie)
  // localStorage.setItem('authToken', data.token);
  
  return data;
};

/**
 * Registers a new user by sending their details to the backend.
 * @param formData The user's name, email, and password.
 * @returns A promise that resolves to the newly created user data.
 */
export const registerWithApi = async (formData: SignUpFormData): Promise<User> => {
  const response = await fetch(`${API_URL}/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(formData),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || 'Registration failed');
  }

  const newUser = await response.json();
  return newUser;
};
