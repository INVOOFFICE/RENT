import { Routes, Route } from 'react-router';
import TopBar from './sections/TopBar';
import Navbar from './sections/Navbar';
import Hero from './sections/Hero';
import About from './sections/About';
import CarRentals from './sections/CarRentals';
import FAQ from './sections/FAQ';
import Footer from './sections/Footer';
import PwaInstallBanner from './components/PwaInstallBanner';
import { CurrencyProvider } from './lib/currency';
import './i18n';
import AdminLogin from './pages/admin/AdminLogin';
import AdminLayout from './pages/admin/AdminLayout';
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminCars from './pages/admin/AdminCars';
import AdminReservations from './pages/admin/AdminReservations';
import ProtectedRoute from './components/admin/ProtectedRoute';

function App() {
  return (
    <CurrencyProvider>
      <Routes>
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route
          path="/admin"
          element={
            <ProtectedRoute>
              <AdminLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<AdminDashboard />} />
          <Route path="cars" element={<AdminCars />} />
          <Route path="reservations" element={<AdminReservations />} />
        </Route>
        <Route
          path="*"
          element={
            <div className="min-h-screen font-inter overflow-x-hidden">
              <TopBar />
              <Navbar />
              <Hero />
              <About />
              <CarRentals />
              <FAQ />
              <Footer />
              <PwaInstallBanner />
            </div>
          }
        />
      </Routes>
    </CurrencyProvider>
  );
}

export default App;
