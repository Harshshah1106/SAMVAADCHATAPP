import { useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';

const AuthDebug = () => {
  const { user, loading } = useAuth();

  useEffect(() => {
    console.log('Auth Debug State:', {
      user,
      loading,
      token: localStorage.getItem('token'),
      location: window.location.pathname
    });
  }, [user, loading]);

  return (
    <div className="fixed top-0 left-0 bg-black/80 text-white p-4 m-2 rounded-lg z-50">
      <pre className="text-xs">
        {JSON.stringify({
          user,
          loading,
          token: !!localStorage.getItem('token'),
          path: window.location.pathname
        }, null, 2)}
      </pre>
    </div>
  );
};

export default AuthDebug;