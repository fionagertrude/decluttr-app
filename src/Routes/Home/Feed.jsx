import { useQuery } from '@tanstack/react-query';
import { useState } from 'react';
import { FunnelIcon } from '@heroicons/react/24/outline';
import ListingCard from '../../components/Listing/ListingCard';

// Mock data with the ORIGINAL working images
const mockListings = [
  {
    id: 1,
    title: "iPhone 13 Pro",
    price: 85000,
    condition: "good",
    disposition: "sell",
    location: "Nairobi",
    photos: ["https://images.pexels.com/photos/788946/pexels-photo-788946.jpeg?auto=compress&cs=tinysrgb&w=400&h=400&fit=crop"],
    timeAgo: "2 hours ago",
    views: 45
  },
  {
    id: 2,
    title: "Leather Sofa",
    price: 45000,
    condition: "like new",
    disposition: "sell",
    location: "Mombasa",
    photos: ["https://images.pexels.com/photos/1866149/pexels-photo-1866149.jpeg?auto=compress&cs=tinysrgb&w=400&h=400&fit=crop"],
    timeAgo: "5 hours ago",
    views: 23
  },
  {
    id: 3,
    title: "Children's Books",
    condition: "good",
    disposition: "donate",
    location: "Nairobi",
    photos: ["https://images.pexels.com/photos/159711/books-bookstore-book-reading-159711.jpeg?auto=compress&cs=tinysrgb&w=400&h=400&fit=crop"],
    timeAgo: "1 day ago",
    views: 12
  },
  {
    id: 4,
    title: "Mountain Bike",
    price: 35000,
    condition: "fair",
    disposition: "sell",
    location: "Kisumu",
    photos: ["https://images.pexels.com/photos/100582/pexels-photo-100582.jpeg?auto=compress&cs=tinysrgb&w=400&h=400&fit=crop"],
    timeAgo: "3 days ago",
    views: 34
  },
  {
    id: 5,
    title: "Old Newspapers",
    condition: "fair",
    disposition: "recycle",
    location: "Nairobi",
    photos: ["https://images.pexels.com/photos/15139464/pexels-photo-15139464.jpeg"],
    timeAgo: "1 week ago",
    views: 8
  },
  {
    id: 6,
    title: "Winter Jacket",
    price: 2500,
    condition: "good",
    disposition: "sell",
    location: "Nakuru",
    photos: ["https://images.unsplash.com/photo-1539533113208-f6df8cc8b543?w=400&h=400&fit=crop"],
    timeAgo: "2 days ago",
    views: 19
  }
];

export default function Feed() {
  const [activeFilter, setActiveFilter] = useState('all');
  
  const { data: listings, isLoading } = useQuery({
    queryKey: ['feed', activeFilter],
    queryFn: async () => {
      await new Promise(resolve => setTimeout(resolve, 500));
      if (activeFilter === 'all') return mockListings;
      return mockListings.filter(item => item.disposition === activeFilter);
    },
  });

  const filters = [
    { id: 'all', label: 'All' },
    { id: 'sell', label: 'For Sale' },
    { id: 'donate', label: 'Donation' },
    { id: 'recycle', label: 'Recycle' },
  ];

  if (isLoading) {
    return (
      <div className="py-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="animate-pulse">
              <div className="bg-gray-200 h-48 rounded-t-lg"></div>
              <div className="bg-white p-4 rounded-b-lg space-y-3">
                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                <div className="h-4 bg-gray-200 rounded w-2/3"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="py-6">
      {/* Header with filter only - NO SEARCH BAR HERE */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Browse Items</h1>
        <button className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50 flex items-center space-x-2">
          <FunnelIcon className="h-5 w-5 text-gray-600" />
          <span className="text-sm hidden sm:inline">Filter</span>
        </button>
      </div>

      {/* Filter Chips */}
      <div className="mb-6">
        <div className="flex space-x-2 overflow-x-auto pb-2">
          {filters.map((filter) => (
            <button
              key={filter.id}
              onClick={() => setActiveFilter(filter.id)}
              className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors ${
                activeFilter === filter.id
                  ? 'bg-emerald-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {filter.label}
            </button>
          ))}
        </div>
      </div>

      {/* Results count */}
      <div className="mb-4 text-sm text-gray-600">
        {listings?.length} items found
      </div>

      {/* Listings Grid */}
      {listings && listings.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {listings.map((listing) => (
            <ListingCard key={listing.id} listing={listing} />
          ))}
        </div>
      ) : (
        <div className="text-center py-12 bg-white rounded-lg shadow">
          <p className="text-gray-500">No items found</p>
        </div>
      )}
    </div>
  );
}