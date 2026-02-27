import { useParams, useNavigate } from 'react-router-dom'
import { useQuery, useMutation } from '@tanstack/react-query'
import { useState } from 'react'
import api from '../../lib/api/client'
import PhotoCarousel from '../../components/Listing/PhotoCarousel'
import ConditionBadge from '../../components/Listing/ConditionBadge'
import DispositionChip from '../../components/Listing/DispositionChip'
import { ChatBubbleLeftIcon, ShoppingBagIcon } from '@heroicons/react/24/outline'
import { useAuth } from '../../features/auth/AuthProvider'
import toast from 'react-hot-toast'

export default function ListingDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { user } = useAuth()
  const [showContactInfo, setShowContactInfo] = useState(false)

  const { data: listing, isLoading } = useQuery({
    queryKey: ['listing', id],
    queryFn: () => api.get(`/listings/${id}`).then(res => res.data),
  })

  const createChatMutation = useMutation({
    mutationFn: () => api.post('/threads', { listingId: id }),
    onSuccess: (data) => {
      navigate(`/inbox/${data.data.id}`)
    },
  })

  const handleBuy = () => {
    if (!user) {
      navigate('/login')
      return
    }
    navigate(`/checkout/${id}`)
  }

  const handleChat = () => {
    if (!user) {
      navigate('/login')
      return
    }
    createChatMutation.mutate()
  }

  if (isLoading) {
    return (
      <div className="animate-pulse space-y-4">
        <div className="bg-gray-200 h-96 rounded-lg" />
        <div className="space-y-3">
          <div className="h-8 bg-gray-200 rounded w-3/4" />
          <div className="h-4 bg-gray-200 rounded w-1/2" />
          <div className="h-4 bg-gray-200 rounded w-2/3" />
        </div>
      </div>
    )
  }

  if (!listing) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">Listing not found</p>
      </div>
    )
  }

  const isOwner = user?.id === listing.sellerId

  return (
    <div className="py-6">
      {/* Photo Carousel */}
      <PhotoCarousel photos={listing.photos || []} />

      {/* Content */}
      <div className="mt-6 bg-white rounded-lg shadow-lg p-6">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-2xl font-bold text-gray-900">{listing.title}</h1>
          <DispositionChip disposition={listing.disposition} />
        </div>

        <div className="flex items-center space-x-3 mb-4">
          <ConditionBadge condition={listing.condition} />
          <span className="text-gray-500">•</span>
          <span className="text-gray-600">{listing.category}</span>
        </div>

        {listing.disposition === 'sell' && (
          <div className="mb-6">
            <span className="text-3xl font-bold text-emerald-600">
              KSh {listing.price?.toLocaleString()}
            </span>
          </div>
        )}

        <div className="mb-6">
          <h2 className="text-lg font-semibold mb-2">Description</h2>
          <p className="text-gray-700 whitespace-pre-line">{listing.description}</p>
        </div>

        <div className="mb-6">
          <h2 className="text-lg font-semibold mb-2">Location</h2>
          <p className="text-gray-700">{listing.location || 'Not specified'}</p>
        </div>

        <div className="mb-6">
          <h2 className="text-lg font-semibold mb-2">Delivery Options</h2>
          <ul className="space-y-2">
            {listing.pickupAvailable && (
              <li className="text-gray-700">• Pickup available</li>
            )}
            {listing.deliveryAvailable && (
              <li className="text-gray-700">• Delivery can be arranged</li>
            )}
          </ul>
        </div>

        {/* Seller Info */}
        <div className="border-t pt-6">
          <h2 className="text-lg font-semibold mb-4">Seller Information</h2>
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">{listing.seller?.name || 'Anonymous'}</p>
              <p className="text-sm text-gray-500">
                Member since {listing.seller?.joinedDate || 'N/A'}
              </p>
            </div>
            {!isOwner && (
              <div className="flex space-x-3">
                <button
                  onClick={handleChat}
                  disabled={createChatMutation.isPending}
                  className="btn-secondary flex items-center space-x-2"
                >
                  <ChatBubbleLeftIcon className="h-5 w-5" />
                  <span>Chat</span>
                </button>
                {listing.disposition === 'sell' && (
                  <button
                    onClick={handleBuy}
                    className="btn-primary flex items-center space-x-2"
                  >
                    <ShoppingBagIcon className="h-5 w-5" />
                    <span>Buy Now</span>
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}