import { useState } from 'react';
import { 
  UserCircleIcon, 
  ShoppingBagIcon, 
  HeartIcon, 
  Cog6ToothIcon,
  ClockIcon,
  StarIcon
} from '@heroicons/react/24/outline';

export default function Profile() {
  const [activeTab, setActiveTab] = useState('listings');

  // Mock user data - replace with real data from your auth
  const user = {
    name: "John Doe",
    email: "john.doe@example.com",
    joinDate: "January 2025",
    rating: 4.8,
    totalListings: 12,
    totalSales: 8,
    profileImage: null
  };

  const stats = [
    { label: 'Listings', value: user.totalListings, icon: ShoppingBagIcon },
    { label: 'Sales', value: user.totalSales, icon: StarIcon },
    { label: 'Rating', value: user.rating, icon: StarIcon },
    { label: 'Member since', value: user.joinDate, icon: ClockIcon },
  ];

  const tabs = [
    { id: 'listings', label: 'My Listings', icon: ShoppingBagIcon },
    { id: 'saved', label: 'Saved Items', icon: HeartIcon },
    { id: 'settings', label: 'Settings', icon: Cog6ToothIcon },
  ];

  return (
    <div className="max-w-4xl mx-auto py-6">
      {/* Profile Header */}
      <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
        <div className="flex items-start space-x-6">
          {/* Profile Image */}
          <div className="relative">
            {user.profileImage ? (
              <img 
                src={user.profileImage} 
                alt={user.name}
                className="w-24 h-24 rounded-full object-cover border-4 border-emerald-100"
              />
            ) : (
              <div className="w-24 h-24 rounded-full bg-emerald-100 flex items-center justify-center border-4 border-emerald-200">
                <span className="text-3xl text-emerald-600">
                  {user.name.charAt(0).toUpperCase()}
                </span>
              </div>
            )}
            <button className="absolute bottom-0 right-0 bg-emerald-600 text-white p-1.5 rounded-full hover:bg-emerald-700">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </button>
          </div>

          {/* User Info */}
          <div className="flex-1">
            <h1 className="text-2xl font-bold text-gray-900">{user.name}</h1>
            <p className="text-gray-600">{user.email}</p>
            
            {/* Stats Grid */}
            <div className="grid grid-cols-4 gap-4 mt-4">
              {stats.map((stat, index) => (
                <div key={index} className="text-center">
                  <div className="text-lg font-semibold text-emerald-600">{stat.value}</div>
                  <div className="text-xs text-gray-500">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Edit Profile Button */}
          <button className="btn-secondary text-sm">
            Edit Profile
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-lg shadow-lg overflow-hidden">
        <div className="border-b border-gray-200">
          <nav className="flex -mb-px">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex-1 py-4 px-1 text-center border-b-2 font-medium text-sm ${
                    activeTab === tab.id
                      ? 'border-emerald-600 text-emerald-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <Icon className="h-5 w-5 mx-auto mb-1" />
                  {tab.label}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Tab Content */}
        <div className="p-6">
          {activeTab === 'listings' && (
            <div className="text-center text-gray-500 py-8">
              <ShoppingBagIcon className="h-12 w-12 mx-auto text-gray-400 mb-3" />
              <p>You haven't listed any items yet</p>
              <button className="mt-4 btn-primary text-sm">
                Post Your First Item
              </button>
            </div>
          )}

          {activeTab === 'saved' && (
            <div className="text-center text-gray-500 py-8">
              <HeartIcon className="h-12 w-12 mx-auto text-gray-400 mb-3" />
              <p>No saved items yet</p>
              <p className="text-sm">Items you save will appear here</p>
            </div>
          )}

          {activeTab === 'settings' && (
            <div className="space-y-4">
              <h3 className="font-semibold text-gray-900">Account Settings</h3>
              
              <div className="space-y-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Display Name
                  </label>
                  <input 
                    type="text" 
                    value={user.name}
                    className="input-field"
                    readOnly
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Email
                  </label>
                  <input 
                    type="email" 
                    value={user.email}
                    className="input-field"
                    readOnly
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Phone Number
                  </label>
                  <input 
                    type="tel" 
                    placeholder="Add phone number"
                    className="input-field"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Location
                  </label>
                  <input 
                    type="text" 
                    placeholder="Your city"
                    className="input-field"
                  />
                </div>

                <button className="btn-primary w-full">
                  Save Changes
                </button>

                <button className="text-red-600 text-sm hover:text-red-700 mt-4">
                  Sign Out
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Account Actions */}
      <div className="mt-6 bg-white rounded-lg shadow-lg p-4">
        <h3 className="font-semibold text-gray-900 mb-3">Account</h3>
        <div className="space-y-2">
          <button className="w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-50 rounded-lg">
            Payment Methods
          </button>
          <button className="w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-50 rounded-lg">
            Purchase History
          </button>
          <button className="w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-50 rounded-lg">
            Sales History
          </button>
          <button className="w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-50 rounded-lg">
            Notifications
          </button>
          <button className="w-full text-left px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg">
            Delete Account
          </button>
        </div>
      </div>
    </div>
  );
}