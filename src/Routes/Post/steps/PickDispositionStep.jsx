import { useState } from 'react'
import { CurrencyDollarIcon, HeartIcon, ArrowPathIcon } from '@heroicons/react/24/outline'

const dispositions = [
  {
    id: 'sell',
    title: 'Sell',
    description: 'Earn money from your item',
    icon: CurrencyDollarIcon,
    color: 'text-emerald-600',
    bgColor: 'bg-emerald-50',
  },
  {
    id: 'donate',
    title: 'Donate',
    description: 'Give to charity',
    icon: HeartIcon,
    color: 'text-red-500',
    bgColor: 'bg-red-50',
  },
  {
    id: 'recycle',
    title: 'Recycle',
    description: 'Responsible disposal',
    icon: ArrowPathIcon,
    color: 'text-blue-500',
    bgColor: 'bg-blue-50',
  },
]

export default function PickDispositionStep({ data, onNext, onBack, isLoading }) {
  const [selected, setSelected] = useState(data.disposition || '')

  const handleSubmit = () => {
    if (!selected) return
    onNext({ disposition: selected })
  }

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-900">What would you like to do with this item?</h2>
      
      <div className="space-y-4">
        {dispositions.map(({ id, title, description, icon: Icon, color, bgColor }) => (
          <button
            key={id}
            onClick={() => setSelected(id)}
            className={`w-full p-6 rounded-lg border-2 transition-all text-left ${
              selected === id
                ? 'border-emerald-600 bg-emerald-50'
                : 'border-gray-200 hover:border-emerald-300'
            }`}
          >
            <div className="flex items-start space-x-4">
              <div className={`p-3 rounded-full ${bgColor}`}>
                <Icon className={`h-6 w-6 ${color}`} />
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
                <p className="text-gray-600">{description}</p>
              </div>
              <div className={`w-5 h-5 rounded-full border-2 ${
                selected === id
                  ? 'border-emerald-600 bg-emerald-600'
                  : 'border-gray-300'
              }`}>
                {selected === id && (
                  <div className="w-full h-full rounded-full bg-white scale-[0.3]" />
                )}
              </div>
            </div>
          </button>
        ))}
      </div>

      <div className="flex justify-between pt-4">
        <button
          type="button"
          onClick={onBack}
          className="btn-secondary"
        >
          Back
        </button>
        <button
          onClick={handleSubmit}
          disabled={!selected || isLoading}
          className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? 'Saving...' : 'Next'}
        </button>
      </div>
    </div>
  )
}