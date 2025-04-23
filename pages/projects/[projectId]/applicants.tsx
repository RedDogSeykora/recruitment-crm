import React, { useState } from 'react';
import { useRouter } from 'next/router';
import { Menu, Home, Users, FileText, XCircle, Settings } from 'lucide-react';

export default function ProjectApplicantsPage() {
  const { projectId } = useRouter().query;
  const [sidebarOpen, setSidebarOpen] = useState(true);

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
        <h1 className="text-3xl font-bold mb-6">Applicants for {projectId?.toString().toUpperCase()}</h1>

        <div className="overflow-x-auto">
          <table className="min-w-full border text-sm">
            <thead className="bg-gray-100">
              <tr>
                <th className="p-3 text-left">Recruitment Stage</th>
                <th className="p-3 text-left">Last Contacted</th>
                <th className="p-3 text-left">Contact Result</th>
                <th className="p-3 text-left">Date Applied</th>
                <th className="p-3 text-left">Position</th>
                <th className="p-3 text-left">Phone</th>
                <th className="p-3 text-left">Email</th>
                <th className="p-3 text-left">Location</th>
                <th className="p-3 text-left">Source</th>
                <th className="p-3 text-left">Recruiter</th>
                <th className="p-3 text-left">Contacted</th>
                <th className="p-3 text-left">Phone Screen Date</th>
                <th className="p-3 text-left">Phone Screen Time</th>
                <th className="p-3 text-left">Interview Date</th>
                <th className="p-3 text-left">Interview Time</th>
                <th className="p-3 text-left">Notes</th>
                <th className="p-3 text-left">Interviewed By</th>
                <th className="p-3 text-left">Offer Date</th>
                <th className="p-3 text-left">$ Offered</th>
                <th className="p-3 text-left">Hire Date</th>
                <th className="p-3 text-left">Decline Date</th>
                <th className="p-3 text-left">Decline Type</th>
                <th className="p-3 text-left">Reason for Decline</th>
                <th className="p-3 text-left">Training Date</th>
                <th className="p-3 text-left">Active/Inactive</th>
              </tr>
            </thead>
            <tbody>
              {/* Applicant rows will be dynamically rendered here */}
              <tr className="border-t">
                <td className="p-2" colSpan={25}>No applicants yet.</td>
              </tr>
            </tbody>
          </table>
        </div>
      </main>
    </div>
  );
}
