import { Link } from 'react-router-dom';
import { MapPinIcon, HeartIcon } from '@heroicons/react/24/outline';
import { HeartIcon as HeartIconSolid } from '@heroicons/react/24/solid';
import { useState } from 'react';

export default function ListingCard({ listing }) {
  const [isLiked, setIsLiked] = useState(false);

  const getDispositionBadge = () => {
    switch(listing.disposition) {
      case 'sell':
        return <span className="bg-emerald-100 text-emerald-800 px-2 py-1 rounded-full text-xs font-medium">For Sale</span>;
      case 'donate':
        return <span className="bg-red-100 text-red-800 px-2 py-1 rounded-full text-xs font-medium">Donation</span>;
      case 'recycle':
        return <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs font-medium">Recycle</span>;
      default:
        return null;
    }
  };

  const getConditionColor = () => {
    switch(listing.condition?.toLowerCase()) {
      case 'new':
        return 'bg-green-100 text-green-800';
      case 'like new':
        return 'bg-blue-100 text-blue-800';
      case 'good':
        return 'bg-yellow-100 text-yellow-800';
      case 'fair':
        return 'bg-orange-100 text-orange-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <Link to={`/listing/${listing.id}`} className="block group">
      <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
        {/* Image */}
        <div className="relative aspect-square">
          <img
            src={listing.photos?.[0] || 'https://picsum.photos/400/400?random=' + listing.id}
            alt={listing.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            onError={(e) => {
              e.target.src = 'https://picsum.photos/400/400?random=' + listing.id;
            }}
          />
          <button
            onClick={(e) => {
              e.preventDefault();
              setIsLiked(!isLiked);
            }}
            className="absolute top-2 right-2 p-2 bg-white rounded-full shadow-md hover:bg-gray-100 transition-colors"
          >
            {isLiked ? (
              <HeartIconSolid className="h-5 w-5 text-red-500" />
            ) : (
              <HeartIcon className="h-5 w-5 text-gray-600" />
            )}
          </button>
          <div className="absolute top-2 left-2">
            {getDispositionBadge()}
          </div>
        </div>

        {/* Content */}
        <div className="p-4">
          <h3 className="font-semibold text-gray-900 mb-1 line-clamp-1">{listing.title}</h3>
          
          <div className="flex items-center justify-between mb-2">
            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getConditionColor()}`}>
              {listing.condition}
            </span>
            {listing.disposition === 'sell' && listing.price && (
              <span className="text-lg font-bold text-emerald-600">
                KSh {listing.price.toLocaleString()}
              </span>
            )}
          </div>

          <div className="flex items-center text-sm text-gray-500">
            <MapPinIcon className="h-4 w-4 mr-1 flex-shrink-0" />
            <span className="truncate">{listing.location || 'Location not specified'}</span>
          </div>

          <div className="mt-3 flex items-center justify-between text-sm">
            <span className="text-gray-500">{listing.timeAgo || 'Just now'}</span>
            <span className="text-emerald-600 font-medium">
              {listing.views || 0} views
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
}