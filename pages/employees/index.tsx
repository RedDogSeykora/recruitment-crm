import { useEffect, useState } from "react";
import { PageHeader } from "@/components/page-header";
import {
  Table,
  Header,
  HeaderRow,
  HeaderCell,
  Body,
  Row,
  Cell,
  TableNode,
} from "@table-library/react-table-library/table";
import { useTheme } from "@table-library/react-table-library/theme";
import type { Employee } from "@/types/employee";
import Link from "next/link";


export default function EmployeesPage() {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null);

  const [editForm, setEditForm] = useState({
    notes: "",
    phone: "",
    email: "",
  });
  
  useEffect(() => {
    if (selectedEmployee) {
      setEditForm({
        notes: selectedEmployee.notes || "",
        phone: selectedEmployee.phone || "",
        email: selectedEmployee.email || "",
      });
    }
  }, [selectedEmployee]);
  
  // Properly format data for the table library
  const data = { nodes: employees || [] as Employee[] };
  
  // Define the table data type
  type EmployeeTableData = {
    nodes: Employee[];
  };
  const [expandedIds, setExpandedIds] = useState<string[]>([]);
  const toggleExpanded = (id: string) => {
    setExpandedIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };
  
  // Add basic theme (optional)
  const theme = useTheme({
    Table: `
      --data-table-library_grid-template-columns: repeat(6, 1fr);
    `,
    HeaderRow: `
      background-color: #f9fafb;
    `,
    Row: `
      &:nth-of-type(odd) {
        background-color: #f3f4f6;
      }
      &:hover {
        background-color: #e5e7eb;
      }
    `,
  });

  useEffect(() => {
    fetch("/api/employees")
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch employees");
        return res.json();
      })
      .then((data) => setEmployees(data))
      .catch((err) => {
        console.error(err);
        setEmployees([]); // fallback
      });
  }, []);

  return (
    <div className="p-6">
      <PageHeader title="Employees" subtitle="Manage current and past employees" />
      
      {/* Table implementation with react-table-library */}
      {Array.isArray(employees) && (
        <div className="mt-6 overflow-x-auto">
          <Table<Employee> data={data} theme={theme}>
            {(tableList: Employee[]) => (
              <>
                <Header>
                  <HeaderRow>
                    <HeaderCell>Name</HeaderCell>
                    <HeaderCell>Position</HeaderCell>
                    <HeaderCell>Location</HeaderCell>
                    <HeaderCell>Status</HeaderCell>
                    <HeaderCell>Start Date</HeaderCell>
                  </HeaderRow>
                </Header>

                <Body>
  {tableList.map((item: Employee) => (
    <>
      <Row key={item.id} item={item}>
        <Cell>{item.full_name}</Cell>
        <Cell>{item.position}</Cell>
        <Cell>{item.location}</Cell>
        <Cell>{item.status}</Cell>
        <Cell className="flex items-center justify-between">
          {new Date(item.start_date).toLocaleDateString()}
<Link href={`/employees/${item.id}`} className="ml-4 text-sm text-blue-600 hover:underline">
  View
</Link>


        </Cell>
      </Row>


    </>
  ))}
</Body>

              </>
            )}
          </Table>
        </div>
      )}
      {selectedEmployee && (
  <div className="fixed right-0 top-0 h-full w-[400px] bg-[#F6F6F3] z-50 border-l border-gray-300 shadow-xl overflow-y-auto">
    <div className="flex items-center justify-between px-6 py-4 border-b border-gray-300">
      <h2 className="text-lg font-semibold">{selectedEmployee.full_name}</h2>
      <button
        className="text-gray-600 text-xl hover:text-black"
        onClick={() => setSelectedEmployee(null)}
      >
        ×
      </button>
    </div>

    <div className="p-6 space-y-4 text-sm">
      <div>
        <label className="block font-semibold mb-1">Notes</label>
        <textarea
          className="w-full border p-2 rounded"
          value={editForm.notes}
          onChange={(e) =>
            setEditForm({ ...editForm, notes: e.target.value })
          }
        />
      </div>

      <div>
        <label className="block font-semibold mb-1">Phone Number</label>
        <input
          className="w-full border p-2 rounded"
          value={editForm.phone}
          onChange={(e) =>
            setEditForm({ ...editForm, phone: e.target.value })
          }
        />
      </div>

      <div>
        <label className="block font-semibold mb-1">Email</label>
        <input
          className="w-full border p-2 rounded"
          value={editForm.email}
          onChange={(e) =>
            setEditForm({ ...editForm, email: e.target.value })
          }
        />
      </div>

      {/* Optional placeholders for future editable fields */}
      <div>
        <label className="block font-semibold mb-1">Previous Project(s)</label>
        <p className="text-gray-600 text-xs">—</p>
      </div>

      <div>
        <label className="block font-semibold mb-1">Previous Doors/Calls per Hour</label>
        <p className="text-gray-600 text-xs">—</p>
      </div>

      <div>
        <label className="block font-semibold mb-1">Shirt Size</label>
        <p className="text-gray-600 text-xs">—</p>
      </div>

      <div className="pt-4">
        <button
          className="w-full bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
          onClick={async () => {
            if (!selectedEmployee) return;
            const res = await fetch(`/api/employees/${selectedEmployee.id}`, {
              method: "PUT",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify(editForm),
            });

            if (res.ok) {
              const updated = await res.json();
              setSelectedEmployee(updated);
              setEmployees((prev) =>
                prev.map((emp) => (emp.id === updated.id ? updated : emp))
              );
            } else {
              alert("Failed to update employee.");
            }
          }}
        >
          Save Changes
        </button>
      </div>
    </div>
  </div>
)}

      {/* Add employee button */}
      <div className="mt-6">
        <button 
          onClick={() => setIsModalOpen(true)}
          className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
        >
          Add Employee
        </button>
      </div>

      {/* Employee modal */}
      <AddEmployeeModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onEmployeeAdded={(newEmployee) => setEmployees((prev) => [newEmployee, ...prev])}
      />
    </div>
  );
}

