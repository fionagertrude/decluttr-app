const conditionColors = {
  new: 'bg-green-100 text-green-800',
  'like new': 'bg-blue-100 text-blue-800',
  good: 'bg-yellow-100 text-yellow-800',
  fair: 'bg-orange-100 text-orange-800',
  poor: 'bg-red-100 text-red-800',
}

export default function ConditionBadge({ condition, className = '' }) {
  const colorClass = conditionColors[condition?.toLowerCase()] || 'bg-gray-100 text-gray-800'
  
  return (
    <span className={`px-2 py-1 rounded-full text-xs font-medium ${colorClass} ${className}`}>
      {condition}
    </span>
  )
}