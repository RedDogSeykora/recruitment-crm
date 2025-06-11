import React, { useState } from 'react';
import { Home, Users, FileText, XCircle, Menu, Settings } from 'lucide-react';
import { useRouter } from 'next/router';

export default function NewProjectPage() {
  const [name, setName] = useState('');
  const [location, setLocation] = useState('');
  const [startDate, setStartDate] = useState('');
  const [headcount, setHeadcount] = useState('');
  const [clientName, setClientName] = useState('');
  const router = useRouter();

  const userRole = 'admin';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const response = await fetch('/api/projects/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name,
          location,
          startDate,
          headcount,
          clientName,
          budget: 0,
          actual: 0,
          status: 'active',
        }),
      });

      if (response.ok) {
        router.push('/admin/manage-projects');
      } else {
        const error = await response.json();
        console.error('Create failed:', error.message);
        alert('Failed to create project.');
      }
    } catch (err) {
      console.error('Error creating project:', err);
      alert('Error creating project.');
    }
  };

  return (
    <div className="flex min-h-screen bg-white text-black">
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
            <label className="block text-sm font-medium mb-1">Client Name</label>
            <input
              type="text"
              value={clientName}
              onChange={(e) => setClientName(e.target.value)}
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
            className="bg-red hover:bg-navy-dark text-white px-4 py-2 rounded"
          >
            Create Project
          </button>
        </form>
      </main>
    </div>
  );
}
