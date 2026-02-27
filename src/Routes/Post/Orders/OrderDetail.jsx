import { useParams } from 'react-router-dom'
import { useQuery, useMutation } from '@tanstack/react-query'
import { CheckCircleIcon } from '@heroicons/react/24/outline'
import api from '../../lib/api/client'
import { useAuth } from '../../features/auth/AuthProvider'
import toast from 'react-hot-toast'
import ConfirmReceivedButton from './ConfirmReceivedButton'

export default function OrderDetail() {
  const { id } = useParams()
  const { user } = useAuth()

  const { data: order, refetch } = useQuery({
    queryKey: ['order', id],
    queryFn: () => api.get(`/orders/${id}`).then(res => res.data),
  })

  const confirmReceivedMutation = useMutation({
    mutationFn: () => api.post(`/orders/${id}/confirm-received`),
    onSuccess: () => {
      toast.success('Payment released to seller!')
      refetch()
    },
  })

  if (!order) {
    return <div>Loading...</div>
  }

  const isBuyer = user?.id === order.buyerId

  return (
    <div className="max-w-2xl mx-auto py-8">
      <h1 className="text-2xl font-bold mb-6">Order Details</h1>

      {/* Status Timeline */}
      <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
        <div className="relative">
          {[
            { status: 'pending_payment', label: 'Payment Pending' },
            { status: 'paid_in_escrow', label: 'Paid (In Escrow)' },
            { status: 'completed', label: 'Completed' },
          ].map((step, index) => {
            const isComplete = 
              (step.status === 'pending_payment' && order.status !== 'pending_payment') ||
              (step.status === 'paid_in_escrow' && ['paid_in_escrow', 'completed'].includes(order.status)) ||
              (step.status === 'completed' && order.status === 'completed')

            return (
              <div key={step.status} className="flex items-start mb-4 last:mb-0">
                <div className="relative">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                    isComplete ? 'bg-emerald-600' : 'bg-gray-200'
                  }`}>
                    {isComplete ? (
                      <CheckCircleIcon className="h-5 w-5 text-white" />
                    ) : (
                      <span className="text-sm text-gray-600">{index + 1}</span>
                    )}
                  </div>
                  {index < 2 && (
                    <div className={`absolute top-8 left-4 w-0.5 h-12 ${
                      order.status === 'completed' ? 'bg-emerald-600' : 'bg-gray-200'
                    }`} />
                  )}
                </div>
                <div className="ml-4">
                  <p className="font-medium">{step.label}</p>
                  {step.status === 'paid_in_escrow' && order.status === 'paid_in_escrow' && (
                    <p className="text-sm text-gray-500">Funds held securely</p>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Item Details */}
      <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
        <h2 className="text-lg font-semibold mb-4">Item Details</h2>
        <div className="flex space-x-4">
          <img
            src={order.listing?.photos?.[0] || 'https://via.placeholder.com/100'}
            alt={order.listing?.title}
            className="w-20 h-20 object-cover rounded"
          />
          <div>
            <h3 className="font-medium">{order.listing?.title}</h3>
            <p className="text-sm text-gray-500">{order.listing?.condition}</p>
            <p className="text-emerald-600 font-bold mt-1">KSh {order.amount?.toLocaleString()}</p>
          </div>
        </div>
      </div>

      {/* Payment Info */}
      <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
        <h2 className="text-lg font-semibold mb-4">Payment Information</h2>
        <div className="space-y-2">
          <div className="flex justify-between">
            <span className="text-gray-600">Order ID</span>
            <span className="font-mono">{order.id}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Payment Method</span>
            <span>M-Pesa</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Transaction ID</span>
            <span className="font-mono">{order.transactionId || 'Pending'}</span>
          </div>
          <div className="flex justify-between font-bold pt-2 border-t">
            <span>Total Paid</span>
            <span className="text-emerald-600">KSh {order.amount?.toLocaleString()}</span>
          </div>
        </div>
      </div>

      {/* Buyer Actions */}
      {isBuyer && order.status === 'paid_in_escrow' && (
        <div className="bg-yellow-50 rounded-lg p-6">
          <h3 className="font-semibold text-yellow-800 mb-2">Confirm Receipt</h3>
          <p className="text-yellow-700 mb-4">
            Once you've received the item and verified it's as described, confirm receipt to release payment to the seller.
          </p>
          <ConfirmReceivedButton
            onClick={() => confirmReceivedMutation.mutate()}
            isLoading={confirmReceivedMutation.isPending}
          />
        </div>
      )}
    </div>
  )
}