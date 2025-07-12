import { Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import UserProfile from './pages/UserProfile';
import SwapDashboard from './pages/SwapDashboard';
import ProfileDetails from './pages/ProfileDetails';
import RequestForm from './pages/RequestForm';

function App() {
  return (
    <AuthProvider>
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <main className="container mx-auto px-4 py-8">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/profile" element={<UserProfile />} />
            <Route path="/swaps" element={<SwapDashboard />} />
            <Route path="/user/:id" element={<ProfileDetails />} />
            <Route path="/request/:userId" element={<RequestForm />} />
          </Routes>
        </main>
      </div>
    </AuthProvider>
  );
}

export default App; 