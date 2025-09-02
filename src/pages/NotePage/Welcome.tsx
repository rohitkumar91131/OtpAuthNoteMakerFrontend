import React, { useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';

interface User   {
  name: string;
  email: string;
  dob?: string;
}

export default function Welcome() {
    const {user , setUser} = useAuth();
    useEffect(() => {
      const fetchUser = async () => {
        try {
          const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/user/me`, 
              {   
                  method : "GET",
                  "credentials" : "include"
              }
          );
          const data = await res.json();
          console.log(data)
          if (data.success) {
            setUser(data.user);
          }
        } catch (err) {
          console.error(err);
        }
      };
  
      fetchUser();
  
    }, []);

  if (!user) return <p className='flex items-center justify-center bg-gray-50 p-4'>Loading...</p>;

  return (
    <div className=" flex items-center justify-center bg-gray-50 p-4">
      <div className="max-w-md w-full bg-white rounded-lg shadow p-6 text-center">
        <h1 className="text-2xl font-bold mb-2">Hey, {user?.name} 👋</h1>
        <p className="text-sm text-gray-500 mb-4">Welcome back — here are your details:</p>

        <div className="text-left space-y-2">
          <div><span className="font-semibold">Email: </span>{user?.email}</div>
          {user.dob && <div><span className="font-semibold">DOB: </span>{user?.dob}</div>}
        </div>
      </div>
    </div>
  );
}
