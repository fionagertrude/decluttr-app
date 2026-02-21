import { Link, useNavigate } from 'react-router-dom'
import { useState } from 'react'
import { MagnifyingGlassIcon, UserCircleIcon } from '@heroicons/react/24/outline'
import { useAuth } from '../../features/auth/AuthProvider'

export default function TopBar() {
  const { user, signOut } = useAuth()
  const navigate = useNavigate()
  const [showMenu, setShowMenu] = useState(false)

  return (
    <nav className="fixed top-0 w-full bg-emerald-600 text-white shadow-lg z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link to="/feed" className="flex items-center space-x-2">
            <span className="text-2xl font-bold">Decluttr</span>
          </Link>

          <div className="flex-1 max-w-xl mx-4">
            <div className="relative">
              <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-emerald-300" />
              <input
                type="text"
                placeholder="Search items..."
                className="w-full pl-10 pr-4 py-2 rounded-lg bg-emerald-500 text-white placeholder-emerald-300 focus:outline-none focus:ring-2 focus:ring-white"
                onFocus={() => navigate('/search')}
              />
            </div>
          </div>

          <div className="relative">
            <button
              onClick={() => setShowMenu(!showMenu)}
              className="flex items-center space-x-2 hover:bg-emerald-700 px-3 py-2 rounded-lg transition-colors"
            >
              <UserCircleIcon className="h-6 w-6" />
              <span className="hidden md:block">{user?.email}</span>
            </button>

            {showMenu && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg py-1 text-gray-700">
                <Link
                  to="/profile"
                  className="block px-4 py-2 hover:bg-emerald-50"
                  onClick={() => setShowMenu(false)}
                >
                  Profile
                </Link>
                <Link
                  to="/my-listings"
                  className="block px-4 py-2 hover:bg-emerald-50"
                  onClick={() => setShowMenu(false)}
                >
                  My Listings
                </Link>
                <Link
                  to="/purchases"
                  className="block px-4 py-2 hover:bg-emerald-50"
                  onClick={() => setShowMenu(false)}
                >
                  Purchases
                </Link>
                <Link
                  to="/sales"
                  className="block px-4 py-2 hover:bg-emerald-50"
                  onClick={() => setShowMenu(false)}
                >
                  Sales
                </Link>
                <button
                  onClick={() => {
                    signOut()
                    setShowMenu(false)
                  }}
                  className="block w-full text-left px-4 py-2 hover:bg-emerald-50 text-red-600"
                >
                  Sign Out
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  )
}