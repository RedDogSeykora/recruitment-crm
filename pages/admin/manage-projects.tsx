import React, { useState, useEffect } from 'react';
import { Home, Users, FileText, XCircle, Menu, Settings, Pencil, Check } from 'lucide-react';
import { useRouter } from 'next/router';

export default function ManageProjectsPage() {
  const userRole = 'admin';
  const router = useRouter();
  const [projects, setProjects] = useState<any[]>([]);
  const [editingProjectId, setEditingProjectId] = useState<string | null>(null);
  const [editedProject, setEditedProject] = useState<any>({});

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const res = await fetch('/api/projects');
        const data = await res.json();
        if (!Array.isArray(data)) {
          console.error('Expected an array but got:', data);
          return;
        }
        setProjects(data);
      } catch (err) {
        console.error('Failed to fetch projects:', err);
      }
    };
  
    fetchProjects();
  }, []);
  

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US');
  };

  const formatCurrency = (value: any) => {
    if (value == null || value === '') return '-';
    const num = Number(value);
    return isNaN(num) ? '-' : `$${num.toFixed(2)}`;
  };
  

  const handleEditClick = (project: any) => {
    setEditingProjectId(project.id);
    setEditedProject({ ...project });
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>, field: string) => {
    setEditedProject((prev: any) => ({ ...prev, [field]: e.target.value }));
  };

  const handleSaveClick = async () => {
    try {
      await fetch(`/api/projects/update/${editingProjectId}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editedProject),
      });
      const updatedProjects = projects.map((proj) =>
        proj.id === editingProjectId ? { ...editedProject } : proj
      );
      setProjects(updatedProjects);
      setEditingProjectId(null);
    } catch (err) {
      console.error('Failed to update project:', err);
    }
  };

  return (
      <main className="flex-1 p-6">
        <h1 className="text-3xl font-bold mb-6">Manage Projects</h1>

        <div className="overflow-x-auto">
          <table className="min-w-full border text-sm">
            <thead className="bg-gray-100">
              <tr>
                <th className="p-3 text-left font-medium">Client Name</th>
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
                  <td className="p-3">
                    {editingProjectId === project.id ? (
                      <input type="text" value={editedProject.client_name || ''} onChange={(e) => handleInputChange(e, 'client_name')} className="border px-2 py-1 rounded w-full" />
                    ) : project.client_name}
                  </td>
                  <td className="p-3">
                    {editingProjectId === project.id ? (
                      <input type="text" value={editedProject.name || ''} onChange={(e) => handleInputChange(e, 'name')} className="border px-2 py-1 rounded w-full" />
                    ) : project.name}
                  </td>
                  <td className="p-3">
                    {editingProjectId === project.id ? (
                      <input type="date" value={editedProject.start_date || ''} onChange={(e) => handleInputChange(e, 'start_date')} className="border px-2 py-1 rounded w-full" />
                    ) : formatDate(project.startDate)}
                  </td>
                  <td className="p-3">
                    {editingProjectId === project.id ? (
                      <input type="text" value={editedProject.location || ''} onChange={(e) => handleInputChange(e, 'location')} className="border px-2 py-1 rounded w-full" />
                    ) : project.location}
                  </td>
                  <td className="p-3">
                    {editingProjectId === project.id ? (
                      <input type="number" value={editedProject.budget || ''} onChange={(e) => handleInputChange(e, 'budget')} className="border px-2 py-1 rounded w-full" />
                    ) : formatCurrency(project.budget)}
                  </td>
                  <td className="p-3">
                    {editingProjectId === project.id ? (
                      <input type="number" value={editedProject.actual || ''} onChange={(e) => handleInputChange(e, 'actual')} className="border px-2 py-1 rounded w-full" />
                    ) : formatCurrency(project.actual)}
                  </td>
                  <td className="p-3">
                    {editingProjectId === project.id ? (
                      <select value={editedProject.status || ''} onChange={(e) => handleInputChange(e, 'status')} className="border px-2 py-1 rounded w-full">
                        <option value="active">Active</option>
                        <option value="inactive">Inactive</option>
                      </select>
                    ) : project.status}
                  </td>
                  <td className="p-3">
                    {editingProjectId === project.id ? (
                      <button className="bg-red hover:bg-navy-dark text-white px-4 py-2 rounded" onClick={handleSaveClick}>
                        <Check size={16} />
                      </button>
                    ) : (
                      <button className="text-blue-600 hover:text-blue-800" onClick={() => handleEditClick(project)}>
                        <Pencil size={16} />
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <button onClick={() => window.location.href = '/admin/new-project'} className="bg-red hover:bg-navy-dark text-white px-4 py-2 rounded">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
          </svg>
        </button>
      </main>
  );
}
