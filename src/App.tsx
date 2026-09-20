import React from 'react';
import { RouterProvider } from 'react-router-dom';
import { AppProviders } from '@/app/providers';
import { router } from '@/app/router';
import { LogoPreloader } from '@/components/ui/LogoPreloader';

export const App: React.FC = () => {
  return (
    <AppProviders>
      <LogoPreloader />
      <RouterProvider router={router} />
    </AppProviders>
  );
};

export default App;
