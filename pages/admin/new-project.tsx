import React, { useState } from 'react';
import { Home, Users, FileText, XCircle, Menu, Settings } from 'lucide-react';
import { useRouter } from 'next/router';

export default function NewProjectPage() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [name, setName] = useState('');
  const [location, setLocation] = useState('');
  const [startDate, setStartDate] = useState('');
  const [headcount, setHeadcount] = useState('');
  const router = useRouter();

  const userRole = 'admin';

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log({ name, location, startDate, headcount });

    // In the future, replace with actual save logic (e.g. API call)
    router.push('/admin/manage-projects-page');
  };

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
        <h1 className="text-3xl font-bold mb-6">Create New Project</h1>

        <form onSubmit={handleSubmit} className="max-w-xl space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Project Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full border rounded px-3 py-2"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Location</label>
            <input
              type="text"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="w-full border rounded px-3 py-2"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Start Date</label>
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="w-full border rounded px-3 py-2"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Employee Target</label>
            <input
              type="number"
              value={headcount}
              onChange={(e) => setHeadcount(e.target.value)}
              className="w-full border rounded px-3 py-2"
              required
            />
          </div>

          <button
            type="submit"
            className="mt-4 bg-blue-600 hover:bg-blue-700 text-white py-2 px-6 rounded"
          >
            Create Project
          </button>
        </form>
      </main>
    </div>
  );
}
