import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Papa from 'papaparse';
import { Menu, Home, Users, FileText, XCircle, Settings } from 'lucide-react';
import {
  Table,
  Header,
  HeaderRow,
  HeaderCell,
  Body,
  Row,
  Cell,
} from '@table-library/react-table-library/table';
import { Virtualized } from '@table-library/react-table-library/virtualized';
import { useSort } from '@table-library/react-table-library/sort';
import { useTheme } from "@table-library/react-table-library/theme";

function formatLabel(field: string) {
  return field
    .replace(/_/g, ' ')           // Replace underscores with spaces
    .split(' ')                   // Split into words
    .map(word => word.charAt(0).toUpperCase() + word.slice(1)) // Capitalize each word
    .join(' ');                   // Join them back with spaces
}
function EditableDrawerInput({ applicant, field, initialValue, handleCellUpdate }: any) {
  const [value, setValue] = useState(initialValue || '');

  useEffect(() => {
    setValue(initialValue || '');
  }, [initialValue]);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (value !== initialValue) {
        handleCellUpdate(applicant.id, field, value);
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [value]);

  const isDateField = field.includes('date');
  const isDropdownField = ['decline_type', 'reason_for_decline', 'status'].includes(field);

  if (isDropdownField) {
    const options = field === 'decline_type'
      ? ['Client Decline', 'Candidate Decline']
      : field === 'reason_for_decline'
        ? ['No Show', 'Salary', 'Experience', 'Too Far', 'Another Offer', 'Unprofessional', 'Other']
        : ['Active', 'Inactive'];

    return (
      <div className="flex flex-col">
        <label className="text-sm font-medium text-gray-700">
          {formatLabel(field)}
        </label>

        <select
          value={value}
          onChange={(e) => setValue(e.target.value)}
          className="border px-3 py-1 rounded mt-1 text-sm"
        >
          <option value="">Select</option>
          {options.map(opt => (
            <option key={opt} value={opt}>{opt}</option>
          ))}
        </select>
      </div>
    );
  }

  return (
    <div className="flex flex-col">
      <label className="text-sm font-medium text-gray-700">
        {formatLabel(field)}
      </label>

      <input
        type={isDateField ? 'date' : 'text'}
        value={value}
        onChange={(e) => setValue(e.target.value)}
        className="border px-3 py-1 rounded mt-1 text-sm"
      />
    </div>
  );
}

