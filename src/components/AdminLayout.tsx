import React, { useState } from 'react';
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  ShoppingBag,
  Receipt,
  Users,
  LogOut,
  User as UserIcon,
  Home,
  ChevronRight,
  Bell,
  Settings,
  Menu,
  X
} from 'lucide-react';
import toast from 'react-hot-toast';

export const AdminLayout: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const adminUser = JSON.parse(localStorage.getItem('admin_user') || '{}');
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const handleLogout = () => {
    localStorage.removeItem('admin_token');
    localStorage.removeItem('admin_user');
    toast.success('Đã đăng xuất thành công');
    navigate('/admin/login');
  };

  const navItems = [
    { path: '/admin/dashboard', name: 'Dashboard', icon: LayoutDashboard, badge: null },
    { path: '/admin/products', name: 'Sản Phẩm', icon: ShoppingBag, badge: null },
    { path: '/admin/orders', name: 'Đơn Hàng', icon: Receipt, badge: null },
    { path: '/admin/users', name: 'Quản Trị Viên', icon: Users, badge: null },
  ];

  const currentNav = navItems.find(item =>
    item.path === location.pathname ||
    (item.path === '/admin/dashboard' && location.pathname === '/admin')
  );

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#f0f2f5', fontFamily: 'var(--font-sans)' }}>
      <style>{`
        @keyframes slideIn { from { opacity:0; transform:translateX(-10px); } to { opacity:1; transform:translateX(0); } }
        .nav-item {
          display: flex; align-items: center; gap: 12px;
          padding: 11px 16px; border-radius: 12px;
          text-decoration: none; color: rgba(255,255,255,0.65);
          font-size: 0.88rem; font-weight: 500;
          transition: all 0.18s ease; cursor: pointer;
          margin-bottom: 4px; position: relative;
          white-space: nowrap; overflow: hidden;
        }
        .nav-item:hover { color: #fff; background: rgba(255,255,255,0.1); }
        .nav-item.active {
          color: #fff; font-weight: 700;
          background: linear-gradient(135deg, rgba(184,144,120,0.9) 0%, rgba(157,117,94,0.9) 100%);
          box-shadow: 0 4px 15px rgba(184,144,120,0.35);
        }
        .nav-item.active::before {
          content: '';
          position: absolute; left: 0; top: 50%;
          transform: translateY(-50%);
          width: 4px; height: 60%; background: #fff;
          border-radius: 0 4px 4px 0;
        }
        .sidebar-icon { flex-shrink: 0; transition: transform 0.15s; }
        .nav-item:hover .sidebar-icon { transform: scale(1.1); }
        .top-nav-link {
          font-size: 0.85rem; color: #888; font-weight: 500;
          padding: 6px 12px; border-radius: 8px; transition: all 0.15s;
          display: inline-flex; align-items: center; gap: 6px;
          text-decoration: none;
        }
        .top-nav-link:hover { background: #f0f0f0; color: #333; }
        .icon-btn {
          width: 38px; height: 38px; border-radius: 10px; border: 1px solid #e5e7eb;
          background: #fff; display: flex; align-items: center; justify-content: center;
          cursor: pointer; color: #888; transition: all 0.15s;
        }
        .icon-btn:hover { background: #f5f5f5; color: #333; }
        .content-card {
          background: #fff; border-radius: 16px;
          box-shadow: 0 2px 12px rgba(0,0,0,0.06);
        }
      `}</style>

      {/* Sidebar */}
      <aside style={{
        width: sidebarOpen ? '250px' : '0',
        minWidth: sidebarOpen ? '250px' : '0',
        background: 'linear-gradient(180deg, #1c1c2e 0%, #16213e 50%, #0f3460 100%)',
        display: 'flex', flexDirection: 'column',
        transition: 'all 0.3s ease', overflow: 'hidden',
        boxShadow: '4px 0 20px rgba(0,0,0,0.15)',
        position: 'relative', zIndex: 100, flexShrink: 0
      }}>
        {/* Brand */}
        <div style={{ padding: '28px 20px 20px', borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
          <Link to="/" style={{ textDecoration: 'none', display: 'block' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div style={{
                width: '38px', height: '38px', borderRadius: '10px',
                background: 'linear-gradient(135deg, var(--color-primary) 0%, var(--color-primary-dark) 100%)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                boxShadow: '0 4px 12px rgba(184,144,120,0.4)', flexShrink: 0
              }}>
                <ShoppingBag size={20} color="#fff" />
              </div>
              <div>
                <div style={{ color: '#fff', fontWeight: 800, fontSize: '1.05rem', letterSpacing: '1px', fontFamily: 'var(--font-serif)' }}>LEARTS</div>
                <div style={{ color: 'rgba(255,255,255,0.45)', fontSize: '0.68rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.1em' }}>Admin Panel</div>
              </div>
            </div>
          </Link>
        </div>

        {/* Navigation */}
        <nav style={{ flex: 1, padding: '16px 12px', overflowY: 'auto' }}>
          <div style={{ fontSize: '0.65rem', color: 'rgba(255,255,255,0.3)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.12em', padding: '4px 8px 12px' }}>
            Menu Chính
          </div>
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path ||
              (item.path === '/admin/dashboard' && location.pathname === '/admin');
            return (
              <Link key={item.path} to={item.path} className={`nav-item ${isActive ? 'active' : ''}`}>
                <Icon size={18} className="sidebar-icon" />
                <span style={{ flex: 1 }}>{item.name}</span>
                {isActive && <ChevronRight size={14} style={{ opacity: 0.7 }} />}
              </Link>
            );
          })}

          <div style={{ fontSize: '0.65rem', color: 'rgba(255,255,255,0.3)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.12em', padding: '20px 8px 12px' }}>
            Khác
          </div>
          <Link to="/" className="nav-item">
            <Home size={18} className="sidebar-icon" />
            <span>Về Trang Chủ</span>
          </Link>
        </nav>

        {/* User Profile */}
        <div style={{ padding: '16px 12px', borderTop: '1px solid rgba(255,255,255,0.08)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '12px', borderRadius: '12px', background: 'rgba(255,255,255,0.06)', marginBottom: '10px' }}>
            <div style={{
              width: '36px', height: '36px', borderRadius: '10px', flexShrink: 0,
              background: 'linear-gradient(135deg, var(--color-primary) 0%, var(--color-primary-dark) 100%)',
              display: 'flex', alignItems: 'center', justifyContent: 'center'
            }}>
              <UserIcon size={18} color="#fff" />
            </div>
            <div style={{ minWidth: 0, flex: 1 }}>
              <div style={{ color: '#fff', fontSize: '0.85rem', fontWeight: 600, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                {adminUser.username || 'Admin User'}
              </div>
              <div style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.72rem', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                {adminUser.email || 'admin@learts.com'}
              </div>
            </div>
          </div>
          <button onClick={handleLogout} style={{
            width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
            padding: '10px', borderRadius: '10px', border: '1px solid rgba(239,68,68,0.4)',
            background: 'rgba(239,68,68,0.1)', color: '#ff6b6b', cursor: 'pointer',
            fontSize: '0.82rem', fontWeight: 600, fontFamily: 'var(--font-sans)', transition: 'all 0.15s'
          }}>
            <LogOut size={15} /> Đăng Xuất
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0, overflow: 'hidden' }}>
        {/* Top Header */}
        <header style={{
          background: '#fff', borderBottom: '1px solid #f0f0f0',
          padding: '0 24px', height: '66px',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          boxShadow: '0 2px 10px rgba(0,0,0,0.04)', position: 'sticky', top: 0, zIndex: 50,
          gap: '16px'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <button onClick={() => setSidebarOpen(v => !v)} className="icon-btn">
              {sidebarOpen ? <X size={18} /> : <Menu size={18} />}
            </button>
            {/* Breadcrumb */}
            <nav style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Link to="/admin" className="top-nav-link">
                <LayoutDashboard size={14} /> Admin
              </Link>
              {currentNav && currentNav.path !== '/admin/dashboard' && (
                <>
                  <ChevronRight size={13} color="#ccc" />
                  <span style={{ fontSize: '0.85rem', fontWeight: 700, color: '#1a1a1a' }}>
                    {currentNav.name}
                  </span>
                </>
              )}
            </nav>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <button className="icon-btn" title="Thông báo">
              <Bell size={17} />
            </button>
            <button className="icon-btn" title="Cài đặt">
              <Settings size={17} />
            </button>
            <div style={{ height: '28px', width: '1px', background: '#e5e7eb' }} />
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div style={{
                width: '36px', height: '36px', borderRadius: '10px',
                background: 'linear-gradient(135deg, var(--color-primary) 0%, var(--color-primary-dark) 100%)',
                display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0
              }}>
                <UserIcon size={17} color="#fff" />
              </div>
              <div>
                <div style={{ fontWeight: 700, fontSize: '0.85rem', color: '#1a1a1a' }}>{adminUser.username || 'Admin'}</div>
                <div style={{ fontSize: '0.72rem', color: '#aaa' }}>Quản trị viên</div>
              </div>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main style={{ flex: 1, padding: '28px 28px 40px', overflowY: 'auto', overflowX: 'hidden' }}>
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;