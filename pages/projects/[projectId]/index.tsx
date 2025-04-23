import React, { useState } from 'react';
import { useRouter } from 'next/router';
import { Home, Users, FileText, XCircle, Menu, Settings } from 'lucide-react';

export default function ProjectDashboard() {
  const { projectId } = useRouter().query;
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const userRole = 'admin';

  return (
    <div className="flex min-h-screen bg-white text-black">
      {/* Sidebar */}
      <aside className={`bg-[#223351] text-[#F6F5F3] p-4 transition-all duration-300 ${sidebarOpen ? 'w-64' : 'w-20'}`}>
        <div className="flex items-center justify-between mb-6">
          <button onClick={() => setSidebarOpen(!sidebarOpen)} className="text-[#F6F5F3] focus:outline-none">
            <Menu size={20} />
          </button>
        </div>
        <nav className="space-y-4">
          <a href="/" className="flex items-center gap-2 text-[#F6F5F3] hover:text-gray-300">
            <Home size={18} /> {sidebarOpen && 'Home'}
          </a>
          <a href="/employees" className="flex items-center gap-2 text-[#F6F5F3] hover:text-gray-300">
            <Users size={18} /> {sidebarOpen && 'Active Employees'}
          </a>
          <a href="/active-candidates" className="flex items-center gap-2 text-[#F6F5F3] hover:text-gray-300">
            <FileText size={18} /> {sidebarOpen && 'Active Candidates'}
          </a>
          <a href="/denied-applicants" className="flex items-center gap-2 text-[#F6F5F3] hover:text-gray-300">
            <XCircle size={18} /> {sidebarOpen && 'Denied Applicants'}
          </a>
          {userRole === 'admin' && (
            <a href="/admin/manage-projects" className="flex items-center gap-2 text-[#F6F5F3] hover:text-gray-300">
              <Settings size={18} /> {sidebarOpen && 'Manage Projects'}
            </a>
          )}
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-6">
        {typeof projectId === 'string' && !['manage-projects', 'new-project'].includes(projectId) && (
          <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">{projectId?.toString().toUpperCase()} – Project Dashboard</h1>
          <a
            href={`/projects/${projectId}/applicants`}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
          >
            View Applicants
          </a>
        </div>
          
        )}

        {/* Placeholder content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="bg-white shadow p-4 border border-gray-200 rounded">Open Positions: 4</div>
          <div className="bg-white shadow p-4 border border-gray-200 rounded">Applications Received: 843</div>
          <div className="bg-white shadow p-4 border border-gray-200 rounded">Active Team Members: 6</div>
          <div className="bg-white shadow p-4 border border-gray-200 rounded">Placement Rate: 1%</div>
          <div className="bg-white shadow p-4 border border-gray-200 rounded">Days to Project Start: TBD</div>
        </div>
      </main>
    </div>
  );
}
