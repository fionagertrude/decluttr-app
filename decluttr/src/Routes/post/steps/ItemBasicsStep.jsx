import { useState } from 'react'

const categories = [
  'Electronics',
  'Clothing',
  'Furniture',
  'Vehicles',
  'Books',
  'Sports',
  'Toys',
  'Other',
]

const conditions = [
  'New',
  'Like New',
  'Good',
  'Fair',
  'Poor',
]

export default function ItemBasicsStep({ data, onNext, onBack, isLoading }) {
  const [formData, setFormData] = useState({
    title: data.title || '',
    category: data.category || '',
    condition: data.condition || '',
  })

  const handleSubmit = (e) => {
    e.preventDefault()
    onNext(formData)
  }

  const isFormValid = formData.title.trim() && formData.category && formData.condition

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-900">Basic Information</h2>
      
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          What are you listing? *
        </label>
        <input
          type="text"
          value={formData.title}
          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          placeholder="e.g., iPhone 13, Leather Sofa, Mountain Bike"
          className="input-field"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Category *
        </label>
        <select
          value={formData.category}
          onChange={(e) => setFormData({ ...formData, category: e.target.value })}
          className="input-field"
          required
        >
          <option value="">Select a category</option>
          {categories.map((cat) => (
            <option key={cat} value={cat.toLowerCase()}>{cat}</option>
          ))}
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Condition *
        </label>
        <div className="grid grid-cols-2 gap-3">
          {conditions.map((cond) => (
            <button
              key={cond}
              type="button"
              onClick={() => setFormData({ ...formData, condition: cond.toLowerCase() })}
              className={`p-3 border rounded-lg text-center transition-colors ${
                formData.condition === cond.toLowerCase()
                  ? 'border-emerald-600 bg-emerald-50 text-emerald-700'
                  : 'border-gray-200 hover:border-emerald-300'
              }`}
            >
              {cond}
            </button>
          ))}
        </div>
      </div>

      <div className="flex justify-between pt-4">
        <button
          type="button"
          onClick={onBack}
          className="btn-secondary"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={!isFormValid || isLoading}
          className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? 'Saving...' : 'Next'}
        </button>
      </div>
    </form>
  )
}