// Modal component moved outside the main component for better organization
function AddEmployeeModal({
  isOpen,
  onClose,
  onEmployeeAdded,
}: {
  isOpen: boolean;
  onClose: () => void;
  onEmployeeAdded: (employee: any) => void;
}) {
  const [form, setForm] = useState({
    full_name: "",
    position: "",
    location: "",
    start_date: "",
    status: "Active",
    notes: "",
    email: "",
    phone: "",
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    setLoading(true);
    const res = await fetch("/api/employees", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });

    if (res.ok) {
      const newEmployee = await res.json();
      onEmployeeAdded(newEmployee);
      onClose();
    } else {
      alert("Failed to add employee.");
    }

    setLoading(false);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center">
      <div className="bg-white rounded-xl w-full max-w-md p-6 shadow-lg">
        <h2 className="text-lg font-semibold mb-4">Add New Employee</h2>
        <div className="space-y-3">
          <input name="full_name" placeholder="Full Name" className="w-full border p-2 rounded" onChange={handleChange} />
          <input name="position" placeholder="Position" className="w-full border p-2 rounded" onChange={handleChange} />
          <input name="location" placeholder="Location" className="w-full border p-2 rounded" onChange={handleChange} />
          <input type="date" name="start_date" className="w-full border p-2 rounded" onChange={handleChange} />
          <input name="email" placeholder="Email" className="w-full border p-2 rounded" onChange={handleChange} />
          <input name="phone" placeholder="Phone" className="w-full border p-2 rounded" onChange={handleChange} />
          <textarea name="notes" placeholder="Notes" className="w-full border p-2 rounded" onChange={handleChange} />
        </div>

        <div className="flex justify-end gap-2 mt-6">
          <button
            onClick={onClose}
            className="border border-gray-300 text-black px-4 py-2 rounded hover:bg-gray-100"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={loading}
            className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 disabled:opacity-50"
          >
            {loading ? "Saving..." : "Save"}
          </button>
        </div>
      </div>
    </div>
  );
}