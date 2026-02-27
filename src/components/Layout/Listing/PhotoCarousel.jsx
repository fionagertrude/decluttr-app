import { useState } from 'react'
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/outline'

export default function PhotoCarousel({ photos }) {
  const [currentIndex, setCurrentIndex] = useState(0)

  if (!photos || photos.length === 0) {
    return (
      <div className="bg-gray-200 h-96 rounded-lg flex items-center justify-center">
        <p className="text-gray-500">No photos available</p>
      </div>
    )
  }

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % photos.length)
  }

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev - 1 + photos.length) % photos.length)
  }

  return (
    <div className="relative h-96 rounded-lg overflow-hidden">
      <img
        src={photos[currentIndex]}
        alt={`Product ${currentIndex + 1}`}
        className="w-full h-full object-cover"
      />

      {/* Navigation Buttons */}
      {photos.length > 1 && (
        <>
          <button
            onClick={prevSlide}
            className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-75"
          >
            <ChevronLeftIcon className="h-6 w-6" />
          </button>
          <button
            onClick={nextSlide}
            className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-75"
          >
            <ChevronRightIcon className="h-6 w-6" />
          </button>
        </>
      )}

      {/* Dots Indicator */}
      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
        {photos.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentIndex(index)}
            className={`w-2 h-2 rounded-full ${
              index === currentIndex ? 'bg-white' : 'bg-white bg-opacity-50'
            }`}
          />
        ))}
      </div>
    </div>
  )
}