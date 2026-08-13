import Sidebar from "../components/Sidebar";
import RightSidebar from "../components/RightSidebar";

function MainLayout({ children }) {
  return (
    <div className="min-h-screen bg-black text-white">
      
      <div className="max-w-7xl mx-auto flex">
        
        {/* LEFT SIDEBAR */}
        <div className="w-[20%] border-r border-zinc-800 min-h-screen sticky top-0">
          <Sidebar />
        </div>

        {/* MAIN CONTENT */}
        <div className="w-[55%] min-h-screen border-r border-zinc-800 px-6 py-6">
          {children}
        </div>

        {/* RIGHT SIDEBAR */}
        <div className="w-[25%] min-h-screen px-6 py-6">
          <RightSidebar />
        </div>

      </div>
    </div>
  );
}

export default MainLayout;