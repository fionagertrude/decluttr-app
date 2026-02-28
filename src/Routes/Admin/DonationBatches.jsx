import { useState } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import {
  CalendarIcon,
  BuildingLibraryIcon,
  PlusIcon,
  TruckIcon,
  CheckCircleIcon,
  ClockIcon
} from '@heroicons/react/24/outline';
import api from '../../lib/API/Client/client';
import toast from 'react-hot-toast';

export default function DonationBatches() {
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newBatch, setNewBatch] = useState({
    charityName: '',
    pickupDate: '',
    notes: ''
  });

  const { data: batches, refetch } = useQuery({
    queryKey: ['donation-batches'],
    queryFn: () => api.get('/donation-batches').then(res => res.data),
  });

  const createBatchMutation = useMutation({
    mutationFn: (data) => api.post('/donation-batches', data),
    onSuccess: () => {
      toast.success('Donation batch created!');
      setShowCreateModal(false);
      refetch();
    },
  });

  const updateStatusMutation = useMutation({
    mutationFn: ({ id, status }) => api.patch(`/donation-batches/${id}`, { status }),
    onSuccess: () => {
      toast.success('Batch status updated!');
      refetch();
    },
  });

  const getStatusBadge = (status) => {
    switch(status) {
      case 'scheduled':
        return <span className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full text-xs flex items-center"><ClockIcon className="h-3 w-3 mr-1" />Scheduled</span>;
      case 'collected':
        return <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs flex items-center"><TruckIcon className="h-3 w-3 mr-1" />Collected</span>;
      case 'delivered':
        return <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs flex items-center"><CheckCircleIcon className="h-3 w-3 mr-1" />Delivered</span>;
      default:
        return null;
    }
  };

  return (
    <div className="py-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Donation Batches</h1>
          <p className="text-gray-600">Manage charity collections and deliveries</p>
        </div>
        <button
          onClick={() => setShowCreateModal(true)}
          className="btn-primary flex items-center space-x-2"
        >
          <PlusIcon className="h-5 w-5" />
          <span>New Batch</span>
        </button>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white rounded-lg shadow p-4">
          <div className="text-2xl font-bold text-emerald-600">{batches?.length || 0}</div>
          <div className="text-sm text-gray-600">Total Batches</div>
        </div>
        <div className="bg-white rounded-lg shadow p-4">
          <div className="text-2xl font-bold text-yellow-600">
            {batches?.filter(b => b.status === 'scheduled').length || 0}
          </div>
          <div className="text-sm text-gray-600">Scheduled</div>
        </div>
        <div className="bg-white rounded-lg shadow p-4">
          <div className="text-2xl font-bold text-blue-600">
            {batches?.filter(b => b.status === 'collected').length || 0}
          </div>
          <div className="text-sm text-gray-600">Collected</div>
        </div>
        <div className="bg-white rounded-lg shadow p-4">
          <div className="text-2xl font-bold text-green-600">
            {batches?.filter(b => b.status === 'delivered').length || 0}
          </div>
          <div className="text-sm text-gray-600">Delivered</div>
        </div>
      </div>

      {/* Batches List */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Charity
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Pickup Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Items
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {batches?.map((batch) => (
                <tr key={batch.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <div className="font-medium text-gray-900">{batch.charityName}</div>
                    <div className="text-sm text-gray-500">{batch.notes}</div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center">
                      <CalendarIcon className="h-4 w-4 text-gray-400 mr-2" />
                      <span>{new Date(batch.pickupDate).toLocaleDateString()}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-sm font-medium">{batch.itemCount || 0} items</span>
                  </td>
                  <td className="px-6 py-4">
                    {getStatusBadge(batch.status)}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex space-x-2">
                      <Link
                        to={`/admin/donations/${batch.id}`}
                        className="text-emerald-600 hover:text-emerald-700 text-sm font-medium"
                      >
                        View
                      </Link>
                      {batch.status === 'scheduled' && (
                        <>
                          <button
                            onClick={() => updateStatusMutation.mutate({ id: batch.id, status: 'collected' })}
                            className="text-blue-600 hover:text-blue-700 text-sm font-medium"
                          >
                            Mark Collected
                          </button>
                          <button
                            onClick={() => {/* Add items modal */}}
                            className="text-gray-600 hover:text-gray-700 text-sm font-medium"
                          >
                            Add Items
                          </button>
                        </>
                      )}
                      {batch.status === 'collected' && (
                        <button
                          onClick={() => updateStatusMutation.mutate({ id: batch.id, status: 'delivered' })}
                          className="text-green-600 hover:text-green-700 text-sm font-medium"
                        >
                          Mark Delivered
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Create Batch Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Create Donation Batch</h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Charity Name *
                </label>
                <input
                  type="text"
                  value={newBatch.charityName}
                  onChange={(e) => setNewBatch({ ...newBatch, charityName: e.target.value })}
                  placeholder="e.g., Red Cross, Salvation Army"
                  className="input-field"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Pickup Date *
                </label>
                <input
                  type="date"
                  value={newBatch.pickupDate}
                  onChange={(e) => setNewBatch({ ...newBatch, pickupDate: e.target.value })}
                  className="input-field"
                  min={new Date().toISOString().split('T')[0]}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Notes
                </label>
                <textarea
                  value={newBatch.notes}
                  onChange={(e) => setNewBatch({ ...newBatch, notes: e.target.value })}
                  placeholder="Special instructions or notes..."
                  rows="3"
                  className="input-field"
                />
              </div>

              <div className="bg-yellow-50 p-3 rounded-lg">
                <p className="text-sm text-yellow-700">
                  After creating the batch, you can add donated items to it.
                </p>
              </div>

              <div className="flex space-x-3 pt-4">
                <button
                  onClick={() => setShowCreateModal(false)}
                  className="flex-1 btn-secondary"
                >
                  Cancel
                </button>
                <button
                  onClick={() => createBatchMutation.mutate(newBatch)}
                  disabled={!newBatch.charityName || !newBatch.pickupDate}
                  className="flex-1 btn-primary disabled:opacity-50"
                >
                  Create Batch
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}