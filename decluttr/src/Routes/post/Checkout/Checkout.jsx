import { useParams, useNavigate } from 'react-router-dom'
import { useQuery, useMutation } from '@tanstack/react-query'
import { useState } from 'react'
import api from '../../lib/api/client'
import { useAuth } from '../../features/auth/AuthProvider'
import { PhoneIcon } from '@heroicons/react/24/outline'
import toast from 'react-hot-toast'

export default function Checkout() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { user } = useAuth()
  const [phoneNumber, setPhoneNumber] = useState('')
  const [isProcessing, setIsProcessing] = useState(false)

  const { data: listing } = useQuery({
    queryKey: ['listing', id],
    queryFn: () => api.get(`/listings/${id}`).then(res => res.data),
  })

  const createOrderMutation = useMutation({
    mutationFn: () => api.post('/orders', { listingId: id }),
  })

  const initiatePaymentMutation = useMutation({
    mutationFn: (data) => api.post('/payments/mpesa/stk-push', data),
  })

  const handlePayment = async () => {
    if (!phoneNumber || phoneNumber.length < 10) {
      toast.error('Please enter a valid phone number')
      return
    }

    setIsProcessing(true)

    try {
      // Create order first
      const orderResponse = await createOrderMutation.mutateAsync()
      
      // Initiate M-Pesa payment
      await initiatePaymentMutation.mutateAsync({
        orderId: orderResponse.data.id,
        phoneNumber: phoneNumber,
        amount: listing.price,
      })

      toast.success('STK Push sent! Please check your phone')
      navigate(`/payment-status/${orderResponse.data.id}`)
    } catch (error) {
      toast.error('Payment failed. Please try again')
    } finally {
      setIsProcessing(false)
    }
  }

  if (!listing) {
    return <div>Loading...</div>
  }

  return (
    <div className="max-w-2xl mx-auto py-8">
      <h1 className="text-2xl font-bold mb-6">Checkout</h1>

      {/* Order Summary */}
      <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
        <h2 className="text-lg font-semibold mb-4">Order Summary</h2>
        
        <div className="flex space-x-4 mb-4">
          <img
            src={listing.photos?.[0] || 'https://via.placeholder.com/100'}
            alt={listing.title}
            className="w-20 h-20 object-cover rounded"
          />
          <div>
            <h3 className="font-medium">{listing.title}</h3>
            <p className="text-sm text-gray-500">{listing.condition}</p>
            <p className="text-emerald-600 font-bold mt-1">KSh {listing.price?.toLocaleString()}</p>
          </div>
        </div>

        <div className="border-t pt-4">
          <div className="flex justify-between mb-2">
            <span>Subtotal</span>
            <span>KSh {listing.price?.toLocaleString()}</span>
          </div>
          <div className="flex justify-between mb-2">
            <span>Delivery</span>
            <span>To be agreed</span>
          </div>
          <div className="flex justify-between font-bold text-lg">
            <span>Total</span>
            <span>KSh {listing.price?.toLocaleString()}</span>
          </div>
        </div>
      </div>

      {/* Payment Details */}
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h2 className="text-lg font-semibold mb-4">Payment Details</h2>
        
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            M-Pesa Phone Number
          </label>
          <div className="relative">
            <PhoneIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="tel"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              placeholder="0712345678"
              className="input-field pl-10"
            />
          </div>
          <p className="text-sm text-gray-500 mt-2">
            You'll receive an STK push prompt on this number
          </p>
        </div>

        <button
          onClick={handlePayment}
          disabled={isProcessing}
          className="w-full btn-primary py-3 text-lg disabled:opacity-50"
        >
          {isProcessing ? 'Processing...' : `Pay KSh ${listing.price?.toLocaleString()}`}
        </button>

        <p className="text-xs text-gray-500 text-center mt-4">
          Your payment is held in escrow until you confirm receipt of the item
        </p>
      </div>
    </div>
  )
}