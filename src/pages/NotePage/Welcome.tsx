import React, { useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';

type User = {
  name: string;
  email: string;
  dob?: string | Date | null;
};

export default function Welcome(): JSX.Element {
  const { user, setUser } = useAuth() as {
    user?: User | null;
    setUser?: (u: User | null) => void;
  };

  useEffect(() => {
    let mounted = true;
    const fetchUser = async () => {
      try {
        const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/user/me`, {
          method: 'GET',
          credentials: 'include',
        });

        if (!res.ok) {
          console.error('Failed to fetch user, status:', res.status);
          return;
        }

        const data = await res.json();
        if (mounted && data?.success && data.user) {
          setUser?.(data.user as User);
        }
      } catch (err) {
        console.error(err);
      }
    };

    fetchUser();

    return () => {
      mounted = false;
    };
  }, [setUser]);

  if (!user) return <p className="flex items-center justify-center bg-gray-50 p-4">Loading...</p>;

  const formattedDob = user.dob ? new Date(user.dob).toLocaleDateString() : null;

  return (
    <div className="flex items-center justify-center bg-gray-50 p-4">
      <div className="max-w-md w-full bg-white rounded-lg shadow p-6 text-center">
        <h1 className="text-2xl font-bold mb-2">Hey, {user.name} 👋</h1>
        <p className="text-sm text-gray-500 mb-4">Welcome back — here are your details:</p>

        <div className="text-left space-y-2">
          <div>
            <span className="font-semibold">Email: </span>
            {user.email}
          </div>
          {formattedDob && (
            <div>
              <span className="font-semibold">DOB: </span>
              {formattedDob}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
