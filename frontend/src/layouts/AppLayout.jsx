import { useState } from "react";
import Sidebar from "../components/Sidebar.jsx";
import Topbar from "../components/Topbar.jsx";

export default function AppLayout({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  return (
    <div className="flex h-screen w-full overflow-hidden bg-surface-950 text-slate-200">
      <div
        className={`flex-none overflow-hidden border-r border-neutral-800 transition-all duration-300 ease-in-out ${
          sidebarOpen ? "w-64" : "w-0 border-r-0"
        }`}
      >
        <Sidebar />
      </div>
      <div className="flex flex-1 flex-col overflow-hidden">
        <Topbar sidebarOpen={sidebarOpen} onToggleSidebar={() => setSidebarOpen((o) => !o)} />
        <main className="flex-1 overflow-hidden">{children}</main>
      </div>
    </div>
  );
}
