import React from 'react';
import { Outlet, useLocation } from 'react-router-dom';

export const PublicLayout: React.FC = () => {
  const location = useLocation();
  const isHomePage = location.pathname === '/';

  if (isHomePage) {
    return <Outlet />;
  }

  return (
    <div className="min-h-screen bg-black text-[#F4F5F7] flex flex-col justify-between">
      <main className="flex-1 flex flex-col justify-center">
        <Outlet />
      </main>
    </div>
  );
};
