import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { setAuth } from '../store/authSlice';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const SignIn: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    try {
      const res = await axios.post('/auth/signin', { email, password });
      dispatch(setAuth(res.data));
      navigate('/', { replace: true });
    } catch (err: any) {
      setError(err.response?.data?.message || 'Sign in failed');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>Sign In</h2>
      <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="Email" required />
      <input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="Password" required />
      <button type="submit">Sign In</button>
      {error && <div style={{ color: 'red' }}>{error}</div>}
    </form>
  );
};

export default SignIn; 