export default function ProjectApplicantsPage() {
  const { projectId } = useRouter().query;
  const [applicants, setApplicants] = useState<any[]>([]);
  const [project, setProject] = useState<any>(null);
  const [adding, setAdding] = useState(false);
  const [expandedId, setExpandedId] = useState<string | null>(null);


  const [newApplicant, setNewApplicant] = useState({
    first_name: '',
    last_name: '',
    phone: '',
    email: '',
    location: '',
    date_applied: '',
  });

  useEffect(() => {
    if (projectId) fetchApplicants();
  }, [projectId]);

  useEffect(() => {
    if (projectId) fetchProject();
  }, [projectId]);

  const fetchApplicants = async () => {
    const res = await fetch(`/api/applicants?project_id=${projectId}`);
    const data = await res.json();
    setApplicants(
      data.map((applicant: any) => ({
        id: applicant.id,
        recruitment_stage: '',
        last_contacted: applicant.last_contacted || '',
        first_name: applicant.name?.split(' ')[0] || '',
        last_name: applicant.name?.split(' ').slice(1).join(' ') || '',
        contact_result: applicant.contact_result || '',
        date_applied: applicant.date_applied || '',
        position: applicant.position || '',
        phone: applicant.phone || '',
        email: applicant.email || '',
        location: applicant.location || '',
        source: applicant.source || '',
        recruiter: applicant.recruiter || '',
        contacted: applicant.contacted || false,
        phone_screen_date: applicant.phone_screen_date || '',
        phone_screen_time: applicant.phone_screen_time || '',
        interview_date: applicant.interview_date || '',
        interview_time: applicant.interview_time || '',
        notes: applicant.notes || '',
        interviewed_by: applicant.interviewed_by || '',
        offer_date: applicant.offer_date || '',
        offer_amount: applicant.offer_amount || '',
        hire_date: applicant.hire_date || '',
        decline_date: applicant.decline_date || '',
        decline_type: applicant.decline_type || '',
        reason_for_decline: applicant.reason_for_decline || '',
        training_date: applicant.training_date || '',
        status: applicant.status || 'Inactive',
      }))
    );
  };

  const fetchProject = async () => {
    const res = await fetch(`/api/projects/${projectId}`);
    const data = await res.json();
    setProject(data);
  };

  const handleCellUpdate = async (id: string, field: string, value: string) => {
    // First update the specific field
    await fetch('/api/applicants/update-field', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ applicant_id: id, field, value }),
    });

    setApplicants(prev => {
      const updated = prev.map(app => app.id === id ? { ...app, [field]: value } : app);

      // Now find the updated applicant
      const applicant = updated.find(app => app.id === id);
      if (!applicant) return updated;

      // Auto-calculate Recruitment Stage
      let stage = 0;

      if (applicant.phone_screen_date && applicant.phone_screen_time) stage = 1;
      if (applicant.interview_date && applicant.interview_time && applicant.interviewed_by) stage = 2;
      if (applicant.offer_date && applicant.offer_amount) stage = 3;
      if (applicant.hire_date) stage = 4;
      if (applicant.decline_type || applicant.training_date) stage = 5;

      if (applicant.recruitment_stage !== stage) {
        // Update recruitment_stage field if changed
        fetch('/api/applicants/update-field', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ applicant_id: id, field: 'recruitment_stage', value: stage }),
        });

        return updated.map(app => app.id === id ? { ...app, recruitment_stage: stage } : app);
      }

      return updated;
    });
  };
  const handleSaveApplicant = async () => {
    try {
      const body = {
        name: `${newApplicant.first_name} ${newApplicant.last_name}`.trim(),
        phone: newApplicant.phone,
        email: newApplicant.email,
        location: newApplicant.location,
        date_applied: newApplicant.date_applied,
        status: 'Inactive',
        project_id: projectId,
      };

      await fetch('/api/applicants/upload', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify([body]),
      });

      alert('Applicant added!');
      fetchApplicants(); // Refresh the list
      setAdding(false);
      setNewApplicant({
        first_name: '',
        last_name: '',
        phone: '',
        email: '',
        location: '',
        date_applied: '',
      });
    } catch (err) {
      console.error('Error saving applicant:', err);
      alert('Failed to add applicant.');
    }
  };

  const COLUMNS = [
    { label: '', field: 'expand', resizable: true, editable: false },
    { label: 'Recruitment Stage', field: 'recruitment_stage', resizable: true, editable: false, sortKey: 'recruitment_stage' },
    { label: 'Last Contacted', field: 'last_contacted', resizable: true, editable: true, sortKey: 'last_contacted' },
    { label: 'First Name', field: 'first_name', resizable: true, editable: true, sortKey: 'first_name' },
    { label: 'Last Name', field: 'last_name', resizable: true, editable: true, sortKey: 'last_name' },
    { label: 'Contact Result', field: 'contact_result', resizable: true, editable: true },
    { label: 'Phone', field: 'phone', resizable: true, editable: true },
    { label: 'Email', field: 'email', resizable: true, editable: true },
    { label: 'Location', field: 'location', resizable: true, editable: true, sortKey: 'location' },
    { label: 'Contacted', field: 'contacted', resizable: true, editable: false, sortKey: 'contacted' },
    { label: 'Recruiter', field: 'recruiter', resizable: true, editable: true, sortKey: 'recruiter' },
  ];


  const data = { nodes: applicants };
  const onSortChange = (action: any, state: any) => {
    console.log('Sorting changed', action, state);
  };
  const sort = useSort(
    data,
    {
      onChange: onSortChange,
    },
    {
      sortFns: {
        recruitment_stage: (array: any[]) =>
          array.sort((a, b) => (a.recruitment_stage || '').localeCompare(b.recruitment_stage || '')),

        last_contacted: (array: any[]) =>
          array.sort((a, b) =>
            new Date(a.last_contacted || 0).getTime() - new Date(b.last_contacted || 0).getTime()
          ),

        first_name: (array: any[]) =>
          array.sort((a, b) => (a.first_name || '').localeCompare(b.first_name || '')),

        last_name: (array: any[]) =>
          array.sort((a, b) => (a.last_name || '').localeCompare(b.last_name || '')),

        location: (array: any[]) =>
          array.sort((a, b) => (a.location || '').localeCompare(b.location || '')),

        contacted: (array: any[]) =>
          array.sort((a, b) => (String(a.contacted || '')).localeCompare(String(b.contacted || ''))),

        recruiter: (array: any[]) =>
          array.sort((a, b) => (a.recruiter || '').localeCompare(b.recruiter || '')),
      },
    }
  );

  const { sortKey, reverse } = sort.state;

  const theme = useTheme({
    Table: `
      --data-table-library_grid-template-columns: repeat(${COLUMNS.length}, 1fr);
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
  
  return (
    <>
      <main className="flex-1 p-6 overflow-auto bg-white text-black">
        <h1 className="text-3xl font-bold mb-6">
          {project?.name || 'Loading...'} – Applicants
        </h1>
        <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-4 mb-4">
  <button
    onClick={() => setAdding(true)}
    className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded text-sm whitespace-nowrap">
    + Add Applicant
  </button>

  <label className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded text-sm whitespace-nowrap cursor-pointer">
    Upload CSV
    <input
      type="file"
      accept=".csv"
      className="hidden"
      onChange={(e) => {
        const file = e.target.files?.[0];
        if (file) {
          Papa.parse(file, {
            header: true,
            skipEmptyLines: true,
            complete: (results) => {
              const formattedData = results.data.map((row: any) => ({
                project_id: projectId,
                name: row["name"] || '',
                phone: (row["phone"] || '').replace(/^['`+]+/, '').replace(/^1\s*/, "").trim(),
                email: '',
                location: row["candidate location"] || '',
                date_applied: row["date"] || '',
                status: 'Inactive',
              }));

              fetch('/api/applicants/upload', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formattedData),
              })
                .then(res => res.json())
                .then(() => {
                  alert('Upload successful!');
                  fetchApplicants();
                })
                .catch((err) => {
                  console.error('Upload error:', err);
                  alert('Upload failed.');
                });
            },
          });
        }
      }}
    />
  </label>
