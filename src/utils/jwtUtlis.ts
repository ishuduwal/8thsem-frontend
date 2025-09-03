import { store } from '../store/store'; 
import { refreshToken, logout } from '../store/slices/authSlice'; 

export interface DecodedToken {
  userId: string;
  username: string;
  email: string;
  exp: number;
  iat: number;
  isAdmin?: boolean;
}

export const decodeJWT = (token: string): DecodedToken | null => {
  try {
    console.log('Decoding token:', token);
    const base64Url = token.split('.')[1];
    if (!base64Url) {
      console.error('Invalid token format');
      return null;
    }
    
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );
    
    const decoded = JSON.parse(jsonPayload) as DecodedToken;
    console.log('Decoded token:', decoded);
    return decoded;
  } catch (error) {
    console.error('Error decoding JWT:', error);
    return null;
  }
};

// Helper function to check if token is expired or will expire soon
const isTokenExpired = (token: string, bufferSeconds: number = 60): boolean => {
  const decodedToken = decodeJWT(token);
  if (!decodedToken) return true;
  
  const currentTime = Date.now() / 1000;
  const isExpired = decodedToken.exp <= (currentTime + bufferSeconds);
  
  if (isExpired) {
    console.log('Token expired or expiring soon:', {
      current: currentTime,
      exp: decodedToken.exp,
      expired: isExpired
    });
  }
  
  return isExpired;
};

// Enhanced function that automatically refreshes tokens
export const getValidAccessToken = async (): Promise<string | null> => {
  const token = localStorage.getItem('accessToken');
  
  if (!token) {
    console.log('No access token found');
    return null;
  }
  
  // If token is not expired (with 60-second buffer), return it
  if (!isTokenExpired(token)) {
    return token;
  }
  
  console.log('Access token expired, attempting refresh...');
  
  // Token is expired, try to refresh
  const refreshTokenValue = localStorage.getItem('refreshToken');
  if (!refreshTokenValue) {
    console.log('No refresh token available, logging out');
    store.dispatch(logout());
    return null;
  }
  
  // Check if refresh token is also expired
  if (isTokenExpired(refreshTokenValue, 0)) {
    console.log('Refresh token also expired, logging out');
    store.dispatch(logout());
    return null;
  }
  
  try {
    // Dispatch refresh token action
    const result = await store.dispatch(refreshToken()).unwrap();
    console.log('Token refreshed successfully');
    return result.accessToken;
  } catch (error) {
    console.error('Token refresh failed:', error);
    store.dispatch(logout());
    return null;
  }
};

export const getCurrentUser = (): string | null => {
  const token = localStorage.getItem('accessToken');
  if (token) {
    const decodedToken = decodeJWT(token);
    return decodedToken?.username || null;
  }
  return null;
};

export const getCurrentUserId = (): string | null => {
  const token = localStorage.getItem('accessToken');
  if (token) {
    const decodedToken = decodeJWT(token);
    return decodedToken?.userId || null;
  }
  return null;
};

// Enhanced authentication check with automatic refresh
export const isAuthenticated = async (): Promise<boolean> => {
  const token = await getValidAccessToken();
  return !!token;
};

// Synchronous version for immediate checks (doesn't refresh)
export const isAuthenticatedSync = (): boolean => {
  const token = localStorage.getItem('accessToken');
  console.log('Authentication check - token exists:', !!token);
  
  if (!token) return false;
  
  const decodedToken = decodeJWT(token);
  console.log('Authentication check - decoded token:', decodedToken);
  
  if (!decodedToken) return false;
  
  // Check if token is expired
  const currentTime = Date.now() / 1000;
  const isExpired = decodedToken.exp <= currentTime;
  console.log('Token expired:', isExpired, 'Current time:', currentTime, 'Exp time:', decodedToken.exp);
  
  return !isExpired;
};

// Helper function for API calls with automatic token refresh
export const makeAuthenticatedRequest = async (
  url: string, 
  options: RequestInit = {}
): Promise<Response> => {
  const token = await getValidAccessToken();
  
  if (!token) {
    throw new Error('No valid authentication token available');
  }
  
  return fetch(url, {
    ...options,
    headers: {
      ...options.headers,
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  });
};

// Function to check if user is admin
export const isUserAdmin = (): boolean => {
  const token = localStorage.getItem('accessToken');
  if (!token) return false;
  
  const decodedToken = decodeJWT(token);
  return decodedToken?.isAdmin || false;
};