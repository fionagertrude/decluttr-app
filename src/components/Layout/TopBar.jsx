import { Link, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { 
  MagnifyingGlassIcon, 
  UserCircleIcon,
  ChevronDownIcon,
  PlusCircleIcon,
  ShoppingBagIcon,
  ChatBubbleLeftIcon,
  ArrowRightOnRectangleIcon
} from '@heroicons/react/24/outline';
import { useAuth } from '../../features/auth/AuthProvider';

export default function TopBar() {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const [showMenu, setShowMenu] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery)}`);
    }
  };

  const menuItems = [
    { label: 'Sell an Item', icon: PlusCircleIcon, onClick: () => navigate('/post'), requiresAuth: false },
    { label: 'My Orders', icon: ShoppingBagIcon, onClick: () => navigate('/purchases'), requiresAuth: true },
    { label: 'Messages', icon: ChatBubbleLeftIcon, onClick: () => navigate('/inbox'), requiresAuth: true },
    { label: 'Profile', icon: UserCircleIcon, onClick: () => navigate('/profile'), requiresAuth: false },
  ];

  const getDisplayName = () => {
    if (user?.email) {
      return user.email.split('@')[0] || 'Profile';
    }
    return 'Guest';
  };

  const handleMenuItemClick = (item) => {
    if (item.requiresAuth && !user) {
      navigate('/login');
    } else {
      item.onClick();
    }
    setShowMenu(false);
  };

  return (
    <nav className="fixed top-0 w-full bg-emerald-600 shadow-lg z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo with Bigger Green Emoji */}
          <Link to="/feed" className="flex items-center space-x-3 group">
            {/* Bigger recycling emoji - natural green color */}
            <span className="text-3xl">  {/* Increased from text-2xl to text-3xl */}
              ♻️
            </span>
            
            {/* Brand Name - Pure white */}
            <span className="text-2xl font-bold text-white tracking-tight">
              Decluttr
            </span>
          </Link>

          {/* Search Bar - Slightly translucent */}
          <div className="flex-1 max-w-xl mx-8">
            <form onSubmit={handleSearch} className="relative">
              <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-white/60" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search items..."
                className="w-full pl-10 pr-4 py-2 bg-white/20 backdrop-blur-sm text-white placeholder-white/60 border border-white/30 rounded-lg focus:ring-2 focus:ring-white/50 focus:border-transparent transition-colors"
              />
            </form>
          </div>

          {/* Profile/Guest Button */}
          <div className="relative">
            <button
              onClick={() => setShowMenu(!showMenu)}
              className="flex items-center space-x-3 px-4 py-2 rounded-lg bg-white/10 hover:bg-white/20 transition-colors text-white"
            >
              <UserCircleIcon className="h-5 w-5" />
              <span className="font-medium">{getDisplayName()}</span>
              <ChevronDownIcon className={`h-4 w-4 transition-transform ${showMenu ? 'rotate-180' : ''}`} />
            </button>

            {/* Dropdown Menu */}
            {showMenu && (
              <div className="absolute right-0 mt-2 w-64 bg-white rounded-lg shadow-xl py-1 border border-gray-200">
                {/* User Info */}
                <div className="px-4 py-3 border-b border-gray-100">
                  <p className="text-sm font-medium text-gray-900">
                    {user?.email || 'Not signed in'}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    {user ? 'Manage your account' : 'Sign in to access all features'}
                  </p>
                </div>

                {/* All Menu Items */}
                <div className="py-1">
                  {menuItems.map((item, index) => (
                    <button
                      key={index}
                      onClick={() => handleMenuItemClick(item)}
                      className="w-full flex items-center space-x-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                    >
                      <item.icon className="h-5 w-5 text-gray-500" />
                      <span>{item.label}</span>
                      {item.requiresAuth && !user && (
                        <span className="ml-auto text-xs text-emerald-600">(Sign in)</span>
                      )}
                    </button>
                  ))}
                </div>

                {/* Sign Out (for logged in users) */}
                {user && (
                  <div className="border-t border-gray-100">
                    <button
                      onClick={() => {
                        signOut();
                        setShowMenu(false);
                      }}
                      className="w-full flex items-center space-x-3 px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
                    >
                      <ArrowRightOnRectangleIcon className="h-5 w-5" />
                      <span>Sign Out</span>
                    </button>
                  </div>
                )}

                {/* Sign In/Up for guests */}
                {!user && (
                  <div className="border-t border-gray-100">
                    <button
                      onClick={() => {
                        navigate('/login');
                        setShowMenu(false);
                      }}
                      className="w-full flex items-center space-x-3 px-4 py-2 text-sm text-emerald-600 hover:bg-emerald-50 transition-colors"
                    >
                      <UserCircleIcon className="h-5 w-5" />
                      <span>Sign In</span>
                    </button>
                    <button
                      onClick={() => {
                        navigate('/register');
                        setShowMenu(false);
                      }}
                      className="w-full flex items-center space-x-3 px-4 py-2 text-sm text-emerald-600 hover:bg-emerald-50 transition-colors"
                    >
                      <PlusCircleIcon className="h-5 w-5" />
                      <span>Create Account</span>
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}