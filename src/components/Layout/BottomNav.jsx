import { NavLink } from 'react-router-dom';
import {
  HomeIcon,
  PlusCircleIcon,
  ShoppingBagIcon,
  ChatBubbleLeftIcon,
  UserIcon,
} from '@heroicons/react/24/outline';
import {
  HomeIcon as HomeIconSolid,
  PlusCircleIcon as PlusCircleIconSolid,
  ShoppingBagIcon as ShoppingBagIconSolid,
  ChatBubbleLeftIcon as ChatBubbleLeftIconSolid,
  UserIcon as UserIconSolid,
} from '@heroicons/react/24/solid';

const navItems = [
  { to: '/feed', label: 'Home', icon: HomeIcon, activeIcon: HomeIconSolid },
  { to: '/post', label: 'Sell', icon: PlusCircleIcon, activeIcon: PlusCircleIconSolid },
  { to: '/purchases', label: 'Orders', icon: ShoppingBagIcon, activeIcon: ShoppingBagIconSolid },
  { to: '/inbox', label: 'Chat', icon: ChatBubbleLeftIcon, activeIcon: ChatBubbleLeftIconSolid },
  { to: '/profile', label: 'Profile', icon: UserIcon, activeIcon: UserIconSolid },
];

export default function BottomNav() {
  return (
    <>
      {/* Desktop: Show as top navigation */}
      <nav className="hidden md:flex fixed top-0 left-0 right-0 bg-white border-b border-gray-200 h-16 items-center px-6 z-50">
        <div className="max-w-7xl mx-auto w-full flex items-center justify-between">
          <h1 className="text-2xl font-bold text-emerald-600">Decluttr</h1>
          <div className="flex space-x-1">
            {navItems.map(({ to, label, icon: Icon, activeIcon: ActiveIcon }) => (
              <NavLink
                key={to}
                to={to}
                className={({ isActive }) =>
                  `flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
                    isActive ? 'bg-emerald-50 text-emerald-600' : 'text-gray-600 hover:bg-gray-100'
                  }`
                }
              >
                {({ isActive }) => (
                  <>
                    {isActive ? <ActiveIcon className="h-5 w-5" /> : <Icon className="h-5 w-5" />}
                    <span className="text-sm font-medium">{label}</span>
                  </>
                )}
              </NavLink>
            ))}
          </div>
          <div className="w-32">{/* Spacer for alignment */}</div>
        </div>
      </nav>

      {/* Mobile: Show as bottom navigation */}
      <nav className="md:hidden fixed bottom-0 w-full bg-white border-t border-gray-200 z-50">
        <div className="flex justify-around items-center h-16">
          {navItems.map(({ to, label, icon: Icon, activeIcon: ActiveIcon }) => (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) =>
                `flex flex-col items-center space-y-1 ${
                  isActive ? 'text-emerald-600' : 'text-gray-500 hover:text-emerald-600'
                }`
              }
            >
              {({ isActive }) => (
                <>
                  {isActive ? <ActiveIcon className="h-6 w-6" /> : <Icon className="h-6 w-6" />}
                  <span className="text-xs">{label}</span>
                </>
              )}
            </NavLink>
          ))}
        </div>
      </nav>
    </>
  );
}