</div>

</div>
  {
    adding && (
      <div className="mb-6 p-4 border border-gray-300 rounded bg-gray-50">
        <h3 className="text-lg font-semibold mb-2">New Applicant</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <input
            className="border rounded px-3 py-2"
            placeholder="First Name"
            value={newApplicant.first_name}
            onChange={(e) => setNewApplicant({ ...newApplicant, first_name: e.target.value })}
          />
          <input
            className="border rounded px-3 py-2"
            placeholder="Last Name"
            value={newApplicant.last_name}
            onChange={(e) => setNewApplicant({ ...newApplicant, last_name: e.target.value })}
          />
          <input
            className="border rounded px-3 py-2"
            placeholder="Phone"
            value={newApplicant.phone}
            onChange={(e) => setNewApplicant({ ...newApplicant, phone: e.target.value })}
          />
          <input
            className="border rounded px-3 py-2"
            placeholder="Email"
            value={newApplicant.email}
            onChange={(e) => setNewApplicant({ ...newApplicant, email: e.target.value })}
          />
          <input
            className="border rounded px-3 py-2"
            placeholder="Location"
            value={newApplicant.location}
            onChange={(e) => setNewApplicant({ ...newApplicant, location: e.target.value })}
          />
          <input
            type="date"
            className="border rounded px-3 py-2"
            value={newApplicant.date_applied}
            onChange={(e) => setNewApplicant({ ...newApplicant, date_applied: e.target.value })}
          />
        </div>
        <div className="mt-4 flex gap-3">
          <button
            className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded"
            onClick={handleSaveApplicant}
          >
            Save
          </button>
          <button
            className="bg-gray-300 hover:bg-gray-400 text-black px-4 py-2 rounded"
            onClick={() => setAdding(false)}
          >
            Cancel
          </button>
        </div>
      </div>
    )
  }

