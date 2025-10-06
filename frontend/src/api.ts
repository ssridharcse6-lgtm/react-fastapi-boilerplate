import axios from 'axios';

const API = axios.create({
  baseURL: 'http://localhost:8000',
});

// Auth endpoints
export const loginUser = (data: { username: string; password: string }) =>
  API.post('/auth/token', new URLSearchParams({
    username: data.username,
    password: data.password,
  }), {
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
  });

export const getDashboardData = (token: string) =>
  API.get('/users/me', { headers: { Authorization: `Bearer ${token}` } });

// New user creation
export const registerUser = (data: { username: string; email: string; password: string }) =>
  API.post('/auth/register', data);

// Chat endpoint
export const sendMessage = (token: string | null, message: string, history?: { text: string; from: 'user'|'bot' }[]) =>
  API.post('/chat/', { message, history }, { headers: { Authorization: `Bearer ${token}` } });
