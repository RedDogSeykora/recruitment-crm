import React, { useState } from 'react';
import { Home, Users, FileText, XCircle, Menu, Settings, Pencil } from 'lucide-react';

export default function ManageProjectsPage() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const userRole = 'admin';

  const projects = [
    { id: 'ad50', name: 'AD50', startDate: '2024-06-01', location: 'Los Angeles', budget: '$20,000', actual: '$18,500', status: 'Active' },
    { id: 'sd19', name: 'SD19', startDate: '2024-06-15', location: 'Santa Barbara', budget: '$25,000', actual: '$24,200', status: 'Active' },
    { id: 'sd23', name: 'SD23', startDate: '2024-07-01', location: 'San Bernardino', budget: '$22,000', actual: '$15,000', status: 'Inactive' },
    { id: 'stockton-d3', name: 'Stockton D3', startDate: '2024-07-10', location: 'Stockton', budget: '$18,000', actual: '$16,800', status: 'Active' },
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
          <a href="/" className="flex items-center gap-2 text-[#F6F5F3] hover:text-gray-300">
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
      <main className="flex-1 p-6">
        <h1 className="text-3xl font-bold mb-6">Manage Projects</h1>

        <div className="overflow-x-auto">
          <table className="min-w-full border text-sm">
            <thead className="bg-gray-100">
              <tr>
                <th className="p-3 text-left font-medium">Project Name</th>
                <th className="p-3 text-left font-medium">Project Start Date</th>
                <th className="p-3 text-left font-medium">Location</th>
                <th className="p-3 text-left font-medium">Budget</th>
                <th className="p-3 text-left font-medium">Actual</th>
                <th className="p-3 text-left font-medium">Project Status</th>
                <th className="p-3 text-left font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {projects.map((project) => (
                <tr key={project.id} className="border-t">
                  <td className="p-3">{project.name}</td>
                  <td className="p-3">{project.startDate}</td>
                  <td className="p-3">{project.location}</td>
                  <td className="p-3">{project.budget}</td>
                  <td className="p-3">{project.actual}</td>
                  <td className="p-3">{project.status}</td>
                  <td className="p-3">
                    <button className="text-blue-600 hover:text-blue-800">
                      <Pencil size={16} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      <button
          onClick={() => window.location.href = '/admin/new-project'}
          className="fixed bottom-6 right-6 bg-blue-600 hover:bg-blue-700 text-white p-4 rounded-full shadow-lg"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
          </svg>
        </button>
      </main>
    </div>
  );
}
