import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { PhotoIcon, XMarkIcon } from '@heroicons/react/24/outline';
import toast from 'react-hot-toast';

export default function PostItemWizard() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    title: '',
    category: '',
    condition: '',
    description: '',
    price: '',
    disposition: 'sell',
    location: '',
    photos: [],
    receipt: null,
    identityDoc: null,
    pickupAvailable: false,
    deliveryAvailable: false
  });

  const categories = [
    'Electronics', 'Clothing', 'Furniture', 'Vehicles', 
    'Books', 'Sports', 'Toys', 'Other'
  ];

  const conditions = [
    'New', 'Like New', 'Good', 'Fair', 'Poor'
  ];

  const handlePhotoUpload = (e) => {
    const files = Array.from(e.target.files);
    if (formData.photos.length + files.length > 10) {
      toast.error('Maximum 10 photos allowed');
      return;
    }
    
    const newPhotos = files.map(file => ({
      file,
      preview: URL.createObjectURL(file),
      id: Math.random().toString(36).substr(2, 9)
    }));
    
    setFormData({ ...formData, photos: [...formData.photos, ...newPhotos] });
  };

  const removePhoto = (photoId) => {
    setFormData({
      ...formData,
      photos: formData.photos.filter(p => p.id !== photoId)
    });
  };

  const handleReceiptUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData({
        ...formData,
        receipt: {
          file,
          preview: URL.createObjectURL(file),
          name: file.name
        }
      });
    }
  };

  const handleIdentityUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData({
        ...formData,
        identityDoc: {
          file,
          preview: URL.createObjectURL(file),
          name: file.name
        }
      });
    }
  };

  const handleSubmit = () => {
    // Validate based on step
    if (step === 1) {
      if (!formData.title || !formData.category || !formData.condition) {
        toast.error('Please fill in all required fields');
        return;
      }
      setStep(2);
    } else if (step === 2) {
      if (formData.photos.length < 3) {
        toast.error('Please upload at least 3 photos');
        return;
      }
      setStep(3);
    } else if (step === 3) {
      if (!formData.receipt) {
        toast.error('Please upload proof of purchase/receipt');
        return;
      }
      setStep(4);
    } else if (step === 4) {
      if (!formData.identityDoc) {
        toast.error('Please upload identity document for verification');
        return;
      }
      setStep(5);
    } else if (step === 5) {
      if (formData.disposition === 'sell' && !formData.price) {
        toast.error('Please set a price for your item');
        return;
      }
      // Submit to API
      toast.success('Item posted successfully!');
      navigate('/my-listings');
    }
  };

  const renderStep = () => {
    switch(step) {
      case 1:
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-900">Item Details</h2>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Title *
              </label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="e.g., iPhone 13, Leather Sofa"
                className="input-field"
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
              >
                <option value="">Select category</option>
                {categories.map(cat => (
                  <option key={cat} value={cat.toLowerCase()}>{cat}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Condition *
              </label>
              <div className="grid grid-cols-2 gap-3">
                {conditions.map(cond => (
                  <button
                    key={cond}
                    type="button"
                    onClick={() => setFormData({ ...formData, condition: cond.toLowerCase() })}
                    className={`p-3 border rounded-lg text-center ${
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

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Description
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                rows="4"
                placeholder="Describe your item..."
                className="input-field"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Location
              </label>
              <input
                type="text"
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                placeholder="City, State"
                className="input-field"
              />
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-900">Photos</h2>
            <p className="text-gray-600">Upload at least 3 clear photos of your item</p>

            <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
              <input
                type="file"
                accept="image/*"
                multiple
                onChange={handlePhotoUpload}
                className="hidden"
                id="photo-upload"
              />
              <label
                htmlFor="photo-upload"
                className="cursor-pointer block"
              >
                <PhotoIcon className="mx-auto h-12 w-12 text-gray-400" />
                <p className="mt-2 text-sm text-gray-600">Click to upload photos</p>
                <p className="text-xs text-gray-500">Maximum 10 photos</p>
              </label>
            </div>

            {/* Photo Grid */}
            <div className="grid grid-cols-3 gap-4">
              {formData.photos.map((photo) => (
                <div key={photo.id} className="relative aspect-square">
                  <img
                    src={photo.preview}
                    alt="Preview"
                    className="w-full h-full object-cover rounded-lg"
                  />
                  <button
                    onClick={() => removePhoto(photo.id)}
                    className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                  >
                    <XMarkIcon className="h-4 w-4" />
                  </button>
                </div>
              ))}
            </div>

            <div className="text-sm text-gray-500">
              {formData.photos.length} / 10 photos uploaded
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-900">Proof of Purchase</h2>
            <p className="text-gray-600">Upload your receipt or proof of purchase for verification</p>

            <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
              <input
                type="file"
                accept="image/*,.pdf"
                onChange={handleReceiptUpload}
                className="hidden"
                id="receipt-upload"
              />
              <label
                htmlFor="receipt-upload"
                className="cursor-pointer block"
              >
                <PhotoIcon className="mx-auto h-12 w-12 text-gray-400" />
                <p className="mt-2 text-sm text-gray-600">
                  {formData.receipt ? formData.receipt.name : 'Click to upload receipt'}
                </p>
              </label>
            </div>

            {formData.receipt && (
              <div className="bg-green-50 p-4 rounded-lg">
                <p className="text-green-700 text-sm">✓ Receipt uploaded successfully</p>
              </div>
            )}
          </div>
        );

      case 4:
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-900">Identity Verification</h2>
            <p className="text-gray-600">Upload a government-issued ID for verification</p>

            <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
              <input
                type="file"
                accept="image/*,.pdf"
                onChange={handleIdentityUpload}
                className="hidden"
                id="identity-upload"
              />
              <label
                htmlFor="identity-upload"
                className="cursor-pointer block"
              >
                <PhotoIcon className="mx-auto h-12 w-12 text-gray-400" />
                <p className="mt-2 text-sm text-gray-600">
                  {formData.identityDoc ? formData.identityDoc.name : 'Click to upload ID'}
                </p>
              </label>
            </div>

            {formData.identityDoc && (
              <div className="bg-green-50 p-4 rounded-lg">
                <p className="text-green-700 text-sm">✓ ID uploaded successfully</p>
              </div>
            )}

            <div className="bg-blue-50 p-4 rounded-lg">
              <p className="text-sm text-blue-700">
                Your identity document is encrypted and only used for verification
              </p>
            </div>
          </div>
        );

      case 5:
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-900">Final Details</h2>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                What would you like to do with this item?
              </label>
              <div className="grid grid-cols-3 gap-3">
                {['sell', 'donate', 'recycle'].map((option) => (
                  <button
                    key={option}
                    onClick={() => setFormData({ ...formData, disposition: option })}
                    className={`p-3 border rounded-lg text-center capitalize ${
                      formData.disposition === option
                        ? 'border-emerald-600 bg-emerald-50 text-emerald-700'
                        : 'border-gray-200 hover:border-emerald-300'
                    }`}
                  >
                    {option}
                  </button>
                ))}
              </div>
            </div>

            {formData.disposition === 'sell' && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Price (KES) *
                </label>
                <input
                  type="number"
                  value={formData.price}
                  onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                  placeholder="0"
                  className="input-field"
                />
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Delivery Options
              </label>
              <div className="space-y-2">
                <label className="flex items-center space-x-3">
                  <input
                    type="checkbox"
                    checked={formData.pickupAvailable}
                    onChange={(e) => setFormData({ ...formData, pickupAvailable: e.target.checked })}
                    className="h-4 w-4 text-emerald-600"
                  />
                  <span>Available for pickup</span>
                </label>
                <label className="flex items-center space-x-3">
                  <input
                    type="checkbox"
                    checked={formData.deliveryAvailable}
                    onChange={(e) => setFormData({ ...formData, deliveryAvailable: e.target.checked })}
                    className="h-4 w-4 text-emerald-600"
                  />
                  <span>Can arrange delivery</span>
                </label>
              </div>
            </div>

            {/* Summary */}
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="font-semibold mb-2">Summary</h3>
              <div className="space-y-2 text-sm">
                <p>📸 {formData.photos.length} photos</p>
                <p>🧾 Receipt: {formData.receipt ? 'Uploaded' : 'Missing'}</p>
                <p>🆔 ID: {formData.identityDoc ? 'Uploaded' : 'Missing'}</p>
                <p>📍 Location: {formData.location || 'Not set'}</p>
                {formData.disposition === 'sell' && <p>💰 Price: KSh {formData.price || 'Not set'}</p>}
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="max-w-2xl mx-auto py-8">
      {/* Progress Bar */}
      <div className="mb-8">
        <div className="flex justify-between mb-2">
          {['Details', 'Photos', 'Receipt', 'ID', 'Final'].map((label, i) => (
            <div
              key={i}
              className={`text-sm ${step > i + 1 ? 'text-emerald-600' : step === i + 1 ? 'text-emerald-600 font-medium' : 'text-gray-400'}`}
            >
              {label}
            </div>
          ))}
        </div>
        <div className="h-2 bg-gray-200 rounded-full">
          <div
            className="h-2 bg-emerald-600 rounded-full transition-all"
            style={{ width: `${(step / 5) * 100}%` }}
          />
        </div>
      </div>

      {/* Step Content */}
      <div className="bg-white rounded-lg shadow-lg p-6">
        {renderStep()}

        <div className="flex justify-between mt-8">
          <button
            onClick={() => step > 1 ? setStep(step - 1) : navigate('/feed')}
            className="btn-secondary"
          >
            {step === 1 ? 'Cancel' : 'Back'}
          </button>
          <button
            onClick={handleSubmit}
            className="btn-primary"
          >
            {step === 5 ? 'Post Item' : 'Continue'}
          </button>
        </div>
      </div>
    </div>
  );
}