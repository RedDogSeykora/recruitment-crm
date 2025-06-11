import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import type { Employee } from "@/types/employee";

const EmployeeProfilePage = () => {
  const router = useRouter();
  const { id } = router.query;

  const [employee, setEmployee] = useState<Employee | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedProjectId, setSelectedProjectId] = useState("");
  const [newProjectRows, setNewProjectRows] = useState<any[]>([]);
  
  useEffect(() => {
    if (!id) return;

    const fetchEmployee = async () => {
      try {
        const res = await fetch(`/api/employees/${id}`);

        if (!res.ok) {
          const text = await res.text();
          throw new Error(`Failed to fetch: ${res.status} – ${text}`);
        }

        const data = await res.json();
        setEmployee(data);
      } catch (err) {
        console.error("Failed to load employee", err);
        setEmployee(null); // Ensure null so fallback UI shows
      } finally {
        setLoading(false);
      }
    };

    fetchEmployee();
  }, [id]);
  
  const [allProjects, setAllProjects] = useState([]);
  useEffect(() => {
    fetch("/api/projects")
      .then((res) => res.json())
      .then(setAllProjects)
      .catch((err) => console.error("Failed to load projects", err));
  }, []);

  if (loading) return <div className="p-6">Loading...</div>;
  if (!employee) return <div className="p-6">Employee not found.</div>;

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-semibold mb-4">{employee.full_name}</h1>

      <div className="grid grid-cols-2 gap-6 text-sm mb-8">
        <div>
          <p className="font-semibold">Position</p>
          <p>{employee.position}</p>
        </div>
        <div>
          <p className="font-semibold">Location</p>
          <p>{employee.location}</p>
        </div>
        <div>
          <p className="font-semibold">Phone</p>
          <p>{employee.phone}</p>
        </div>
        <div>
          <p className="font-semibold">Email</p>
          <p>{employee.email}</p>
        </div>
        <div className="col-span-2">
          <p className="font-semibold">Notes</p>
          <p>{employee.notes || "—"}</p>
        </div>
      </div>

      <hr className="my-8" />

      <h2 className="text-xl font-semibold mb-4">Project History</h2>
      <label className="block mb-2 text-sm font-medium text-gray-700">
  Add Project History
</label>
<select
  className="w-full border rounded px-3 py-2 mb-2"
  value={selectedProjectId}
  onChange={(e) => setSelectedProjectId(e.target.value)}
>
  <option value="">Select a project</option>
  {allProjects.map((project: any) => (
    <option key={project.id} value={project.id}>
      {project.name}
    </option>
  ))}
</select>

<button
  className="mb-4 bg-blue-600 text-white px-3 py-1 rounded"
  disabled={!selectedProjectId}
  onClick={() => {
    const alreadyAdded = newProjectRows.some(
      (row) => row.project_id === selectedProjectId
    );
    if (alreadyAdded) return;

    const project = allProjects.find((p: any) => p.id === selectedProjectId);
    setNewProjectRows([
      ...newProjectRows,
      {
        project_id: selectedProjectId,
        project_name: project?.name || "Unnamed Project",
        start_date: "",
        end_date: "",
        doors_per_hour: "",
        total_doors: "",
        survey_rate: "",
        total_hours: "",
      },
    ]);
    setSelectedProjectId(""); // reset dropdown
  }}
>
  Add Project
</button>

{employee.projects && employee.projects.length > 0 ? (
  <div className="overflow-x-auto">
    <table className="min-w-full table-auto text-sm border border-gray-200">
      <thead className="bg-gray-100 text-left">
        <tr>
          <th className="px-4 py-2 border">Project</th>
          <th className="px-4 py-2 border">Active Time</th>
          <th className="px-4 py-2 border">Doors/Hour</th>
          <th className="px-4 py-2 border">Total Doors</th>
          <th className="px-4 py-2 border">Survey Rate</th>
          <th className="px-4 py-2 border">Total Hours</th>
        </tr>
      </thead>
      <tbody>
        {employee.projects.map((project: any, idx: number) => (
          <tr key={idx} className="even:bg-gray-50">
            <td className="px-4 py-2 border">{project.project_name}</td>
            <td className="px-4 py-2 border">
              {project.start_date && project.end_date
                ? `${new Date(project.start_date).toLocaleDateString()} – ${new Date(project.end_date).toLocaleDateString()}`
                : "—"}
            </td>
            <td className="px-4 py-2 border">{project.doors_per_hour || "—"}</td>
            <td className="px-4 py-2 border">{project.total_doors || "—"}</td>
            <td className="px-4 py-2 border">{project.survey_rate || "—"}</td>
            <td className="px-4 py-2 border">{project.total_hours || "—"}</td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
) : (
  <p className="text-sm text-gray-600">No project history yet.</p>
)}

{/* ✅ Always render this after the saved history section */}
{newProjectRows.length > 0 && (
  <div className="mt-6">
    <table className="min-w-full table-auto text-sm border border-gray-300">
      <thead className="bg-gray-100">
        <tr>
          <th className="px-4 py-2 border">Project</th>
          <th className="px-4 py-2 border">Start Date</th>
          <th className="px-4 py-2 border">End Date</th>
          <th className="px-4 py-2 border">Doors/Hour</th>
          <th className="px-4 py-2 border">Total Doors</th>
          <th className="px-4 py-2 border">Survey Rate</th>
          <th className="px-4 py-2 border">Total Hours</th>
        </tr>
      </thead>
      <tbody>
        {newProjectRows.map((row, idx) => (
          <tr key={idx}>
            <td className="px-4 py-2 border">{row.project_name}</td>
            {["start_date", "end_date", "doors_per_hour", "total_doors", "survey_rate", "total_hours"].map((field) => (
              <td className="px-2 py-1 border" key={field}>
                <input
                  type={field.includes("date") ? "date" : "number"}
                  className="w-full border px-2 py-1 text-sm"
                  value={row[field]}
                  onChange={(e) => {
                    const updated = [...newProjectRows];
                    updated[idx][field] = e.target.value;
                    setNewProjectRows(updated);
                  }}
                />
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>

    <button
      onClick={async () => {
        try {
          await Promise.all(
            newProjectRows.map(async (row) => {
              const res = await fetch("/api/project-history", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                  employee_id: employee.id,
                  ...row,
                }),
              });
      
              if (!res.ok) {
                const errText = await res.text();
                throw new Error(`Failed to save row: ${errText}`);
              }
            })
          );
      
          // After saving, refresh page to show updates
          window.location.reload();
        } catch (err) {
          console.error("Save error:", err);
          alert("Failed to save some project history entries. Check console for details.");
        }
      }}>
      Save Project History
    </button>
  </div>
)}
  </div>
  );
};
export default EmployeeProfilePage;
