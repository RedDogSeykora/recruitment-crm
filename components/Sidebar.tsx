import { Home, Users, FileText, XCircle, Settings, Menu } from 'lucide-react';

interface SidebarProps {
  sidebarOpen: boolean;
  toggleSidebar: () => void;
}

const Sidebar = ({ sidebarOpen, toggleSidebar }: SidebarProps) => {
  return (
    <aside className={`bg-navy-light text-white p-4 transition-all duration-300 flex-shrink-0 ${sidebarOpen ? 'w-64' : 'w-20'}`}>
      {/* Toggle button at the top */}
      <div className={`flex mb-6 ${sidebarOpen ? 'justify-start' : 'justify-center'}`}>
  <button
    onClick={toggleSidebar}
    className="text-white hover:bg-navy-dark p-2 rounded border border-white/20 shadow transition">
    <Menu size={20} />
  </button>
</div>
      <nav className="space-y-4 text-sm">
        <a href="/" className="flex items-center gap-2 hover:text-gray-300">
          <Home size={18} /> {sidebarOpen && 'Home'}
        </a>
        <a href="/employees" className="flex items-center gap-2 hover:text-gray-300">
          <Users size={18} /> {sidebarOpen && 'Employees'}
        </a>
        <a href="/active-candidates" className="flex items-center gap-2 hover:text-gray-300">
          <FileText size={18} /> {sidebarOpen && 'Active Candidates'}
        </a>
        <a href="/denied-applicants" className="flex items-center gap-2 hover:text-gray-300">
          <XCircle size={18} /> {sidebarOpen && 'Denied Applicants'}
        </a>
        <a href="/admin/manage-projects" className="flex items-center gap-2 hover:text-gray-300">
          <Settings size={18} /> {sidebarOpen && 'Manage Projects'}
        </a>
      </nav>
    </aside>
  );
};

export default Sidebar;
