import { Outlet } from "react-router-dom";
import Navbar from "./Navbar";
import Sidebar from "./Sidebar";
import MobileNav from "./MobileNav";

export default function MainLayout() {
  return (
    <div className="min-h-screen bg-surface-bg text-surface-text">
      <Navbar />
      <div className="mx-auto flex max-w-[1600px] gap-8 px-4 py-8 pb-24 md:px-8 lg:px-12 lg:pb-8">
        <Sidebar />
        <main className="min-w-0 flex-1">
          <Outlet />
        </main>
      </div>
      <MobileNav />
    </div>
  );
}
