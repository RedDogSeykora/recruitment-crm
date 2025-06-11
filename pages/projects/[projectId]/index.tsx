import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { Home, Users, FileText, XCircle, Menu, Settings } from 'lucide-react';

export default function ProjectDashboard() {
  const { projectId } = useRouter().query;
  const userRole = 'admin';

  const [project, setProject] = useState<any>(null);
  const [applicants, setApplicants] = useState<any[]>([]);

  useEffect(() => {
    if (!projectId) return;

    const fetchProject = async () => {
      const res = await fetch(`/api/projects/${projectId}`);
      const data = await res.json();
      setProject(data);
    };

    const fetchApplicants = async () => {
      const res = await fetch(`/api/applicants?project_id=${projectId}`);
      const data = await res.json();
      setApplicants(Array.isArray(data) ? data : []);
    };

    fetchProject();
    fetchApplicants();
  }, [projectId]);

  const totalApplicants = applicants.length;
  const activeApplicants = applicants.filter(a => a.status?.toLowerCase() === 'active');
  const activeTeamMembers = activeApplicants.length;
  const placementRate = totalApplicants > 0 ? ((activeTeamMembers / totalApplicants) * 100).toFixed(1) : '0.0';

  const daysToStart = project?.startDate
    ? Math.max(
        0,
        Math.ceil(
          (new Date(project.startDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)
        )
      )
    : 'TBD';

    return (
      <>
        <main className="flex-1 p-6 overflow-auto bg-white text-black">
          <h1 className="text-3xl font-bold mb-6">
            {project?.name || 'Loading...'} – Applicants
          </h1>
            <a
              href={`/projects/${projectId}/applicants`}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
            >
              View Applicants
            </a>
            </main>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="bg-white shadow p-4 border border-gray-200 rounded">
            Applications Received: {totalApplicants}
          </div>
          <div className="bg-white shadow p-4 border border-gray-200 rounded">
            Active Team Members: {activeTeamMembers}
          </div>
          <div className="bg-white shadow p-4 border border-gray-200 rounded">
            Placement Rate: {placementRate}%
          </div>
          <div className="bg-white shadow p-4 border border-gray-200 rounded">
            Days to Project Start: {daysToStart}
          </div>
        </div>
    </>
  );
}
