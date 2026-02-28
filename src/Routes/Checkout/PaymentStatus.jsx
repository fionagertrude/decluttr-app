import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { 
  CheckCircleIcon, 
  XCircleIcon, 
  ClockIcon,
  PhoneIcon,
  ArrowPathIcon 
} from '@heroicons/react/24/outline';
import api from '../../lib/API/Client/client';

export default function PaymentStatus() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [seconds, setSeconds] = useState(60);
  const [showResend, setShowResend] = useState(false);

  const { data: order, refetch, isLoading } = useQuery({
    queryKey: ['order', id],
    queryFn: () => api.get(`/orders/${id}`).then(res => res.data),
    refetchInterval: 3000, // Poll every 3 seconds
  });

  useEffect(() => {
    const timer = setInterval(() => {
      setSeconds((prev) => {
        if (prev <= 1) {
          setShowResend(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const handleResendSTK = async () => {
    try {
      await api.post(`/payments/mpesa/stk-push/resend`, { orderId: id });
      setSeconds(60);
      setShowResend(false);
      toast.success('STK push resent! Please check your phone.');
    } catch (error) {
      toast.error('Failed to resend. Please try again.');
    }
  };

  const getStatusDisplay = () => {
    switch (order?.status) {
      case 'paid_in_escrow':
        return {
          icon: <CheckCircleIcon className="h-24 w-24 text-emerald-600" />,
          title: 'Payment Successful! 🎉',
          message: 'Your payment is now held securely in escrow.',
          subMessage: 'The seller has been notified and will prepare your item for delivery.',
          buttonText: 'View Order Details',
          buttonAction: () => navigate(`/order/${id}`),
          secondaryButton: {
            text: 'Continue Shopping',
            action: () => navigate('/feed')
          }
        };
      case 'pending_payment':
        return {
          icon: <ClockIcon className="h-24 w-24 text-yellow-500" />,
          title: 'Waiting for Payment',
          message: 'Please check your phone for the M-Pesa STK push prompt.',
          subMessage: showResend 
            ? "Didn't receive the prompt? Click below to resend."
            : `Enter your M-Pesa PIN to complete payment. Auto-refreshing in ${seconds}s`,
          buttonText: showResend ? 'Resend STK Push' : 'I\'ve Completed Payment',
          buttonAction: showResend ? handleResendSTK : () => refetch(),
          showPhoneIcon: true
        };
      case 'failed':
        return {
          icon: <XCircleIcon className="h-24 w-24 text-red-500" />,
          title: 'Payment Failed',
          message: 'We couldn\'t process your M-Pesa payment.',
          subMessage: 'This could be due to insufficient funds or network issues.',
          buttonText: 'Try Again',
          buttonAction: () => navigate(`/checkout/${order.listingId}`),
          secondaryButton: {
            text: 'Contact Support',
            action: () => navigate('/support')
          }
        };
      default:
        return {
          icon: <ClockIcon className="h-24 w-24 text-gray-400" />,
          title: 'Checking Status',
          message: 'Verifying your payment...',
          subMessage: 'This may take a few moments.',
          buttonText: 'Refresh',
          buttonAction: () => refetch()
        };
    }
  };

  if (isLoading || !order) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600"></div>
      </div>
    );
  }

  const status = getStatusDisplay();

  return (
    <div className="max-w-md mx-auto py-12">
      <div className="bg-white rounded-lg shadow-xl p-8 text-center">
        {/* Status Icon */}
        <div className="mb-6 animate-fade-in">
          {status.icon}
        </div>

        {/* M-Pesa Phone Icon for pending */}
        {status.showPhoneIcon && (
          <div className="flex justify-center mb-4">
            <div className="bg-emerald-100 p-3 rounded-full animate-pulse">
              <PhoneIcon className="h-8 w-8 text-emerald-600" />
            </div>
          </div>
        )}

        {/* Title and Messages */}
        <h1 className="text-2xl font-bold text-gray-900 mb-2">
          {status.title}
        </h1>
        
        <p className="text-gray-600 mb-2">
          {status.message}
        </p>
        
        <p className="text-sm text-gray-500 mb-8">
          {status.subMessage}
        </p>

        {/* Order Details for Success */}
        {order.status === 'paid_in_escrow' && (
          <div className="bg-gray-50 rounded-lg p-4 mb-6 text-left">
            <div className="flex justify-between mb-2">
              <span className="text-gray-600">Order ID:</span>
              <span className="font-mono text-sm">{order.id.slice(0, 8)}...</span>
            </div>
            <div className="flex justify-between mb-2">
              <span className="text-gray-600">Amount:</span>
              <span className="font-bold text-emerald-600">KSh {order.amount?.toLocaleString()}</span>
            </div>
            <div className="flex justify-between mb-2">
              <span className="text-gray-600">Transaction ID:</span>
              <span className="font-mono text-sm">{order.transactionId || 'MPESA' + Date.now()}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Status:</span>
              <span className="text-emerald-600 font-medium">Funds in Escrow</span>
            </div>
          </div>
        )}

        {/* Escrow Info for Success */}
        {order.status === 'paid_in_escrow' && (
          <div className="bg-blue-50 rounded-lg p-4 mb-6 text-left">
            <h3 className="font-medium text-blue-800 mb-2 flex items-center">
              <LockClosedIcon className="h-4 w-4 mr-1" />
              What happens next?
            </h3>
            <ul className="text-sm text-blue-700 space-y-2">
              <li className="flex items-start">
                <span className="mr-2">1.</span>
                <span>Your money is safely held in escrow</span>
              </li>
              <li className="flex items-start">
                <span className="mr-2">2.</span>
                <span>Seller prepares and ships your item</span>
              </li>
              <li className="flex items-start">
                <span className="mr-2">3.</span>
                <span>Once received, confirm to release payment</span>
              </li>
              <li className="flex items-start">
                <span className="mr-2">4.</span>
                <span>You have 14 days to open a dispute if needed</span>
              </li>
            </ul>
          </div>
        )}

        {/* Action Buttons */}
        <button
          onClick={status.buttonAction}
          className="w-full btn-primary py-3 flex items-center justify-center space-x-2"
        >
          {status.buttonText === 'Refresh' && (
            <ArrowPathIcon className="h-5 w-5" />
          )}
          <span>{status.buttonText}</span>
        </button>

        {status.secondaryButton && (
          <button
            onClick={status.secondaryButton.action}
            className="w-full mt-3 btn-secondary"
          >
            {status.secondaryButton.text}
          </button>
        )}

        {/* Support Link */}
        <p className="text-xs text-gray-400 mt-6">
          Need help? Contact our support team
        </p>
      </div>
    </div>
  );
}