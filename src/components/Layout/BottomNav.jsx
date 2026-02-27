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
  { to: '/profile', label: 'Profile', icon: UserIcon, activeIcon: UserIconSolid }, // This is correct
];

export default function BottomNav() {
  return (
    <nav className="fixed bottom-0 w-full bg-white border-t border-gray-200 z-50">
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
                {isActive ? (
                  <ActiveIcon className="h-6 w-6" />
                ) : (
                  <Icon className="h-6 w-6" />
                )}
                <span className="text-xs">{label}</span>
              </>
            )}
          </NavLink>
        ))}
      </div>
    </nav>
  );
}