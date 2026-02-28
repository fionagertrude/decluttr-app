import { useState } from 'react';
import { CheckCircleIcon } from '@heroicons/react/24/outline';
import Modal from '../../../components/Layout/UI/Modal';  // Updated path

export default function ConfirmReceivedButton({ onClick, isLoading }) {
  const [showConfirm, setShowConfirm] = useState(false);

  return (
    <>
      <button
        onClick={() => setShowConfirm(true)}
        className="w-full btn-primary py-3"
      >
        I Have Received the Item
      </button>

      <Modal 
        isOpen={showConfirm} 
        onClose={() => setShowConfirm(false)}
        title="Confirm Receipt"
      >
        <div className="text-center">
          <div className="mb-4">
            <CheckCircleIcon className="h-16 w-16 text-emerald-600 mx-auto" />
          </div>
          
          <h3 className="text-lg font-bold text-gray-900 mb-2">
            Confirm Item Receipt
          </h3>
          
          <p className="text-gray-600 mb-6">
            By confirming, you agree that you have received the item and it matches the description. 
            This will release payment from escrow to the seller.
          </p>

          <div className="flex space-x-3">
            <button
              onClick={() => setShowConfirm(false)}
              className="flex-1 btn-secondary"
            >
              Cancel
            </button>
            
            <button
              onClick={() => {
                onClick();
                setShowConfirm(false);
              }}
              disabled={isLoading}
              className="flex-1 btn-primary disabled:opacity-50"
            >
              {isLoading ? 'Processing...' : 'Confirm'}
            </button>
          </div>
        </div>
      </Modal>
    </>
  );
}