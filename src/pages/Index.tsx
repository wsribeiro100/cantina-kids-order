
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser } from '@/contexts/UserContext';

const Index = () => {
  const { user } = useUser();
  const navigate = useNavigate();
  
  useEffect(() => {
    // Redirect to login if not authenticated, otherwise to catalog
    if (!user) {
      navigate('/login');
    } else {
      navigate('/catalog');
    }
  }, [user, navigate]);
  
  // This page is just a redirect, no content needed
  return null;
};

export default Index;
