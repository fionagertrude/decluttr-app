import { useState } from 'react'

export default function SellStep({ data, onNext, onBack, isLoading }) {
  const [price, setPrice] = useState(data.price || '')

  const handleSubmit = (e) => {
    e.preventDefault()
    onNext({ price: parseFloat(price) })
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-900">Set Your Price</h2>
      
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Price (KES)
        </label>
        <div className="relative">
          <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">KSh</span>
          <input
            type="number"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            placeholder="0"
            min="0"
            step="0.01"
            className="input-field pl-12"
            required
          />
        </div>
        <p className="mt-2 text-sm text-gray-500">
          Set a fair price. You'll receive payment once the buyer confirms receipt.
        </p>
      </div>

      <div className="bg-emerald-50 p-4 rounded-lg">
        <h3 className="font-medium text-emerald-800 mb-2">How escrow works:</h3>
        <ul className="space-y-2 text-sm text-emerald-700">
          <li>• Buyer pays now - funds held securely</li>
          <li>• You deliver the item</li>
          <li>• Buyer confirms receipt</li>
          <li>• Funds released to your account</li>
        </ul>
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
          type="submit"
          disabled={!price || isLoading}
          className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? 'Saving...' : 'Publish Item'}
        </button>
      </div>
    </form>
  )
}