import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import HomePage from './pages/HomePage';
import CreateTripPage from './pages/CreateTripPage';
import TripDetailPage from './pages/TripDetailPage';
import ChatPage from './pages/ChatPage';
import ProfilePage from './pages/ProfilePage';
import DestinationPage from './pages/DestinationPage';

function PrivateRoute({ children }) {
  const token = localStorage.getItem('token');
  return token ? children : <Navigate to="/login" />;
}

export default function App() {
  return (
    <BrowserRouter>
      <div className="relative min-h-screen overflow-hidden">
        <div className="pointer-events-none absolute left-[-5rem] top-24 h-56 w-56 rounded-full bg-[#ffd166]/30 blur-3xl" />
        <div className="pointer-events-none absolute right-[-4rem] top-48 h-72 w-72 rounded-full bg-[#3ddbd9]/25 blur-3xl" />
        <Navbar />
        <main className="relative z-10 mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          <Routes>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/" element={<HomePage />} />
            <Route path="/trips/create" element={<PrivateRoute><CreateTripPage /></PrivateRoute>} />
            <Route path="/trips/:id" element={<TripDetailPage />} />
            <Route path="/destinations/:destination" element={<DestinationPage />} />
            <Route path="/chat/:tripId" element={<PrivateRoute><ChatPage /></PrivateRoute>} />
            <Route path="/profile/:id" element={<PrivateRoute><ProfilePage /></PrivateRoute>} />
          </Routes>
        </main>
        <Footer />
      </div>
    </BrowserRouter>
  );
}
