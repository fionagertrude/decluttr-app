import { NavLink } from 'react-router-dom';
import {
  HomeIcon,
  PlusCircleIcon,
  ShoppingBagIcon,
  ChatBubbleLeftIcon,
  UserIcon,
  HeartIcon,
  Cog6ToothIcon,
  ArrowRightOnRectangleIcon
} from '@heroicons/react/24/outline';
import {
  HomeIcon as HomeIconSolid,
  PlusCircleIcon as PlusCircleIconSolid,
  ShoppingBagIcon as ShoppingBagIconSolid,
  ChatBubbleLeftIcon as ChatBubbleLeftIconSolid,
  UserIcon as UserIconSolid,
} from '@heroicons/react/24/solid';
import { useAuth } from '../../features/auth/AuthProvider';

const mainNavItems = [
  { to: '/feed', label: 'Home', icon: HomeIcon, activeIcon: HomeIconSolid },
  { to: '/post', label: 'Sell', icon: PlusCircleIcon, activeIcon: PlusCircleIconSolid },
  { to: '/purchases', label: 'Orders', icon: ShoppingBagIcon, activeIcon: ShoppingBagIconSolid },
  { to: '/inbox', label: 'Messages', icon: ChatBubbleLeftIcon, activeIcon: ChatBubbleLeftIconSolid },
  { to: '/profile', label: 'Profile', icon: UserIcon, activeIcon: UserIconSolid },
];

const secondaryNavItems = [
  { to: '/saved', label: 'Saved Items', icon: HeartIcon },
  { to: '/settings', label: 'Settings', icon: Cog6ToothIcon },
];

export default function Sidebar() {
  const { user, signOut } = useAuth();

  return (
    <aside className="hidden md:flex md:flex-col fixed left-0 top-0 h-full w-64 bg-white border-r border-gray-200 shadow-lg z-40">
      {/* Logo */}
      <div className="h-16 flex items-center px-6 border-b border-gray-200">
        <h1 className="text-2xl font-bold text-emerald-600">Decluttr</h1>
      </div>

      {/* User Info */}
      <div className="p-4 border-b border-gray-200">
        <NavLink to="/profile" className="flex items-center space-x-3 hover:bg-gray-50 p-2 rounded-lg transition-colors">
          <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center">
            <span className="text-emerald-600 font-semibold">
              {user?.email?.charAt(0).toUpperCase() || 'G'}
            </span>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-gray-900 truncate">
              {user?.email || 'Guest'}
            </p>
            <p className="text-xs text-gray-500">View Profile</p>
          </div>
        </NavLink>
      </div>

      {/* Main Navigation */}
      <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
        {mainNavItems.map(({ to, label, icon: Icon, activeIcon: ActiveIcon }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              `flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
                isActive
                  ? 'bg-emerald-50 text-emerald-600'
                  : 'text-gray-700 hover:bg-gray-100'
              }`
            }
          >
            {({ isActive }) => (
              <>
                {isActive ? (
                  <ActiveIcon className="h-5 w-5" />
                ) : (
                  <Icon className="h-5 w-5" />
                )}
                <span className="font-medium">{label}</span>
              </>
            )}
          </NavLink>
        ))}
      </nav>

      {/* Secondary Navigation */}
      <div className="p-4 border-t border-gray-200">
        <nav className="space-y-1">
          {secondaryNavItems.map(({ to, label, icon: Icon }) => (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) =>
                `flex items-center space-x-3 px-4 py-2 rounded-lg transition-colors ${
                  isActive
                    ? 'bg-emerald-50 text-emerald-600'
                    : 'text-gray-600 hover:bg-gray-100'
                }`
              }
            >
              <Icon className="h-5 w-5" />
              <span className="text-sm">{label}</span>
            </NavLink>
          ))}
          
          <button
            onClick={signOut}
            className="w-full flex items-center space-x-3 px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
          >
            <ArrowRightOnRectangleIcon className="h-5 w-5" />
            <span className="text-sm">Sign Out</span>
          </button>
        </nav>
      </div>
    </aside>
  );
}