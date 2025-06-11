import React, { useState } from 'react';
import Sidebar from './Sidebar';

const BaseLayout = ({ children }: { children: React.ReactNode }) => {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  return (
    <div className="flex h-screen bg-white text-black">
      <Sidebar sidebarOpen={sidebarOpen} toggleSidebar={() => setSidebarOpen(!sidebarOpen)} />
      <div className="flex-1 overflow-y-auto">
        <header className="bg-white shadow p-4">
        </header>
        <main className="flex-1 overflow-y-auto bg-white text-navy-dark p-6">
          {children}
        </main>
      </div>
    </div>
  );
};

export default BaseLayout;
