import { useSelector } from 'react-redux';
import { Outlet, Navigate } from 'react-router-dom';
import { useEffect, useState } from 'react';

export default function PrivateRoute() {
  const { currentUser } = useSelector((state) => state.user);
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    // Check if there's a stored token
    const storedToken = localStorage.getItem('access_token');
    
    if (storedToken) {
      try {
        // Decode the token to get user info and check expiration
        const tokenPayload = JSON.parse(atob(storedToken.split('.')[1]));
        if (tokenPayload.exp * 1000 > Date.now()) {
          // Token is still valid
          setIsAuthenticated(true);
        } else {
          // Token expired, clear it
          localStorage.removeItem('access_token');
          setIsAuthenticated(false);
        }
      } catch (error) {
        // Invalid token, clear it
        localStorage.removeItem('access_token');
        setIsAuthenticated(false);
      }
    } else {
      setIsAuthenticated(false);
    }
    
    setIsLoading(false);
  }, [currentUser]);

  if (isLoading) {
    return <div>Loading…</div>;
  }

  // Debug logging
  console.log('PrivateRoute - currentUser:', currentUser);
  console.log('PrivateRoute - isAuthenticated:', isAuthenticated);
  
  // Allow access if either currentUser exists (Redux state) or token is valid (localStorage)
  return (currentUser || isAuthenticated) ? <Outlet /> : <Navigate to='/sign-in' />;
}
