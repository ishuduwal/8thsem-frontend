export interface DecodedToken {
  username: string;
  exp: number;
  iat: number;
  isAdmin? :boolean;
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

export const getCurrentUser = (): string | null => {
  const token = localStorage.getItem('accessToken');
  console.log('Token from localStorage:', token);
  
  if (token) {
    const decodedToken = decodeJWT(token);
    console.log('Decoded token for user:', decodedToken);
    return decodedToken?.username || null;
  }
  return null;
};

export const isAuthenticated = (): boolean => {
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
  
  return decodedToken.exp > currentTime;
};