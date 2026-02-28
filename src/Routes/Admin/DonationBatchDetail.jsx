import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery, useMutation } from '@tanstack/react-query';
import {
  BuildingLibraryIcon,
  CalendarIcon,
  TruckIcon,
  PlusIcon,
  PhotoIcon,
  DocumentTextIcon
} from '@heroicons/react/24/outline';
import api from '../../lib/API/Client/client';
import toast from 'react-hot-toast';

export default function DonationBatchDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [showAddItems, setShowAddItems] = useState(false);
  const [showCharityReview, setShowCharityReview] = useState(false);
  const [selectedItems, setSelectedItems] = useState([]);
  const [review, setReview] = useState({
    text: '',
    photos: []
  });

  const { data: batch, refetch } = useQuery({
    queryKey: ['donation-batch', id],
    queryFn: () => api.get(`/donation-batches/${id}`).then(res => res.data),
  });

  const { data: availableListings } = useQuery({
    queryKey: ['donation-listings'],
    queryFn: () => api.get('/listings?disposition=donate&status=active').then(res => res.data),
  });

  const addItemsMutation = useMutation({
    mutationFn: (itemIds) => api.post(`/donation-batches/${id}/items`, { itemIds }),
    onSuccess: () => {
      toast.success('Items added to batch!');
      setShowAddItems(false);
      refetch();
    },
  });

  const updateStatusMutation = useMutation({
    mutationFn: (status) => api.patch(`/donation-batches/${id}`, { status }),
    onSuccess: () => {
      toast.success('Batch status updated!');
      refetch();
    },
  });

  const submitReviewMutation = useMutation({
    mutationFn: (reviewData) => api.post(`/donation-batches/${id}/review`, reviewData),
    onSuccess: () => {
      toast.success('Charity review submitted!');
      setShowCharityReview(false);
      refetch();
    },
  });

  const getStatusBadge = (status) => {
    switch(status) {
      case 'scheduled':
        return <span className="bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full text-sm">Scheduled</span>;
      case 'collected':
        return <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm">Collected</span>;
      case 'delivered':
        return <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm">Delivered</span>;
      default:
        return null;
    }
  };

  if (!batch) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600"></div>
      </div>
    );
  }

  return (
    <div className="py-6">
      {/* Header */}
      <div className="flex justify-between items-start mb-6">
        <div>
          <div className="flex items-center space-x-3 mb-2">
            <h1 className="text-2xl font-bold text-gray-900">{batch.charityName}</h1>
            {getStatusBadge(batch.status)}
          </div>
          <p className="text-gray-600">{batch.notes}</p>
        </div>
        <button
          onClick={() => navigate('/admin/donations')}
          className="btn-secondary"
        >
          Back to Batches
        </button>
      </div>

      {/* Info Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-white rounded-lg shadow p-4">
          <div className="flex items-center text-emerald-600 mb-2">
            <CalendarIcon className="h-5 w-5 mr-2" />
            <span className="font-medium">Pickup Date</span>
          </div>
          <p className="text-lg">{new Date(batch.pickupDate).toLocaleDateString()}</p>
        </div>

        <div className="bg-white rounded-lg shadow p-4">
          <div className="flex items-center text-emerald-600 mb-2">
            <BuildingLibraryIcon className="h-5 w-5 mr-2" />
            <span className="font-medium">Items</span>
          </div>
          <p className="text-lg">{batch.items?.length || 0} items donated</p>
        </div>

        <div className="bg-white rounded-lg shadow p-4">
          <div className="flex items-center text-emerald-600 mb-2">
            <TruckIcon className="h-5 w-5 mr-2" />
            <span className="font-medium">Status</span>
          </div>
          <p className="text-lg capitalize">{batch.status}</p>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex space-x-3 mb-6">
        {batch.status === 'scheduled' && (
          <>
            <button
              onClick={() => setShowAddItems(true)}
              className="btn-primary flex items-center space-x-2"
            >
              <PlusIcon className="h-5 w-5" />
              <span>Add Items</span>
            </button>
            <button
              onClick={() => updateStatusMutation.mutate('collected')}
              className="btn-secondary"
            >
              Mark as Collected
            </button>
          </>
        )}
        
        {batch.status === 'collected' && (
          <button
            onClick={() => updateStatusMutation.mutate('delivered')}
            className="btn-primary"
          >
            Mark as Delivered
          </button>
        )}

        {batch.status === 'delivered' && !batch.review && (
          <button
            onClick={() => setShowCharityReview(true)}
            className="btn-primary"
          >
            Add Charity Review
          </button>
        )}
      </div>

      {/* Items List */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">Donated Items</h2>
        </div>
        
        {batch.items?.length === 0 ? (
          <div className="p-12 text-center">
            <BuildingLibraryIcon className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500">No items added to this batch yet</p>
            {batch.status === 'scheduled' && (
              <button
                onClick={() => setShowAddItems(true)}
                className="mt-4 btn-primary"
              >
                Add Items
              </button>
            )}
          </div>
        ) : (
          <div className="divide-y divide-gray-200">
            {batch.items?.map((item) => (
              <div key={item.id} className="p-4 flex items-center space-x-4">
                <img
                  src={item.photos?.[0] || 'https://via.placeholder.com/60'}
                  alt={item.title}
                  className="w-16 h-16 object-cover rounded"
                />
                <div className="flex-1">
                  <h3 className="font-medium text-gray-900">{item.title}</h3>
                  <p className="text-sm text-gray-500">Donated by: {item.donor?.name}</p>
                </div>
                <span className="text-sm text-gray-500">{item.condition}</span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Charity Review Section */}
      {batch.review && (
        <div className="mt-6 bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Charity Review</h2>
          <div className="bg-emerald-50 p-4 rounded-lg">
            <p className="text-gray-700 mb-3">{batch.review.text}</p>
            {batch.review.photos?.length > 0 && (
              <div className="grid grid-cols-4 gap-2">
                {batch.review.photos.map((photo, index) => (
                  <img
                    key={index}
                    src={photo}
                    alt={`Review ${index + 1}`}
                    className="w-full h-20 object-cover rounded"
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Add Items Modal */}
      {showAddItems && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-2xl w-full max-h-[80vh] overflow-y-auto">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Add Items to Batch</h2>
            
            <div className="space-y-3 mb-4">
              {availableListings?.map((listing) => (
                <label key={listing.id} className="flex items-center p-3 border rounded-lg hover:bg-gray-50">
                  <input
                    type="checkbox"
                    value={listing.id}
                    onChange={(e) => {
                      if (e.target.checked) {
                        setSelectedItems([...selectedItems, listing.id]);
                      } else {
                        setSelectedItems(selectedItems.filter(id => id !== listing.id));
                      }
                    }}
                    className="h-4 w-4 text-emerald-600 rounded"
                  />
                  <div className="ml-3 flex items-center space-x-3 flex-1">
                    <img
                      src={listing.photos?.[0] || 'https://via.placeholder.com/40'}
                      alt={listing.title}
                      className="w-10 h-10 object-cover rounded"
                    />
                    <div>
                      <p className="font-medium">{listing.title}</p>
                      <p className="text-sm text-gray-500">Donor: {listing.seller?.name}</p>
                    </div>
                  </div>
                </label>
              ))}
            </div>

            <div className="flex space-x-3">
              <button
                onClick={() => setShowAddItems(false)}
                className="flex-1 btn-secondary"
              >
                Cancel
              </button>
              <button
                onClick={() => addItemsMutation.mutate(selectedItems)}
                disabled={selectedItems.length === 0}
                className="flex-1 btn-primary disabled:opacity-50"
              >
                Add Selected ({selectedItems.length})
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Charity Review Modal */}
      {showCharityReview && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-lg w-full">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Add Charity Review</h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Review Text
                </label>
                <textarea
                  value={review.text}
                  onChange={(e) => setReview({ ...review, text: e.target.value })}
                  placeholder="Share how these donations helped..."
                  rows="4"
                  className="input-field"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Photos
                </label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center">
                  <input
                    type="file"
                    accept="image/*"
                    multiple
                    className="hidden"
                    id="review-photos"
                    onChange={(e) => {
                      const files = Array.from(e.target.files);
                      const newPhotos = files.map(file => URL.createObjectURL(file));
                      setReview({ ...review, photos: [...review.photos, ...newPhotos] });
                    }}
                  />
                  <label htmlFor="review-photos" className="cursor-pointer">
                    <PhotoIcon className="mx-auto h-8 w-8 text-gray-400" />
                    <p className="text-sm text-gray-600">Click to upload photos</p>
                  </label>
                </div>
                {review.photos.length > 0 && (
                  <div className="grid grid-cols-4 gap-2 mt-2">
                    {review.photos.map((photo, index) => (
                      <img key={index} src={photo} alt="Review" className="w-full h-16 object-cover rounded" />
                    ))}
                  </div>
                )}
              </div>

              <div className="flex space-x-3 pt-4">
                <button
                  onClick={() => setShowCharityReview(false)}
                  className="flex-1 btn-secondary"
                >
                  Cancel
                </button>
                <button
                  onClick={() => submitReviewMutation.mutate(review)}
                  disabled={!review.text}
                  className="flex-1 btn-primary disabled:opacity-50"
                >
                  Submit Review
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}