import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { 
  PhoneIcon, 
  LockClosedIcon, 
  ShieldCheckIcon,
  CreditCardIcon,
  CheckBadgeIcon 
} from '@heroicons/react/24/outline';
import { useOrder } from '../../features/orders/OrderProvider';
import { useAuth } from '../../features/auth/AuthProvider';
import api from '../../lib/API/Client/client';
import toast from 'react-hot-toast';

export default function Checkout() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { createOrder, initiateMpesaPayment, paymentStatus } = useOrder();
  
  const [phoneNumber, setPhoneNumber] = useState('');
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState('mpesa');
  const [countdown, setCountdown] = useState(0);

  // Fetch listing details
  const { data: listing, isLoading } = useQuery({
    queryKey: ['listing', id],
    queryFn: () => api.get(`/listings/${id}`).then(res => res.data),
  });

  // Handle countdown for payment processing
  useEffect(() => {
    if (paymentStatus === 'processing' && countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [paymentStatus, countdown]);

  const formatPhoneNumber = (number) => {
    // Remove any non-digit characters
    const cleaned = number.replace(/\D/g, '');
    
    // Format as 07XX XXX XXX
    if (cleaned.length === 10) {
      return cleaned.replace(/(\d{3})(\d{3})(\d{4})/, '$1 $2 $3');
    }
    return number;
  };

  const validatePhoneNumber = (number) => {
    const cleaned = number.replace(/\D/g, '');
    return cleaned.length === 10 && (cleaned.startsWith('07') || cleaned.startsWith('01'));
  };

  const handlePhoneChange = (e) => {
    const value = e.target.value;
    setPhoneNumber(formatPhoneNumber(value));
  };

  const handlePayment = async () => {
    if (!validatePhoneNumber(phoneNumber)) {
      toast.error('Please enter a valid M-Pesa phone number (e.g., 0712345678)');
      return;
    }

    if (!agreedToTerms) {
      toast.error('Please agree to the terms and conditions');
      return;
    }

    try {
      // Create order first
      const order = await createOrder(
        id,
        user?.id,
        listing.sellerId,
        listing.price
      );

      // Clean phone number for API
      const cleanPhone = phoneNumber.replace(/\D/g, '');
      
      // Initiate M-Pesa payment
      await initiateMpesaPayment(order.id, cleanPhone);
      setCountdown(60); // 60 second countdown for STK push
      
      // Navigate to payment status page
      navigate(`/payment-status/${order.id}`);
    } catch (error) {
      console.error('Payment error:', error);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600"></div>
      </div>
    );
  }

  if (!listing) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">Listing not found</p>
      </div>
    );
  }

  // Prevent seller from buying their own item
  if (user?.id === listing.sellerId) {
    return (
      <div className="max-w-2xl mx-auto py-8">
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 text-center">
          <ShieldCheckIcon className="h-16 w-16 text-yellow-500 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-gray-900 mb-2">You cannot buy your own item</h2>
          <p className="text-gray-600 mb-4">This is your listing. You can view it or edit it instead.</p>
          <button
            onClick={() => navigate(`/listing/${id}`)}
            className="btn-primary"
          >
            Back to Listing
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto py-8">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Secure Checkout</h1>

      {/* Order Summary */}
      <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
        <h2 className="text-lg font-semibold mb-4">Order Summary</h2>
        
        <div className="flex space-x-4 mb-4">
          <img
            src={listing.photos?.[0] || 'https://via.placeholder.com/100'}
            alt={listing.title}
            className="w-20 h-20 object-cover rounded-lg"
          />
          <div className="flex-1">
            <h3 className="font-medium text-gray-900">{listing.title}</h3>
            <p className="text-sm text-gray-500">Condition: {listing.condition}</p>
            <p className="text-sm text-gray-500">Seller: {listing.seller?.name || 'Anonymous'}</p>
          </div>
        </div>

        <div className="border-t pt-4 space-y-2">
          <div className="flex justify-between">
            <span className="text-gray-600">Item Price</span>
            <span className="font-medium">KSh {listing.price?.toLocaleString()}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Delivery Fee</span>
            <span className="text-gray-500">To be agreed with seller</span>
          </div>
          <div className="flex justify-between text-lg font-bold pt-2 border-t">
            <span>Total</span>
            <span className="text-emerald-600">KSh {listing.price?.toLocaleString()}</span>
          </div>
        </div>
      </div>

      {/* Payment Method Selection */}
      <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
        <h2 className="text-lg font-semibold mb-4">Payment Method</h2>
        
        <div className="space-y-3">
          <label className="flex items-center p-4 border rounded-lg cursor-pointer hover:border-emerald-300">
            <input
              type="radio"
              name="paymentMethod"
              value="mpesa"
              checked={selectedPaymentMethod === 'mpesa'}
              onChange={(e) => setSelectedPaymentMethod(e.target.value)}
              className="h-4 w-4 text-emerald-600"
            />
            <div className="ml-3 flex items-center">
              <img 
                src="https://safaricom.co.ke/images/m-pesa-logo.png" 
                alt="M-Pesa"
                className="h-8 w-auto"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = 'https://via.placeholder.com/80x30?text=M-Pesa';
                }}
              />
              <span className="ml-2 text-gray-700">M-Pesa (Mobile Money)</span>
            </div>
          </label>
          
          <label className="flex items-center p-4 border rounded-lg opacity-50 cursor-not-allowed">
            <input
              type="radio"
              name="paymentMethod"
              value="card"
              disabled
              className="h-4 w-4 text-gray-400"
            />
            <div className="ml-3 flex items-center">
              <CreditCardIcon className="h-6 w-6 text-gray-400" />
              <span className="ml-2 text-gray-400">Card Payment (Coming Soon)</span>
            </div>
          </label>
        </div>
      </div>

      {/* M-Pesa Details */}
      {selectedPaymentMethod === 'mpesa' && (
        <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
          <h2 className="text-lg font-semibold mb-4">M-Pesa Payment</h2>
          
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              M-Pesa Phone Number
            </label>
            <div className="relative">
              <PhoneIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="tel"
                value={phoneNumber}
                onChange={handlePhoneChange}
                placeholder="e.g., 0712 345 678"
                className="input-field pl-10"
                disabled={paymentStatus === 'processing'}
                maxLength="12"
              />
            </div>
            <p className="text-xs text-gray-500 mt-1">
              You'll receive an STK push prompt on this number to complete payment
            </p>
          </div>

          {/* M-Pesa Instructions */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="font-medium text-gray-700 mb-2">How it works:</h3>
            <ol className="space-y-2 text-sm text-gray-600">
              <li>1. Enter your M-Pesa registered phone number</li>
              <li>2. Click "Pay with M-Pesa" below</li>
              <li>3. You'll receive an STK push prompt on your phone</li>
              <li>4. Enter your M-Pesa PIN to authorize payment</li>
              <li>5. Funds are held securely in escrow until you confirm receipt</li>
            </ol>
          </div>
        </div>
      )}

      {/* Escrow Information */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
        <div className="flex items-start space-x-3">
          <LockClosedIcon className="h-5 w-5 text-blue-600 mt-0.5" />
          <div>
            <h3 className="font-medium text-blue-800">🔒 Escrow Protection</h3>
            <p className="text-sm text-blue-700">
              Your payment is held securely in escrow until you confirm receipt of the item. 
              Funds are only released to the seller after you're satisfied.
            </p>
          </div>
        </div>
      </div>

      {/* Terms Agreement */}
      <div className="mb-6">
        <label className="flex items-start space-x-3">
          <input
            type="checkbox"
            checked={agreedToTerms}
            onChange={(e) => setAgreedToTerms(e.target.checked)}
            className="mt-1 h-4 w-4 text-emerald-600 focus:ring-emerald-500 border-gray-300 rounded"
            disabled={paymentStatus === 'processing'}
          />
          <span className="text-sm text-gray-600">
            I agree to the{' '}
            <button className="text-emerald-600 hover:text-emerald-700">
              Terms of Service
            </button>{' '}
            and understand that my payment will be held in escrow until I confirm receipt.
          </span>
        </label>
      </div>

      {/* Payment Button */}
      <button
        onClick={handlePayment}
        disabled={paymentStatus === 'processing' || !agreedToTerms || !validatePhoneNumber(phoneNumber)}
        className={`w-full btn-primary py-4 text-lg disabled:opacity-50 disabled:cursor-not-allowed ${
          paymentStatus === 'processing' ? 'bg-gray-400' : ''
        }`}
      >
        {paymentStatus === 'processing' ? (
          <div className="flex items-center justify-center space-x-2">
            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
            <span>Processing... {countdown > 0 ? `(${countdown}s)` : ''}</span>
          </div>
        ) : (
          <div className="flex items-center justify-center space-x-2">
            <img 
              src="https://safaricom.co.ke/images/m-pesa-logo.png" 
              alt="M-Pesa"
              className="h-6 w-auto filter brightness-0 invert"
              onError={(e) => {
                e.target.onerror = null;
                e.target.style.display = 'none';
              }}
            />
            <span>Pay KSh {listing.price?.toLocaleString()} with M-Pesa</span>
          </div>
        )}
      </button>

      {/* Security Badges */}
      <div className="flex justify-center space-x-6 mt-6 text-sm text-gray-500">
        <div className="flex items-center space-x-2">
          <LockClosedIcon className="h-4 w-4" />
          <span>256-bit SSL</span>
        </div>
        <div className="flex items-center space-x-2">
          <ShieldCheckIcon className="h-4 w-4" />
          <span>Escrow Protected</span>
        </div>
        <div className="flex items-center space-x-2">
          <CheckBadgeIcon className="h-4 w-4" />
          <span>Secure Transaction</span>
        </div>
      </div>
    </div>
  );
}