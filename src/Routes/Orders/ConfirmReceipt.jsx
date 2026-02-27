import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { CameraIcon, CheckCircleIcon } from '@heroicons/react/24/outline';
import toast from 'react-hot-toast';

export default function ConfirmReceipt() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [receiptPhoto, setReceiptPhoto] = useState(null);
  const [notes, setNotes] = useState('');

  const handlePhotoUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setReceiptPhoto({
        file,
        preview: URL.createObjectURL(file),
        name: file.name
      });
    }
  };

  const handleConfirm = () => {
    if (!receiptPhoto) {
      toast.error('Please upload a photo of the received item');
      return;
    }

    // Submit confirmation to API
    toast.success('Receipt confirmed! Payment released to seller.');
    navigate('/purchases');
  };

  return (
    <div className="max-w-2xl mx-auto py-8">
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Confirm Receipt</h1>
        <p className="text-gray-600 mb-6">
          Have you received this item? Confirm to release payment to the seller.
        </p>

        {/* Item Preview (you'd fetch this from API) */}
        <div className="bg-gray-50 p-4 rounded-lg mb-6">
          <div className="flex items-center space-x-4">
            <img
              src="https://picsum.photos/100/100?random=1"
              alt="Item"
              className="w-16 h-16 object-cover rounded"
            />
            <div>
              <h3 className="font-semibold">iPhone 13 Pro</h3>
              <p className="text-sm text-gray-600">Order #ORD-2024-001</p>
            </div>
          </div>
        </div>

        {/* Receipt Photo Upload */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Upload Photo of Received Item *
          </label>
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
            <input
              type="file"
              accept="image/*"
              onChange={handlePhotoUpload}
              className="hidden"
              id="receipt-photo"
            />
            <label htmlFor="receipt-photo" className="cursor-pointer block">
              {receiptPhoto ? (
                <div>
                  <img
                    src={receiptPhoto.preview}
                    alt="Receipt"
                    className="mx-auto h-32 w-32 object-cover rounded-lg mb-2"
                  />
                  <p className="text-sm text-gray-600">{receiptPhoto.name}</p>
                </div>
              ) : (
                <>
                  <CameraIcon className="mx-auto h-12 w-12 text-gray-400" />
                  <p className="mt-2 text-sm text-gray-600">Click to upload photo</p>
                  <p className="text-xs text-gray-500">Show the item as received</p>
                </>
              )}
            </label>
          </div>
        </div>

        {/* Notes */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Additional Notes (Optional)
          </label>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            rows="3"
            placeholder="Any issues with the item? Let us know..."
            className="input-field"
          />
        </div>

        {/* Warning */}
        <div className="bg-yellow-50 p-4 rounded-lg mb-6">
          <p className="text-sm text-yellow-700">
            By confirming receipt, you agree that you have received the item
            and it matches the description. This will release payment to the seller.
          </p>
        </div>

        {/* Confirm Button */}
        <button
          onClick={handleConfirm}
          className="w-full btn-primary py-3 flex items-center justify-center space-x-2"
        >
          <CheckCircleIcon className="h-5 w-5" />
          <span>Confirm Receipt & Release Payment</span>
        </button>
      </div>
    </div>
  );
}