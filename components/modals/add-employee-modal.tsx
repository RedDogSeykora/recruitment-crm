import { useState } from "react";
import { Button } from "@/components/ui/button";

type Props = {
  isOpen: boolean;
  onClose: () => void;
  onEmployeeAdded: (employee: any) => void;
};

export function AddEmployeeModal({ isOpen, onClose, onEmployeeAdded }: Props) {
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
          <Button variant="outline" onClick={onClose}>Cancel</Button>
          <Button onClick={handleSubmit} disabled={loading}>
            {loading ? "Saving..." : "Save"}
          </Button>
        </div>
      </div>
    </div>
  );
}
