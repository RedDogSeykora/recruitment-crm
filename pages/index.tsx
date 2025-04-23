import React, { useState } from 'react';
import { useRouter } from 'next/router';
import { Home, Users, FileText, XCircle, Menu, Settings } from 'lucide-react';

export default function HomePage() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const router = useRouter();

  const userRole = 'admin';

  const projects = [
    {
      id: 'ad50',
      name: 'AD50',
      location: 'Los Angeles',
      candidates: 18,
      updated: '2 hours ago',
    },
    {
      id: 'sd19',
      name: 'SD19',
      location: 'Santa Barbara',
      candidates: 10,
      updated: '1 day ago',
    },
    {
      id: 'sd23',
      name: 'SD23',
      location: 'San Bernardino',
      candidates: 15,
      updated: '3 hours ago',
    },
    {
      id: 'stockton-d3',
      name: 'Stockton D3',
      location: 'Stockton',
      candidates: 8,
      updated: 'Today',
    },
  ];

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
          <a href="#" className="flex items-center gap-2 text-[#F6F5F3] hover:text-gray-300">
            <Home size={18} /> {sidebarOpen && 'Home'}
          </a>
          <a href="#" className="flex items-center gap-2 text-[#F6F5F3] hover:text-gray-300">
            <Users size={18} /> {sidebarOpen && 'Active Employees'}
          </a>
          <a href="#" className="flex items-center gap-2 text-[#F6F5F3] hover:text-gray-300">
            <FileText size={18} /> {sidebarOpen && 'Active Candidates'}
          </a>
          <a href="#" className="flex items-center gap-2 text-[#F6F5F3] hover:text-gray-300">
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
      <main className="flex-1 p-6 bg-white text-black">
        <h1 className="text-3xl font-bold mb-6">Welcome to the Recruitment CRM</h1>
        <h2 className="text-xl font-semibold mb-4">Active Projects</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((project) => (
            <div key={project.id} className="rounded-2xl shadow p-4 bg-white border border-gray-200">
              <h3 className="text-xl font-semibold mb-2 text-black">{project.name}</h3>
              <p className="text-sm text-gray-700">Start Date: TBD</p>
              <p className="text-sm text-gray-700">Location: {project.location}</p>
              <p className="text-sm text-gray-700">Candidates: {project.candidates}</p>
              <p className="text-sm text-gray-700 mb-4">Updated: {project.updated}</p>
              <button
                className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded"
                onClick={() => router.push(`/projects/${project.id}`)}
              >
                View Dashboard
              </button>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
