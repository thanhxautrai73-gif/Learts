import React from 'react';
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, 
  ShoppingBag, 
  Receipt, 
  Users, 
  LogOut,
  User as UserIcon,
  Home
} from 'lucide-react';
import toast from 'react-hot-toast';

export const AdminLayout: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const adminUser = JSON.parse(localStorage.getItem('admin_user') || '{}');

  const handleLogout = () => {
    localStorage.removeItem('admin_token');
    localStorage.removeItem('admin_user');
    toast.success('Logged out successfully');
    navigate('/admin/login');
  };

  const navItems = [
    { path: '/admin/dashboard', name: 'Dashboard', icon: LayoutDashboard },
    { path: '/admin/products', name: 'Products', icon: ShoppingBag },
    { path: '/admin/orders', name: 'Orders', icon: Receipt },
    { path: '/admin/users', name: 'Admin Users', icon: Users },
  ];

  return (
    <div className="admin-layout d-flex" style={{ minHeight: '100vh', background: '#f8f9fa' }}>
      {/* Sidebar Section */}
      <aside className="bg-dark text-white p-4 d-flex flex-column" style={{ width: '260px', flexShrink: 0, boxShadow: '2px 0 10px rgba(0,0,0,0.1)' }}>
        <div className="brand-logo mb-5 text-center">
          <Link to="/" className="text-decoration-none">
            <h3 className="text-white font-weight-bold m-0" style={{ letterSpacing: '2px' }}>LEARTS</h3>
            <span className="text-muted small">Admin Dashboard</span>
          </Link>
        </div>

        {/* Navigation Menu */}
        <nav className="nav flex-column flex-grow-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path || (item.path === '/admin/dashboard' && location.pathname === '/admin');
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`nav-link d-flex align-items-center px-3 py-3 mb-2 rounded transition-all text-white ${
                  isActive 
                    ? 'bg-primary font-weight-bold' 
                    : 'opacity-75 hover-bg-dark-light'
                }`}
                style={{ 
                  transition: 'all 0.2s', 
                  backgroundColor: isActive ? 'var(--color-primary, #a88b67)' : 'transparent',
                  gap: '12px'
                }}
              >
                <Icon size={18} />
                <span>{item.name}</span>
              </Link>
            );
          })}
        </nav>

        {/* Bottom Actions */}
        <div className="border-top pt-4 mt-auto">
          <Link to="/" className="nav-link d-flex align-items-center text-white-50 px-3 py-2 mb-2 rounded hover-bg-dark-light" style={{ gap: '12px' }}>
            <Home size={18} />
            <span>Go to Shop</span>
          </Link>
          <button 
            onClick={handleLogout}
            className="btn btn-outline-danger w-100 d-flex align-items-center justify-content-center mt-2" 
            style={{ gap: '8px' }}
          >
            <LogOut size={16} />
            <span>Logout</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-grow-1 d-flex flex-column" style={{ overflowX: 'hidden' }}>
        {/* Top Header */}
        <header className="bg-white border-bottom px-4 py-3 d-flex justify-content-between align-items-center" style={{ height: '70px' }}>
          <h4 className="font-weight-bold text-capitalize m-0">
            {navItems.find(item => item.path === location.pathname)?.name || 'Admin Management'}
          </h4>
          
          <div className="d-flex align-items-center" style={{ gap: '12px' }}>
            <div className="avatar bg-light border rounded-circle d-flex align-items-center justify-content-center" style={{ width: '40px', height: '40px' }}>
              <UserIcon size={18} className="text-secondary" />
            </div>
            <div className="d-none d-md-block text-left">
              <h6 className="m-0 font-weight-bold">{adminUser.username || 'Admin'}</h6>
              <span className="text-muted small">{adminUser.email || 'admin@learts.com'}</span>
            </div>
          </div>
        </header>

        {/* Outlet for Dashboard Page Contents */}
        <main className="p-4 flex-grow-1" style={{ overflowY: 'auto' }}>
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
