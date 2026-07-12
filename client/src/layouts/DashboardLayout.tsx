import React from 'react';
import Sidebar from '../components/Sidebar';

interface DashboardLayoutProps {
  children: React.ReactNode;
}

const DashboardLayout: React.FC<DashboardLayoutProps> = ({ children }) => {
  return (
    <div className="flex min-h-screen w-full bg-slate-50">
      <div className="w-[260px] shrink-0 fixed top-0 bottom-0 left-0 z-10">
        <Sidebar />
      </div>
      <main className="grow ml-[260px] p-8 max-w-[1400px]">
        {children}
      </main>
    </div>
  );
};

export default DashboardLayout;
