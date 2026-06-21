import { Routes, Route, Navigate } from 'react-router-dom'
import ProtectedRoute from './routes/ProtectedRoutes.jsx'
import Login from './pages/auth/Login.jsx'
import Register from './pages/auth/Register.jsx'
import BrowseEvents from './pages/user/BrowseEvent.jsx'
import EventDetail from './pages/user/EventDetail.jsx'
import Payment from './pages/user/Payment.jsx'
import MyBookings from './pages/user/MyBookings.jsx'
import CreateEvent from './pages/organizer/CreateEvent.jsx'
import MyEvents from './pages/organizer/MyEvents.jsx'
import PendingEvents from './pages/admin/PendingEvents.jsx'
import PaymentCallback from './pages/user/PaymentCallback.jsx'
import ScanTicket from './pages/organizer/ScanTicket.jsx'
import Certificates from './pages/organizer/Certificates.jsx'
import AdminRegister from './pages/auth/AdminRegister.jsx'
import EditEvent from './pages/organizer/EditEvent.jsx'
import Landing from './pages/Landing.jsx'


export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/register-admin" element={<AdminRegister />} />
      <Route path="/events" element={
        <ProtectedRoute allowedRoles={['User']}>
          <BrowseEvents />
        </ProtectedRoute>
      } />

      <Route path="/events/:id" element={
      <ProtectedRoute allowedRoles={['User']}>
       <EventDetail />
      </ProtectedRoute>
      } />
      
      <Route path="/organizer/edit-event/:id" element={
  <ProtectedRoute allowedRoles={['Organizer']}>
    <EditEvent />
  </ProtectedRoute>
} />

     <Route path="/payment/:bookingId" element={
     <ProtectedRoute allowedRoles={['User']}>
      <Payment />
     </ProtectedRoute>
     } />
     
     <Route path="/payment/callback" element={
    <ProtectedRoute allowedRoles={['User']}>
      <PaymentCallback />
     </ProtectedRoute>
    } />

     <Route path="/my-bookings" element={
    <ProtectedRoute allowedRoles={['User']}>
      <MyBookings />
    </ProtectedRoute>
    } />
    
    <Route path="/scan-ticket" element={
  <ProtectedRoute allowedRoles={['Organizer', 'Admin']}>
    <ScanTicket />
  </ProtectedRoute>
   } />

     <Route path="/organizer/events" element={
    <ProtectedRoute allowedRoles={['Organizer']}>
    <MyEvents />
    </ProtectedRoute>
    } />

   <Route path="/organizer/create-event" element={
   <ProtectedRoute allowedRoles={['Organizer']}>
    <CreateEvent />
   </ProtectedRoute>
   } />
  
 
   <Route path="/organizer/certificates/:eventId" element={
  <ProtectedRoute allowedRoles={['Organizer']}>
    <Certificates />
  </ProtectedRoute>
   } />

  <Route path="/admin/pending" element={
  <ProtectedRoute allowedRoles={['Admin']}>
    <PendingEvents />
  </ProtectedRoute>
  } />
    </Routes>
  )
}