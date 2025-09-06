import React from 'react';
import { useNavigate } from 'react-router-dom';

// Add this component temporarily to test navigation
export const DebugRouterTest = () => {
  const navigate = useNavigate();
  
  const testNavigation = () => {
    const testId = '689b36a3e24b2895acca0115'; // Use the ID from your logs
    console.log('Testing navigation to:', `/products/${testId}`);
    navigate(`/products/${testId}`);
  };

  const testSearchNavigation = () => {
    const testQuery = 'iphone';
    console.log('Testing search navigation to:', `/products?search=${testQuery}`);
    navigate(`/products?search=${encodeURIComponent(testQuery)}`);
  };

  return (
    <div style={{ position: 'fixed', top: '100px', right: '20px', zIndex: 9999, background: 'white', padding: '10px', border: '1px solid black' }}>
      <h3>Debug Router Test</h3>
      <button onClick={testNavigation} style={{ display: 'block', margin: '5px 0' }}>
        Test Product Navigation
      </button>
      <button onClick={testSearchNavigation} style={{ display: 'block', margin: '5px 0' }}>
        Test Search Navigation
      </button>
    </div>
  );
};
