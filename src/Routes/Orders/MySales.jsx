import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { 
  CurrencyDollarIcon,
  ClockIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
  EyeIcon
} from '@heroicons/react/24/outline';
import api from '../../lib/API/Client/client';

export default function MySales() {
  const { data: orders, isLoading, refetch } = useQuery({
    queryKey: ['my-sales'],
    queryFn: () => api.get('/orders?role=seller').then(res => res.data),
  });

  const getStatusBadge = (status) => {
    switch(status) {
      case 'pending_payment':
        return (
          <span className="bg-yellow-100 text-yellow-800 text-xs px-2 py-1 rounded-full flex items-center w-fit">
            <ClockIcon className="h-3 w-3 mr-1" />
            Awaiting Payment
          </span>
        );
      case 'paid_in_escrow':
        return (
          <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full flex items-center w-fit">
            <CurrencyDollarIcon className="h-3 w-3 mr-1" />
            Paid - In Escrow
          </span>
        );
      case 'completed':
        return (
          <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full flex items-center w-fit">
            <CheckCircleIcon className="h-3 w-3 mr-1" />
            Completed
          </span>
        );
      case 'disputed':
        return (
          <span className="bg-red-100 text-red-800 text-xs px-2 py-1 rounded-full flex items-center w-fit">
            <ExclamationTriangleIcon className="h-3 w-3 mr-1" />
            Disputed
          </span>
        );
      default:
        return null;
    }
  };

  const getStatusProgress = (status) => {
    const steps = [
      { key: 'pending_payment', label: 'Payment', completed: false },
      { key: 'paid_in_escrow', label: 'Escrow', completed: false },
      { key: 'completed', label: 'Completed', completed: false }
    ];

    let completedCount = 0;
    if (status === 'paid_in_escrow') completedCount = 1;
    if (status === 'completed') completedCount = 2;
    if (status === 'disputed') completedCount = 0;

    return (
      <div className="flex items-center space-x-1 mt-2">
        {steps.map((step, index) => (
          <div key={step.key} className="flex items-center">
            <div className={`h-1.5 w-8 rounded-full ${
              index < completedCount ? 'bg-emerald-600' : 'bg-gray-200'
            }`} />
            {index < steps.length - 1 && (
              <div className={`h-1.5 w-1 rounded-full ${
                index < completedCount - 1 ? 'bg-emerald-600' : 'bg-gray-200'
              }`} />
            )}
          </div>
        ))}
      </div>
    );
  };

  const calculateEarnings = () => {
    if (!orders) return { total: 0, pending: 0, completed: 0 };
    
    return orders.reduce((acc, order) => {
      acc.total += order.amount || 0;
      if (order.status === 'paid_in_escrow') acc.pending += order.amount || 0;
      if (order.status === 'completed') acc.completed += order.amount || 0;
      return acc;
    }, { total: 0, pending: 0, completed: 0 });
  };

  const earnings = calculateEarnings();

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600"></div>
      </div>
    );
  }

  return (
    <div className="py-6">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">My Sales</h1>
        <p className="text-gray-600">Track your sold items and earnings</p>
      </div>

      {/* Earnings Summary */}
      {orders?.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="bg-white rounded-lg shadow p-4">
            <div className="text-sm text-gray-600 mb-1">Total Sales</div>
            <div className="text-2xl font-bold text-emerald-600">
              KSh {earnings.total.toLocaleString()}
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow p-4">
            <div className="text-sm text-gray-600 mb-1">In Escrow (Pending)</div>
            <div className="text-2xl font-bold text-blue-600">
              KSh {earnings.pending.toLocaleString()}
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow p-4">
            <div className="text-sm text-gray-600 mb-1">Completed</div>
            <div className="text-2xl font-bold text-green-600">
              KSh {earnings.completed.toLocaleString()}
            </div>
          </div>
        </div>
      )}

      {/* Sales List */}
      {orders?.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-lg shadow">
          <CurrencyDollarIcon className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h2 className="text-xl font-medium text-gray-900 mb-2">No sales yet</h2>
          <p className="text-gray-500 mb-6">When someone buys your items, they'll appear here</p>
          <Link to="/post" className="btn-primary inline-block">
            Post an Item
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {orders?.map((order) => (
            <div key={order.id} className="bg-white rounded-lg shadow hover:shadow-lg transition-shadow">
              <div className="p-4">
                <div className="flex items-start space-x-4">
                  {/* Item Image */}
                  <img
                    src={order.listing?.photos?.[0] || 'https://via.placeholder.com/80'}
                    alt={order.listing?.title}
                    className="w-20 h-20 object-cover rounded-lg"
                  />
                  
                  {/* Order Details */}
                  <div className="flex-1">
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="font-medium text-gray-900">{order.listing?.title}</h3>
                        <p className="text-sm text-gray-500">
                          Buyer: {order.buyer?.name || 'Anonymous'}
                        </p>
                        <p className="text-sm text-gray-500">
                          Order ID: #{order.id.slice(0, 8)}
                        </p>
                      </div>
                      {getStatusBadge(order.status)}
                    </div>

                    {/* Price and Date */}
                    <div className="mt-2 flex items-center justify-between">
                      <div>
                        <span className="text-emerald-600 font-bold text-lg">
                          KSh {order.amount?.toLocaleString()}
                        </span>
                        {order.status === 'paid_in_escrow' && (
                          <p className="text-xs text-blue-600 mt-1">
                            Funds held in escrow - waiting for buyer confirmation
                          </p>
                        )}
                        {order.status === 'completed' && (
                          <p className="text-xs text-green-600 mt-1">
                            Payment released on {new Date(order.completedAt).toLocaleDateString()}
                          </p>
                        )}
                      </div>
                      <span className="text-sm text-gray-500">
                        {new Date(order.createdAt).toLocaleDateString()}
                      </span>
                    </div>

                    {/* Progress Bar */}
                    {getStatusProgress(order.status)}

                    {/* Action Buttons */}
                    <div className="mt-3 flex space-x-3">
                      <Link
                        to={`/order/${order.id}`}
                        className="text-sm text-emerald-600 hover:text-emerald-700 font-medium flex items-center"
                      >
                        <EyeIcon className="h-4 w-4 mr-1" />
                        View Details
                      </Link>
                      
                      {order.status === 'paid_in_escrow' && (
                        <>
                          <Link
                            to={`/inbox?buyer=${order.buyerId}`}
                            className="text-sm text-blue-600 hover:text-blue-700 font-medium"
                          >
                            Message Buyer
                          </Link>
                          <button
                            onClick={() => {/* Handle shipping update */}}
                            className="text-sm text-gray-600 hover:text-gray-700 font-medium"
                          >
                            Update Shipping
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Help Section */}
      {orders?.length > 0 && (
        <div className="mt-8 bg-blue-50 rounded-lg p-4">
          <h3 className="font-medium text-blue-800 mb-2">💡 Understanding Your Sales</h3>
          <ul className="text-sm text-blue-700 space-y-1">
            <li>• <span className="font-medium">Awaiting Payment</span> - Buyer hasn't completed payment yet</li>
            <li>• <span className="font-medium">In Escrow</span> - Buyer paid, funds held securely until they confirm receipt</li>
            <li>• <span className="font-medium">Completed</span> - Buyer confirmed receipt, payment released to you</li>
            <li>• <span className="font-medium">Disputed</span> - Buyer reported an issue, admin will review</li>
          </ul>
        </div>
      )}
    </div>
  );
}