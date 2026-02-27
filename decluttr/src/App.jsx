import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './features/auth/AuthProvider';
import ProtectedRoute from './app/ProtectedRoute';
import AppShell from './components/Layout/AppShell';
import Feed from './Routes/Home/Feed';

// Create a client for React Query
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
});

// Placeholder components for routes not yet implemented
const Login = () => (
  <div className="min-h-screen flex items-center justify-center bg-gray-50">
    <div className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full">
      <h2 className="text-2xl font-bold text-emerald-600 mb-6 text-center">Login to Decluttr</h2>
      <p className="text-gray-600 text-center mb-4">Login page coming soon!</p>
      <button className="w-full btn-primary">Sign In</button>
    </div>
  </div>
);

const Register = () => (
  <div className="min-h-screen flex items-center justify-center bg-gray-50">
    <div className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full">
      <h2 className="text-2xl font-bold text-emerald-600 mb-6 text-center">Create Account</h2>
      <p className="text-gray-600 text-center mb-4">Registration page coming soon!</p>
      <button className="w-full btn-primary">Sign Up</button>
    </div>
  </div>
);

const ListingDetail = () => (
  <div className="py-8">
    <h2 className="text-2xl font-bold mb-4">Listing Details</h2>
    <p className="text-gray-600">Listing detail page coming soon!</p>
  </div>
);

const MyListings = () => (
  <div className="py-8">
    <h2 className="text-2xl font-bold mb-4">My Listings</h2>
    <p className="text-gray-600">Your listings will appear here.</p>
  </div>
);

const Profile = () => (
  <div className="py-8">
    <h2 className="text-2xl font-bold mb-4">Profile</h2>
    <p className="text-gray-600">Profile page coming soon!</p>
  </div>
);

const Search = () => (
  <div className="py-8">
    <h2 className="text-2xl font-bold mb-4">Search</h2>
    <p className="text-gray-600">Advanced search coming soon!</p>
  </div>
);

const Categories = () => (
  <div className="py-8">
    <h2 className="text-2xl font-bold mb-4">Categories</h2>
    <p className="text-gray-600">Browse by category coming soon!</p>
  </div>
);

const PostItemWizard = () => (
  <div className="py-8">
    <h2 className="text-2xl font-bold mb-4">Post an Item</h2>
    <p className="text-gray-600">Item posting wizard coming soon!</p>
  </div>
);

const MyPurchases = () => (
  <div className="py-8">
    <h2 className="text-2xl font-bold mb-4">My Purchases</h2>
    <p className="text-gray-600">Your purchase history will appear here.</p>
  </div>
);

const MySales = () => (
  <div className="py-8">
    <h2 className="text-2xl font-bold mb-4">My Sales</h2>
    <p className="text-gray-600">Your sales history will appear here.</p>
  </div>
);

const OrderDetail = () => (
  <div className="py-8">
    <h2 className="text-2xl font-bold mb-4">Order Details</h2>
    <p className="text-gray-600">Order details coming soon!</p>
  </div>
);

const Inbox = () => (
  <div className="py-8">
    <h2 className="text-2xl font-bold mb-4">Inbox</h2>
    <p className="text-gray-600">Your messages will appear here.</p>
  </div>
);

const Thread = () => (
  <div className="py-8">
    <h2 className="text-2xl font-bold mb-4">Chat</h2>
    <p className="text-gray-600">Chat thread coming soon!</p>
  </div>
);

const Settings = () => (
  <div className="py-8">
    <h2 className="text-2xl font-bold mb-4">Settings</h2>
    <p className="text-gray-600">Account settings coming soon!</p>
  </div>
);

const Checkout = () => (
  <div className="py-8">
    <h2 className="text-2xl font-bold mb-4">Checkout</h2>
    <p className="text-gray-600">Checkout page coming soon!</p>
  </div>
);

const PaymentStatus = () => (
  <div className="py-8">
    <h2 className="text-2xl font-bold mb-4">Payment Status</h2>
    <p className="text-gray-600">Payment confirmation coming soon!</p>
  </div>
);

const DonationBatches = () => (
  <div className="py-8">
    <h2 className="text-2xl font-bold mb-4">Donation Batches</h2>
    <p className="text-gray-600">Admin donation management coming soon!</p>
  </div>
);

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <AuthProvider>
          <Toaster 
            position="top-center"
            toastOptions={{
              duration: 4000,
              style: {
                background: '#10b981',
                color: '#fff',
              },
              success: {
                style: {
                  background: '#10b981',
                },
              },
              error: {
                style: {
                  background: '#ef4444',
                },
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
                <Route path="/search" element={<Search />} />
                <Route path="/categories" element={<Categories />} />
                <Route path="/post" element={<PostItemWizard />} />
                
                {/* Listing routes */}
                <Route path="/listing/:id" element={<ListingDetail />} />
                <Route path="/my-listings" element={<MyListings />} />
                
                {/* Order routes */}
                <Route path="/checkout/:id" element={<Checkout />} />
                <Route path="/payment-status/:id" element={<PaymentStatus />} />
                <Route path="/purchases" element={<MyPurchases />} />
                <Route path="/sales" element={<MySales />} />
                <Route path="/order/:id" element={<OrderDetail />} />
                
                {/* Chat routes */}
                <Route path="/inbox" element={<Inbox />} />
                <Route path="/inbox/:id" element={<Thread />} />
                
                {/* Profile routes */}
                <Route path="/profile" element={<Profile />} />
                <Route path="/settings" element={<Settings />} />
                
                {/* Admin routes */}
                <Route path="/admin/donations" element={<DonationBatches />} />
              </Route>
            </Route>
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </QueryClientProvider>
  );
}

export default App;