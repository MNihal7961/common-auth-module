import React from 'react';
import { useDispatch } from 'react-redux';
import { clearAuth } from '../store/authSlice';
import { useNavigate } from 'react-router-dom';

const Home: React.FC = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleSignOut = () => {
    dispatch(clearAuth());
    localStorage.removeItem('auth');
    navigate('/signin', { replace: true });
  };

  return (
    <div>
      <h2>Welcome Home (Protected)</h2>
      <button onClick={handleSignOut}>Sign Out</button>
    </div>
  );
};

export default Home; 