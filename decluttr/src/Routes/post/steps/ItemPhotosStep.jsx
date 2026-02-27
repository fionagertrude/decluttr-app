import { useState, useCallback } from 'react'
import { useDropzone } from 'react-dropzone'
import { PhotoIcon, XMarkIcon } from '@heroicons/react/24/outline'
import toast from 'react-hot-toast'

export default function ItemPhotosStep({ data, onNext, onBack, isLoading }) {
  const [photos, setPhotos] = useState(data.photos || [])
  const [uploading, setUploading] = useState(false)

  const onDrop = useCallback(async (acceptedFiles) => {
    if (photos.length + acceptedFiles.length > 10) {
      toast.error('Maximum 10 photos allowed')
      return
    }

    setUploading(true)
    
    // Simulate upload - replace with actual upload to Supabase Storage
    const newPhotos = acceptedFiles.map((file) => ({
      id: Math.random().toString(36).substr(2, 9),
      file,
      preview: URL.createObjectURL(file),
      uploading: true,
    }))

    setPhotos([...photos, ...newPhotos])

    // Simulate upload completion
    setTimeout(() => {
      setPhotos((prev) =>
        prev.map((p) => (p.uploading ? { ...p, uploading: false } : p))
      )
      setUploading(false)
    }, 2000)
  }, [photos])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png', '.heic']
    },
    maxSize: 10485760, // 10MB
  })

  const removePhoto = (photoId) => {
    setPhotos(photos.filter((p) => p.id !== photoId))
  }

  const handleSubmit = () => {
    if (photos.length < 3) {
      toast.error('Please upload at least 3 photos')
      return
    }
    onNext({ photos })
  }

  const canProceed = photos.length >= 3 && !uploading

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-900">Add Photos</h2>
      <p className="text-gray-600">Upload at least 3 clear photos of your item</p>

      <div
        {...getRootProps()}
        className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${
          isDragActive
            ? 'border-emerald-600 bg-emerald-50'
            : 'border-gray-300 hover:border-emerald-400'
        }`}
      >
        <input {...getInputProps()} />
        <PhotoIcon className="mx-auto h-12 w-12 text-gray-400" />
        <p className="mt-2 text-sm text-gray-600">
          Drag & drop photos here, or click to select
        </p>
        <p className="text-xs text-gray-500 mt-1">
          Maximum 10 photos, up to 10MB each
        </p>
      </div>

      {/* Photo Grid */}
      <div className="grid grid-cols-3 gap-4">
        {photos.map((photo) => (
          <div key={photo.id} className="relative aspect-square">
            <img
              src={photo.preview}
              alt="Preview"
              className="w-full h-full object-cover rounded-lg"
            />
            {photo.uploading && (
              <div className="absolute inset-0 bg-black bg-opacity-50 rounded-lg flex items-center justify-center">
                <div className="w-8 h-8 border-4 border-emerald-600 border-t-transparent rounded-full animate-spin" />
              </div>
            )}
            <button
              onClick={() => removePhoto(photo.id)}
              className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
            >
              <XMarkIcon className="h-4 w-4" />
            </button>
          </div>
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
          disabled={!canProceed || isLoading}
          className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? 'Saving...' : 'Next'}
        </button>
      </div>
    </div>
  )
}