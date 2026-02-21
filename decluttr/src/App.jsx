import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { Toaster } from 'react-hot-toast'
import { AuthProvider } from './features/auth/AuthProvider'
import ProtectedRoute from './app/ProtectedRoute'
import AppShell from './components/Layout/AppShell'

// Pages
import Landing from './routes/Landing'
import Login from './routes/Auth/Login'
import Register from './routes/Auth/Register'
import ResetPassword from './routes/Auth/ResetPassword'
import Feed from './routes/Home/Feed'
import Search from './routes/Home/Search'
import Categories from './routes/Home/Categories'
import PostItemWizard from './routes/Post/PostItemWizard'
import ListingDetail from './routes/Listing/ListingDetail'
import MyListings from './routes/Listing/MyListings'
import Checkout from './routes/Checkout/Checkout'
import PaymentStatus from './routes/Checkout/PaymentStatus'
import MyPurchases from './routes/Orders/MyPurchases'
import MySales from './routes/Orders/MySales'
import OrderDetail from './routes/Orders/OrderDetail'
import Inbox from './routes/Chat/Inbox'
import Thread from './routes/Chat/Thread'
import Profile from './routes/Profile/Profile'
import Settings from './routes/Profile/Settings'
import DonationBatches from './routes/Admin/DonationBatches'

const queryClient = new QueryClient()

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <AuthProvider>
          <Toaster 
            position="top-center"
            toastOptions={{
              style: {
                background: '#10b981',
                color: '#fff',
              },
            }}
          />
          <Routes>
            <Route path="/" element={<Landing />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/reset-password" element={<ResetPassword />} />
            
            <Route element={<ProtectedRoute />}>
              <Route element={<AppShell />}>
                <Route path="/feed" element={<Feed />} />
                <Route path="/search" element={<Search />} />
                <Route path="/categories" element={<Categories />} />
                <Route path="/post" element={<PostItemWizard />} />
                <Route path="/listing/:id" element={<ListingDetail />} />
                <Route path="/my-listings" element={<MyListings />} />
                <Route path="/checkout/:id" element={<Checkout />} />
                <Route path="/payment-status/:id" element={<PaymentStatus />} />
                <Route path="/purchases" element={<MyPurchases />} />
                <Route path="/sales" element={<MySales />} />
                <Route path="/order/:id" element={<OrderDetail />} />
                <Route path="/inbox" element={<Inbox />} />
                <Route path="/inbox/:id" element={<Thread />} />
                <Route path="/profile" element={<Profile />} />
                <Route path="/settings" element={<Settings />} />
                <Route path="/admin/donations" element={<DonationBatches />} />
              </Route>
            </Route>
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </QueryClientProvider>
  )
}

export default App