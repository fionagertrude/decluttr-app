import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';  // Note: BrowserRouter, not Router
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './features/auth/AuthProvider';
import { OrderProvider } from './features/Orders/OrderProvider';
import ProtectedRoute from './app/ProtectedRoute';
import AppShell from './components/Layout/AppShell';
import Feed from './Routes/Home/Feed';
import Profile from './Routes/Profile/Profile';
import PostItemWizard from './Routes/Post/PostItemWizard';
import Verification from './Routes/Profile/Verification';
import Checkout from './Routes/Checkout/Checkout';
import PaymentStatus from './Routes/Checkout/PaymentStatus';
import OrderDetail from './Routes/Orders/OrderDetail';
import MyPurchases from './Routes/Orders/MyPurchases';
import MySales from './Routes/Orders/MySales';
import ConfirmReceipt from './Routes/Orders/ConfirmReceipt';
import DonationBatches from './Routes/Admin/DonationBatches';
import DonationBatchDetail from './Routes/Admin/DonationBatchDetail';
import CharityReviews from './Routes/Admin/CharityReviews';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
});

// Placeholder components
const Login = () => (
  <div className="min-h-screen flex items-center justify-center bg-gray-50">
    <div className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full">
      <h2 className="text-2xl font-bold text-emerald-600 mb-6 text-center">Login to Decluttr</h2>
      <button className="w-full btn-primary">Sign In</button>
    </div>
  </div>
);

const Register = () => (
  <div className="min-h-screen flex items-center justify-center bg-gray-50">
    <div className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full">
      <h2 className="text-2xl font-bold text-emerald-600 mb-6 text-center">Create Account</h2>
      <button className="w-full btn-primary">Sign Up</button>
    </div>
  </div>
);

const ListingDetail = () => <div className="p-8">Listing Detail Page</div>;
const Search = () => <div className="p-8">Search Page</div>;
const Categories = () => <div className="p-8">Categories Page</div>;
const Inbox = () => <div className="p-8">Inbox Page</div>;
const Thread = () => <div className="p-8">Thread Page</div>;
const Settings = () => <div className="p-8">Settings Page</div>;
const MyListings = () => <div className="p-8">My Listings Page</div>;

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>  {/* This is correct - using BrowserRouter */}
        <AuthProvider>
          <OrderProvider>
            <Toaster 
              position="top-center"
              toastOptions={{
                duration: 4000,
                style: {
                  background: '#10b981',
                  color: '#fff',
                },
              }}
            />
            
            <Routes>
              {/* Public routes */}
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              
              {/* Protected routes */}
              <Route element={<ProtectedRoute />}>
                <Route element={<AppShell />}>
                  {/* Main routes */}
                  <Route path="/" element={<Feed />} />
                  <Route path="/feed" element={<Feed />} />
                  <Route path="/profile" element={<Profile />} />
                  <Route path="/search" element={<Search />} />
                  <Route path="/categories" element={<Categories />} />
                  <Route path="/post" element={<PostItemWizard />} />
                  <Route path="/verify" element={<Verification />} />
                  <Route path="/settings" element={<Settings />} />
                  
                  {/* Listing routes */}
                  <Route path="/listing/:id" element={<ListingDetail />} />
                  <Route path="/my-listings" element={<MyListings />} />
                  
                  {/* Order routes */}
                  <Route path="/checkout/:id" element={<Checkout />} />
                  <Route path="/payment-status/:id" element={<PaymentStatus />} />
                  <Route path="/purchases" element={<MyPurchases />} />
                  <Route path="/sales" element={<MySales />} />
                  <Route path="/order/:id" element={<OrderDetail />} />
                  <Route path="/confirm-receipt/:id" element={<ConfirmReceipt />} />
                  
                  {/* Chat routes */}
                  <Route path="/inbox" element={<Inbox />} />
                  <Route path="/inbox/:id" element={<Thread />} />
                  
                  {/* Admin routes */}
                  <Route path="/admin/donations" element={<DonationBatches />} />
                  <Route path="/admin/donations/:id" element={<DonationBatchDetail />} />
                  <Route path="/admin/charity-reviews" element={<CharityReviews />} />
                </Route>
              </Route>
            </Routes>
          </OrderProvider>
        </AuthProvider>
      </BrowserRouter>
    </QueryClientProvider>
  );
}

export default App;