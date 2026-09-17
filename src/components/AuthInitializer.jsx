// src/components/AuthInitializer.jsx
import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { loadAuthFromStorage } from '@/store/reducer/auth';  // adjust path

export default function AuthInitializer() {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(loadAuthFromStorage());
  }, [dispatch]);

  return null; // this component does nothing visible
}