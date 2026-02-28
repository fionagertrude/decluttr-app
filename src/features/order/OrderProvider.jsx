import React, { createContext, useContext, useState } from "react";
import api from "../../lib/API/Client/client";  // Updated path with Client folder
import toast from "react-hot-toast";

const OrderContext = createContext();

export function OrderProvider({ children }) {
  const [currentOrder, setCurrentOrder] = useState(null);
  const [paymentStatus, setPaymentStatus] = useState('idle');
  const [escrowStatus, setEscrowStatus] = useState('pending');

  const createOrder = async (listingId, buyerId, sellerId, amount) => {
    try {
      const response = await api.post('/orders', {
        listingId,
        buyerId,
        sellerId,
        amount,
        status: 'pending_payment'
      });
      setCurrentOrder(response.data);
      return response.data;
    } catch (error) {
      toast.error('Failed to create order');
      throw error;
    }
  };

  const initiateMpesaPayment = async (orderId, phoneNumber) => {
    setPaymentStatus('processing');
    try {
      const response = await api.post('/payments/mpesa/stk-push', {
        orderId,
        phoneNumber,
        amount: currentOrder?.amount
      });
      
      setTimeout(() => {
        handlePaymentCallback(orderId, 'success');
      }, 5000);
      
      return response.data;
    } catch (error) {
      setPaymentStatus('failed');
      toast.error('Payment failed. Please try again.');
      throw error;
    }
  };

  const handlePaymentCallback = async (orderId, status) => {
    if (status === 'success') {
      setPaymentStatus('success');
      setEscrowStatus('funded');
      
      await api.patch(`/orders/${orderId}`, {
        status: 'paid_in_escrow',
        transactionId: 'MPESA' + Date.now()
      });
      
      toast.success('Payment successful! Funds are now in escrow.');
    } else {
      setPaymentStatus('failed');
      toast.error('Payment failed. Please try again.');
    }
  };

  const confirmReceipt = async (orderId) => {
    try {
      await api.post(`/orders/${orderId}/confirm-received`);
      setEscrowStatus('released');
      
      await api.patch(`/orders/${orderId}`, {
        status: 'completed'
      });
      
      toast.success('Payment released to seller!');
    } catch (error) {
      toast.error('Failed to confirm receipt');
      throw error;
    }
  };

  const disputeOrder = async (orderId, reason) => {
    try {
      await api.post(`/orders/${orderId}/dispute`, { reason });
      setEscrowStatus('disputed');
      toast.success('Dispute filed. An admin will review.');
    } catch (error) {
      toast.error('Failed to file dispute');
      throw error;
    }
  };

  return (
    <OrderContext.Provider value={{
      currentOrder,
      paymentStatus,
      escrowStatus,
      createOrder,
      initiateMpesaPayment,
      confirmReceipt,
      disputeOrder
    }}>
      {children}
    </OrderContext.Provider>
  );
}

export function useOrder() {
  const context = useContext(OrderContext);
  if (!context) {
    throw new Error('useOrder must be used within an OrderProvider');
  }
  return context;
}