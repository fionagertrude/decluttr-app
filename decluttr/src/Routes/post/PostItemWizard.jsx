import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useMutation } from '@tanstack/react-query'
import toast from 'react-hot-toast'
import api from '../../lib/api/client'
import ItemBasicsStep from './steps/ItemBasicsStep'
import ItemPhotosStep from './steps/ItemPhotosStep'
import ItemDetailsStep from './steps/ItemDetailsStep'
import PickDispositionStep from './steps/PickDispositionStep'
import SellStep from './steps/SellStep'
import DonateStep from './steps/DonateStep'
import RecycleStep from './steps/RecycleStep'

const steps = [
  { id: 'basics', title: 'Basic Info', component: ItemBasicsStep },
  { id: 'photos', title: 'Photos', component: ItemPhotosStep },
  { id: 'details', title: 'Details', component: ItemDetailsStep },
  { id: 'disposition', title: 'What would you like to do?', component: PickDispositionStep },
  { id: 'sell', title: 'Set Price', component: SellStep },
  { id: 'donate', title: 'Donation Details', component: DonateStep },
  { id: 'recycle', title: 'Recycling Details', component: RecycleStep },
]

export default function PostItemWizard() {
  const navigate = useNavigate()
  const [currentStep, setCurrentStep] = useState(0)
  const [listingId, setListingId] = useState(null)
  const [formData, setFormData] = useState({
    title: '',
    category: '',
    condition: '',
    photos: [],
    description: '',
    location: '',
    pickupAvailable: false,
    deliveryAvailable: false,
    disposition: null,
    price: '',
    donationNotes: '',
    recycleNotes: '',
  })

  const createListingMutation = useMutation({
    mutationFn: (data) => api.post('/listings', data),
    onSuccess: (response) => {
      setListingId(response.data.id)
      toast.success('Listing created!')
      setCurrentStep(1)
    },
  })

  const updateListingMutation = useMutation({
    mutationFn: ({ id, data }) => api.patch(`/listings/${id}`, data),
    onSuccess: () => {
      toast.success('Progress saved!')
    },
  })

  const publishListingMutation = useMutation({
    mutationFn: (id) => api.post(`/listings/${id}/publish`),
    onSuccess: () => {
      toast.success('Item listed successfully!')
      navigate('/my-listings')
    },
  })

  const handleNext = async (stepData) => {
    const updatedData = { ...formData, ...stepData }
    setFormData(updatedData)

    if (currentStep === 0) {
      createListingMutation.mutate(updatedData)
    } else if (currentStep < 3) {
      updateListingMutation.mutate({ id: listingId, data: updatedData })
      setCurrentStep(currentStep + 1)
    } else if (currentStep === 3) {
      updateListingMutation.mutate({ id: listingId, data: updatedData })
      
      // Navigate to appropriate step based on disposition
      if (updatedData.disposition === 'sell') {
        setCurrentStep(4) // Sell step
      } else if (updatedData.disposition === 'donate') {
        setCurrentStep(5) // Donate step
      } else if (updatedData.disposition === 'recycle') {
        setCurrentStep(6) // Recycle step
      }
    } else {
      // Final step - publish
      await updateListingMutation.mutateAsync({ id: listingId, data: updatedData })
      publishListingMutation.mutate(listingId)
    }
  }

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1)
    } else {
      navigate('/feed')
    }
  }

  const CurrentStepComponent = steps[currentStep]?.component

  return (
    <div className="max-w-2xl mx-auto py-8">
      {/* Progress Bar */}
      <div className="mb-8">
        <div className="flex justify-between mb-2">
          {steps.slice(0, 4).map((step, index) => (
            <div
              key={step.id}
              className={`flex-1 text-center text-sm ${
                index <= currentStep ? 'text-emerald-600 font-medium' : 'text-gray-400'
              }`}
            >
              {step.title}
            </div>
          ))}
        </div>
        <div className="h-2 bg-gray-200 rounded-full">
          <div
            className="h-2 bg-emerald-600 rounded-full transition-all"
            style={{ width: `${(currentStep / (steps.length - 1)) * 100}%` }}
          />
        </div>
      </div>

      {/* Current Step */}
      <div className="bg-white rounded-lg shadow-lg p-6">
        <CurrentStepComponent
          data={formData}
          onNext={handleNext}
          onBack={handleBack}
          isLoading={createListingMutation.isPending || updateListingMutation.isPending}
        />
      </div>
    </div>
  )
}