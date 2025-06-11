import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { Home, Users, FileText, XCircle, Menu, Settings } from 'lucide-react';

export default function HomePage() {
  const [projects, setProjects] = useState<any[]>([]);
  const router = useRouter();

  const userRole = 'admin';

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const res = await fetch('/api/projects');
        const data = await res.json();
        console.log('Fetched projects', data);
        const activeProjects = Array.isArray(data)
  ? data.filter((p) => p.status?.toLowerCase() === 'active')
  : [];

        setProjects(activeProjects);
      } catch (err) {
        console.error('Failed to fetch projects:', err);
      }
    };

    fetchProjects();
  }, []);
<div className="bg-red text-white p-4">If this is red, Tailwind works</div>

  return (
    <main className="p-6 bg-white text-black">
      <h1 className="text-3xl font-bold mb-6">Welcome to the Recruitment CRM</h1>
      <h2 className="text-xl font-semibold mb-4">Active Projects</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {projects.map((project) => (
          <div key={project.id} className="rounded-2xl shadow p-4 bg-white border border-gray-200">
            <h3 className="text-xl font-semibold mb-2 text-black">{project.name}</h3>
            <p className="text-sm text-gray-700">Start Date: {project.startDate ? new Date(project.startDate).toLocaleDateString('en-US') : 'TBD'}</p>
            <p className="text-sm text-gray-700">Location: {project.location}</p>
            <p className="text-sm text-gray-700">Budget: {project.budget ? `$${Number(project.budget).toFixed(2)}` : '-'}</p>
            <button
              className="bg-red hover:bg-navy-dark text-white px-4 py-2 rounded"
              onClick={() => router.push(`/projects/${project.id}`)}
            >
              View Dashboard
            </button>
          </div>
        ))}
      </div>
    </main>
  );  
}
