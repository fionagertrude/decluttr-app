import { Outlet } from 'react-router-dom';
import TopBar from './TopBar';

export default function AppShell() {
  return (
    <div className="min-h-screen bg-gray-50">
      <TopBar />
      <main className="pt-20 pb-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <Outlet />
        </div>
      </main>
    </div>
  );
}