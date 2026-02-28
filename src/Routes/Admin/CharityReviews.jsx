import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { StarIcon, CalendarIcon } from '@heroicons/react/24/outline';
import api from '../../lib/API/Client/client';

export default function CharityReviews() {
  const { data: reviews, isLoading } = useQuery({
    queryKey: ['charity-reviews'],
    queryFn: () => api.get('/charity-reviews').then(res => res.data),
  });

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600"></div>
      </div>
    );
  }

  return (
    <div className="py-6">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Charity Reviews</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {reviews?.map((review) => (
          <div key={review.id} className="bg-white rounded-lg shadow-lg overflow-hidden">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-gray-900">{review.charityName}</h2>
                <span className="bg-emerald-100 text-emerald-800 px-2 py-1 rounded-full text-xs">
                  {review.batchSize} items
                </span>
              </div>

              <p className="text-gray-600 mb-4 line-clamp-3">{review.text}</p>

              {review.photos?.length > 0 && (
                <div className="grid grid-cols-3 gap-2 mb-4">
                  {review.photos.slice(0, 3).map((photo, index) => (
                    <img
                      key={index}
                      src={photo}
                      alt={`Review ${index + 1}`}
                      className="w-full h-16 object-cover rounded"
                    />
                  ))}
                </div>
              )}

              <div className="flex items-center justify-between text-sm text-gray-500">
                <div className="flex items-center">
                  <CalendarIcon className="h-4 w-4 mr-1" />
                  {new Date(review.createdAt).toLocaleDateString()}
                </div>
                <Link
                  to={`/admin/donations/${review.batchId}`}
                  className="text-emerald-600 hover:text-emerald-700"
                >
                  View Batch
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>

      {reviews?.length === 0 && (
        <div className="text-center py-12 bg-white rounded-lg shadow">
          <StarIcon className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-500">No charity reviews yet</p>
        </div>
      )}
    </div>
  );
}