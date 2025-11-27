// App.jsx - Updated with blog detail route
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { AuthProvider } from "./context/AuthContext";
import { CartProvider } from "./components/CartContext";

// Auth Components
import SignupLoginPage from "./pages/SignupLoginPage";
import AccountPage from "./components/Account";
import ProtectedRoute from "./components/ProtectedRoute";

// Public Pages
import LandingPage from "./pages/LandingPage";
import About from "./pages/About";
import Contact from "./pages/Contact";
import BlogsPage from "./pages/Blogs";
import BlogDetailPage from "./pages/BlogDetailPage"; // NEW IMPORT
import EventsPage from "./pages/Events"; 
import CategoriesPage from "./pages/CategoriesPage";
import FAQSection from "./pages/FAQs";

// Product Pages
import ComponentsListingPage from "./pages/ComponentsListingPage";
import ProductDetailPage from "./pages/ProductDetailPage";
import ComponentsPage from "./pages/ComponentsPage";
import Workstations from "./pages/Workstations";

// Shopping Components
import Cart from "./pages/Cart";
import Checkout from "./pages/Checkout";

// Admin Components
import AdminLayout from "./layouts/AdminLayout";
import AdminPanel from "./admin/AdminPanel";
import OrdersPage from "./admin/OrdersPage";
import ProductsPage from "./admin/ProductsPage";
import AdminComponentsPage from "./admin/AdminComponentsPage";
import UsersPage from "./admin/UsersPage";
import AdminEventPage from "./admin/AdminEventsPage";
import AdminBlogPage from "./admin/AdminBlogs";
import AdminContactsPage from "./admin/AdminContactsPage";
import AdminAboutPage from "./admin/AdminAboutPage";
import AdminWinnersPage from "./admin/AdminWinnersPage";
import AdminDealManagement from "./admin/AdminDealManagement";
import CarouselAdminPanel from "./admin/CarouselAdminPanel";

// Demo Components (for testing individual components)
import Hero3d from "./components/Hero3d";

import Test from "./pages/Test"
import PCBuilder from "./pages/PCBuilder";

// Animation Wrapper for route changes
function AnimatedRoutes() {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        {/* Test Routes */}
        <Route path="/test" element={wrap(<Test />)} />

        {/* Main Landing Page */}
        <Route path="/" element={wrap(<LandingPage />)} />
        <Route path="/landing" element={wrap(<LandingPage />)} />

        {/* Authentication Routes */}
        <Route path="/auth" element={wrap(<SignupLoginPage />)} />
        
        {/* Customer Protected Routes */}
        <Route
          path="/account"
          element={
            <ProtectedRoute>
              {wrap(<AccountPage />)}
            </ProtectedRoute>
          }
        />

        {/* Public Pages */}
        <Route path="/about" element={wrap(<About />)} />
        <Route path="/contact" element={wrap(<Contact />)} />
        <Route path="/faqs" element={wrap(<FAQSection />)} />
        <Route path="/blogs" element={wrap(<BlogsPage />)} />
        <Route path="/blog/:slug" element={wrap(<BlogDetailPage />)} /> {/* NEW ROUTE */}
        <Route path="/events" element={wrap(<EventsPage />)} />

        {/* Product Routes */}
        <Route path="/products" element={wrap(<CategoriesPage />)} />
        <Route path="/products/:categoryId" element={wrap(<ComponentsListingPage />)} />
        <Route path="/product/:productId" element={wrap(<ProductDetailPage />)} />
        
        {/* Specialized Product Pages */}
        <Route path="/components" element={wrap(<ComponentsPage />)} />
        <Route path="/workstations" element={wrap(<Workstations />)} />
        
        <Route path="/pcbuilder" element={wrap(<PCBuilder />)} />

        
        {/* Shopping Routes */}
        <Route 
          path="/cart" 
          element={
            <ProtectedRoute>
              {wrap(<Cart />)}
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/checkout" 
          element={
            <ProtectedRoute>
              {wrap(<Checkout />)}
            </ProtectedRoute>
          } 
        />

        {/* Demo/Test Routes */}
        <Route path="/demo/hero" element={wrap(<Hero3d />)} />
        

        {/* Admin Protected Routes */}
        <Route
          path="/admin"
          element={
            <ProtectedRoute adminOnly={true}>
              <AdminLayout><AdminPanel /></AdminLayout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin/dashboard"
          element={
            <ProtectedRoute adminOnly={true}>
              <AdminLayout><AdminPanel /></AdminLayout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin/orders"
          element={
            <ProtectedRoute adminOnly={true}>
              <AdminLayout><OrdersPage /></AdminLayout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin/products"
          element={
            <ProtectedRoute adminOnly={true}>
              <AdminLayout><ProductsPage /></AdminLayout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin/components"
          element={
            <ProtectedRoute adminOnly={true}>
              <AdminLayout><AdminComponentsPage /></AdminLayout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin/users"
          element={
            <ProtectedRoute adminOnly={true}>
              <AdminLayout><UsersPage /></AdminLayout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin/deals"
          element={
            <ProtectedRoute adminOnly={true}>
              <AdminLayout><AdminDealManagement /></AdminLayout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin/events"
          element={
            <ProtectedRoute adminOnly={true}>
              <AdminLayout><AdminEventPage /></AdminLayout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin/winners"
          element={
            <ProtectedRoute adminOnly={true}>
              <AdminLayout><AdminWinnersPage /></AdminLayout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin/blogs"
          element={
            <ProtectedRoute adminOnly={true}>
              <AdminLayout><AdminBlogPage /></AdminLayout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin/contacts"
          element={
            <ProtectedRoute adminOnly={true}>
              <AdminLayout><AdminContactsPage /></AdminLayout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin/about"
          element={
            <ProtectedRoute adminOnly={true}>
              <AdminLayout><AdminAboutPage /></AdminLayout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin/carousel"
          element={
            <ProtectedRoute adminOnly={true}>
              <AdminLayout><CarouselAdminPanel /></AdminLayout>
            </ProtectedRoute>
          }
        />

        {/* Catch-all route for 404 */}
        <Route path="*" element={wrap(<NotFound />)} />
      </Routes>
    </AnimatePresence>
  );
}

// Enhanced 404 component
function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200">
      <div className="text-center max-w-md mx-auto px-4">
        <div className="text-8xl mb-6">🔍</div>
        <h1 className="text-6xl font-bold text-gray-900 mb-4">404</h1>
        <h2 className="text-2xl font-semibold text-gray-700 mb-4">Page Not Found</h2>
        <p className="text-gray-600 mb-8">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <div className="space-y-4">
          <a
            href="/"
            className="block bg-purple-500 text-white px-6 py-3 rounded-lg hover:bg-purple-600 transition-colors font-semibold"
          >
            Go Home
          </a>
          <a
            href="/products"
            className="block bg-gray-500 text-white px-6 py-3 rounded-lg hover:bg-gray-600 transition-colors font-medium"
          >
            Browse Products
          </a>
        </div>
      </div>
    </div>
  );
}

function wrap(children) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ 
        duration: 0.3,
        ease: "easeInOut"
      }}
    >
      {children}
    </motion.div>
  );
}

// Main App with CartProvider
function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <BrowserRouter>
          <div className="min-h-screen">
            <AnimatedRoutes />
          </div>
        </BrowserRouter>
      </CartProvider>
    </AuthProvider>
  );
}

export default App;