<div className="mt-6 overflow-x-auto">
      <Table data={data} theme={theme}
        layout={{
          isDiv: true,
          fixedHeader: true
        }}
        plugins={{ Virtualized, sort }}>
        {(tableList: any[]) => (
          <>
            <Header>
              <HeaderRow>
                {COLUMNS.map((col, idx) => (
                  <HeaderCell
                    key={idx}
                    sort
                    sortKey={col.sortKey}
                    resize={col.resizable}
                  >
                    <div className="flex items-center gap-1">
                      {col.label}
                      {sort.state.sortKey === col.sortKey && (
                        <span>{sort.state.reverse ? '▲' : '▼'}</span>
                      )}
                    </div>
                  </HeaderCell>
                ))}
              </HeaderRow>
            </Header>


            <Body>
              <>
                {tableList.map((item: any) => (
                  <React.Fragment key={item.id}>
                    <Row item={item}
                      className="cursor-pointer hover:bg-gray-100">
                      {COLUMNS.map((col, idx) => (
                        <Cell key={idx}
                          className={col.field === 'expand' ? 'w-8' : ''}>
                          {col.field === 'expand' ? (
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                setExpandedId(expandedId === item.id ? null : item.id);
                              }}
                              className="flex items-center justify-center w-full"
                            >
                              {expandedId === item.id ? '▲' : '▼'}
                            </button>
                          ) : (
                            col.editable
                              ? <EditableCell item={item} field={col.field} handleCellUpdate={handleCellUpdate} />
                              : <span>{item[col.field]}</span>
                          )}
                        </Cell>
                      ))}
                    </Row>
                  </React.Fragment>
                ))}
              </>
            </Body>
          </>
        )}
      </Table>
      {expandedId && (
        <div
          className="fixed top-0 right-0 h-full w-96 bg-white border-l border-gray-300 shadow-lg p-6 overflow-y-auto z-50"
        >
          <button
            onClick={() => setExpandedId(null)}
            className="text-gray-500 hover:text-black absolute top-4 right-4"
          >
            ✕
          </button>

          {(() => {
            const applicant = applicants.find((a) => a.id === expandedId);
            if (!applicant) return null;

            return (
              <div className="mt-8 space-y-6">
                <h2 className="text-xl font-semibold">{applicant.first_name} {applicant.last_name}</h2>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {[
                    { label: 'Phone Screen Date', field: 'phone_screen_date' },
                    { label: 'Phone Screen Time', field: 'phone_screen_time' },
                    { label: 'Interview Date', field: 'interview_date' },
                    { label: 'Interview Time', field: 'interview_time' },
                    { label: 'Notes', field: 'notes' },
                    { label: 'Interviewed By', field: 'interviewed_by' },
                    { label: 'Offer Date', field: 'offer_date' },
                    { label: 'Offer Amount', field: 'offer_amount' },
                    { label: 'Hire Date', field: 'hire_date' },
                    { label: 'Decline Date', field: 'decline_date' },
                    { label: 'Decline Type', field: 'decline_type' },
                    { label: 'Reason for Decline', field: 'reason_for_decline' },
                    { label: 'Training Date', field: 'training_date' },
                  ].map(({ field }) => (
                    <EditableDrawerInput
                      key={field}
                      applicant={applicant}
                      field={field}
                      initialValue={applicant[field]}
                      handleCellUpdate={handleCellUpdate}
                    />
                  ))}
                </div>
              </div>
            );
          })()}
        </div>
      )}
    </div>
      </main>
      </>
  );
}

function EditableCell({ item, field, handleCellUpdate }: any) {
  const [value, setValue] = useState(item[field] || '');

  useEffect(() => {
    setValue(item[field] || '');
  }, [item, field]);

  const onBlur = () => {
    if (value !== item[field]) {
      handleCellUpdate(item.id, field, value);
    }
  };

  const isDateField = field.includes('date');
  const isDropdownField = ['decline_type', 'reason_for_decline', 'status'].includes(field);

  if (isDropdownField) {
    const options = field === 'decline_type'
      ? ['Client Decline', 'Candidate Decline']
      : field === 'reason_for_decline'
        ? ['No Show', 'Salary', 'Experience', 'Too Far', 'Another Offer', 'Unprofessional', 'Other']
        : ['Active', 'Inactive'];

    return (
      <select
        value={value}
        onChange={(e) => {
          setValue(e.target.value);
          handleCellUpdate(item.id, field, e.target.value);
        }}
        className="border px-2 py-1 rounded w-full text-sm"
      >
        <option value="">Select</option>
        {options.map(opt => (
          <option key={opt} value={opt}>{opt}</option>
        ))}
      </select>
    );
  }

  return (
    <input
      type={isDateField ? 'date' : 'text'}
      value={value}
      onChange={(e) => setValue(e.target.value)}
      onBlur={onBlur}
      className="border px-2 py-1 rounded w-full text-sm"
    />
  );
}


