const dispositionConfig = {
  sell: {
    bg: 'bg-emerald-100',
    text: 'text-emerald-800',
    label: 'For Sale',
  },
  donate: {
    bg: 'bg-red-100',
    text: 'text-red-800',
    label: 'Donation',
  },
  recycle: {
    bg: 'bg-blue-100',
    text: 'text-blue-800',
    label: 'Recycle',
  },
}

export default function DispositionChip({ disposition, className = '' }) {
  const config = dispositionConfig[disposition]
  if (!config) return null

  return (
    <span className={`px-2 py-1 rounded-full text-xs font-medium ${config.bg} ${config.text} ${className}`}>
      {config.label}
    </span>
  )
}