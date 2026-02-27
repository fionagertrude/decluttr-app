import { Outlet } from 'react-router-dom';
import TopBar from './TopBar';
import BottomNav from './BottomNav';

export default function AppShell() {
  return (
    <div className="min-h-screen bg-gray-50">
      <TopBar />
      <main className="pb-20 pt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Outlet />
        </div>
      </main>
      <BottomNav /> {/* This must be here */}
    </div>
  );
}