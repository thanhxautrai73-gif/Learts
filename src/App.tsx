import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from 'react-hot-toast';

// Layout Components
import { Header } from './components/Header';
import { Footer } from './components/Footer';

// Pages
import { Home } from './pages/Home';
import { Shop } from './pages/Shop';
import { ProductDetail } from './pages/ProductDetail';
import { Cart } from './pages/Cart';
import { Checkout } from './pages/Checkout';
import { AboutUs } from './pages/AboutUs';
import { ContactUs } from './pages/ContactUs';
import { Blog } from './pages/Blog';
import { Portfolio } from './pages/Portfolio';
import { Home2 } from './pages/Home2';
import { Home3 } from './pages/Home3';
import { Home4 } from './pages/Home4';
import { ShopLeftSidebar } from './pages/ShopLeftSidebar';
import { ShopRightSidebar } from './pages/ShopRightSidebar';
import { ShopFullwidth } from './pages/ShopFullwidth';
import { Portfolio4Columns } from './pages/Portfolio4Columns';
import { Portfolio5Columns } from './pages/Portfolio5Columns';
import { PortfolioDetails } from './pages/PortfolioDetails';
import { ElementsShowcase } from './pages/ElementsShowcase';
import { BlogGridRightSidebar } from './pages/BlogGridRightSidebar';
import { BlogGridLeftSidebar } from './pages/BlogGridLeftSidebar';
import { BlogGridFullWidth } from './pages/BlogGridFullWidth';
import { AboutUs2 } from './pages/AboutUs2';
import { ComingSoon } from './pages/ComingSoon';
import { Page404 } from './pages/Page404';
import { ShopOthers } from './pages/ShopOthers';

// Admin Components
import { AdminLogin } from './pages/admin/AdminLogin';
import { AdminRegister } from './pages/admin/AdminRegister';
import { AdminProducts } from './pages/admin/AdminProducts';
import { AdminOrders } from './pages/admin/AdminOrders';
import { ProtectedRoute } from './components/ProtectedRoute';

// Create React Query Client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
});

export const App: React.FC = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <div className="app-wrapper">
          {/* Header Section */}
          <Header />

          {/* Main Pages Content */}
          <main>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/home-1" element={<Home />} />
              <Route path="/home-2" element={<Home2 />} />
              <Route path="/home-3" element={<Home3 />} />
              <Route path="/home-4" element={<Home4 />} />
              <Route path="/shop" element={<Shop />} />
              <Route path="/shop-left-sidebar" element={<ShopLeftSidebar />} />
              <Route path="/shop-right-sidebar" element={<ShopRightSidebar />} />
              <Route path="/shop-fullwidth" element={<ShopFullwidth />} />
              <Route path="/product/:productId" element={<ProductDetail />} />
              <Route path="/cart" element={<Cart />} />
              <Route path="/checkout" element={<Checkout />} />
              <Route path="/wishlist" element={<ShopOthers />} />
              <Route path="/order-tracking" element={<ShopOthers />} />
              <Route path="/login" element={<ShopOthers />} />
              <Route path="/my-account" element={<ShopOthers />} />
              <Route path="/lost-password" element={<ShopOthers />} />
              <Route path="/about" element={<AboutUs />} />
              <Route path="/about-2" element={<AboutUs2 />} />
              <Route path="/contact" element={<ContactUs />} />
              <Route path="/coming-soon" element={<ComingSoon />} />
              <Route path="/page-404" element={<Page404 />} />
              <Route path="/blog" element={<Blog />} />
              <Route path="/blog-grid-right-sidebar" element={<BlogGridRightSidebar />} />
              <Route path="/blog-grid-left-sidebar" element={<BlogGridLeftSidebar />} />
              <Route path="/blog-grid-fullwidth" element={<BlogGridFullWidth />} />
              <Route path="/portfolio" element={<Portfolio />} />
              <Route path="/portfolio-3-columns" element={<Portfolio />} />
              <Route path="/portfolio-4-columns" element={<Portfolio4Columns />} />
              <Route path="/portfolio-5-columns" element={<Portfolio5Columns />} />
              <Route path="/portfolio-details" element={<PortfolioDetails />} />
              <Route path="/portfolio-details/:id" element={<PortfolioDetails />} />
              <Route path="/elements/:elementType" element={<ElementsShowcase />} />
              
              {/* Admin Routes */}
              <Route path="/admin/login" element={<AdminLogin />} />
              <Route path="/admin/register" element={<AdminRegister />} />
              <Route element={<ProtectedRoute />}>
                <Route path="/admin" element={<AdminProducts />} />
                <Route path="/admin/products" element={<AdminProducts />} />
                <Route path="/admin/orders" element={<AdminOrders />} />
              </Route>
              
              {/* Fallback to 404 Page if route not found */}
              <Route path="*" element={<Page404 />} />
            </Routes>
          </main>

          {/* Footer Section */}
          <Footer />
        </div>

        {/* Global Toast Notification System */}
        <Toaster 
          position="bottom-right" 
          toastOptions={{
            style: {
              fontFamily: 'var(--font-sans)',
              fontSize: '0.9rem',
              borderRadius: '0px',
              border: '1px solid var(--color-border)',
              boxShadow: 'var(--shadow-md)',
              padding: '12px 20px',
            },
            success: {
              iconTheme: {
                primary: 'var(--color-success)',
                secondary: '#fff',
              },
            },
            error: {
              iconTheme: {
                primary: 'var(--color-error)',
                secondary: '#fff',
              },
            },
          }} 
        />
      </BrowserRouter>
    </QueryClientProvider>
  );
};

export default App;
