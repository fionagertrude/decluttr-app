import { useState } from 'react';
import { IdentificationIcon, CheckBadgeIcon } from '@heroicons/react/24/outline';
import toast from 'react-hot-toast';

export default function Verification() {
  const [verificationStep, setVerificationStep] = useState('pending');
  const [idFile, setIdFile] = useState(null);
  const [selfieFile, setSelfieFile] = useState(null);

  const handleIdUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setIdFile({
        file,
        preview: URL.createObjectURL(file),
        name: file.name
      });
    }
  };

  const handleSelfieUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelfieFile({
        file,
        preview: URL.createObjectURL(file),
        name: file.name
      });
    }
  };

  const handleSubmit = () => {
    if (!idFile || !selfieFile) {
      toast.error('Please upload both ID and selfie');
      return;
    }
    
    // Submit to API
    toast.success('Verification submitted! Pending review...');
    setVerificationStep('pending');
  };

  return (
    <div className="max-w-2xl mx-auto py-6">
      <div className="bg-white rounded-lg shadow-lg p-6">
        <div className="flex items-center space-x-3 mb-6">
          <IdentificationIcon className="h-8 w-8 text-emerald-600" />
          <h1 className="text-2xl font-bold text-gray-900">Identity Verification</h1>
        </div>

        {verificationStep === 'verified' ? (
          <div className="text-center py-8">
            <CheckBadgeIcon className="h-16 w-16 text-emerald-600 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-gray-900 mb-2">Verified!</h2>
            <p className="text-gray-600">Your identity has been confirmed</p>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="bg-yellow-50 p-4 rounded-lg">
              <p className="text-sm text-yellow-700">
                To post items and receive payments, we need to verify your identity.
                This usually takes 24-48 hours.
              </p>
            </div>

            {/* ID Upload */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Government ID (Passport, National ID, Driver's License)
              </label>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                <input
                  type="file"
                  accept="image/*,.pdf"
                  onChange={handleIdUpload}
                  className="hidden"
                  id="id-upload"
                />
                <label htmlFor="id-upload" className="cursor-pointer block">
                  <IdentificationIcon className="mx-auto h-12 w-12 text-gray-400" />
                  <p className="mt-2 text-sm text-gray-600">
                    {idFile ? idFile.name : 'Click to upload ID'}
                  </p>
                </label>
              </div>
            </div>

            {/* Selfie Upload */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Selfie with ID
              </label>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleSelfieUpload}
                  className="hidden"
                  id="selfie-upload"
                />
                <label htmlFor="selfie-upload" className="cursor-pointer block">
                  <IdentificationIcon className="mx-auto h-12 w-12 text-gray-400" />
                  <p className="mt-2 text-sm text-gray-600">
                    {selfieFile ? selfieFile.name : 'Click to upload selfie with ID'}
                  </p>
                </label>
              </div>
            </div>

            <button
              onClick={handleSubmit}
              className="w-full btn-primary py-3"
            >
              Submit for Verification
            </button>

            <p className="text-xs text-gray-500 text-center">
              Your documents are encrypted and securely stored
            </p>
          </div>
        )}
      </div>
    </div>
  );
}