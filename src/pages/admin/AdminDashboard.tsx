import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  TrendingUp,
  TrendingDown,
  DollarSign,
  ShoppingBag,
  Receipt,
  Users,
  ArrowRight,
  AlertTriangle,
  Package,
  Clock,
  CheckCircle,
  XCircle,
  BarChart2,
  Star
} from 'lucide-react';
import {
  getAdminOrders,
  getProducts,
  getAdminUsers
} from '../../services/api';
import type { Order, Product } from '../../services/api';
import toast from 'react-hot-toast';

const formatPrice = (price: number) =>
  new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price * 23000);

const formatDate = (dateStr: string) => {
  const d = new Date(dateStr);
  return d.toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric' });
};

const getStatusStyle = (status: string) => {
  switch (status) {
    case 'Completed':  return { bg: 'rgba(16, 185, 129, 0.15)', color: '#10b981', border: 'rgba(16,185,129,0.3)', icon: <CheckCircle size={12} /> };
    case 'Processing': return { bg: 'rgba(59, 130, 246, 0.15)', color: '#3b82f6', border: 'rgba(59,130,246,0.3)', icon: <Clock size={12} /> };
    case 'Cancelled':  return { bg: 'rgba(239, 68, 68, 0.15)', color: '#ef4444', border: 'rgba(239,68,68,0.3)', icon: <XCircle size={12} /> };
    default:           return { bg: 'rgba(245, 158, 11, 0.15)', color: '#f59e0b', border: 'rgba(245,158,11,0.3)', icon: <Clock size={12} /> };
  }
};

export const AdminDashboard: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAll = async () => {
      try {
        const [ordersData, productsData, usersData] = await Promise.all([
          getAdminOrders(),
          getProducts({ limit: 1000 }).then(r => r.products),
          getAdminUsers()
        ]);
        setOrders(ordersData);
        setProducts(productsData);
        setUsers(usersData);
      } catch (err) {
        toast.error('Không thể tải dữ liệu dashboard');
      } finally {
        setLoading(false);
      }
    };
    fetchAll();
  }, []);

  const totalRevenue = orders.filter(o => o.status === 'Completed').reduce((s, o) => s + o.totalAmount, 0);
  const pendingOrders = orders.filter(o => o.status === 'Pending').length;
  const completedOrders = orders.filter(o => o.status === 'Completed').length;
  const cancelledOrders = orders.filter(o => o.status === 'Cancelled').length;
  const recentOrders = [...orders].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()).slice(0, 7);
  const lowStockProducts = products.filter(p => p.stockQuantity <= 5).sort((a, b) => a.stockQuantity - b.stockQuantity);
  const topProducts = products.slice(0, 5);

  const statCards = [
    {
      title: 'Tổng Doanh Thu',
      value: formatPrice(totalRevenue),
      sub: `${completedOrders} đơn hoàn thành`,
      icon: DollarSign,
      gradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      trend: '+12.5%',
      trendUp: true
    },
    {
      title: 'Tổng Đơn Hàng',
      value: orders.length,
      sub: `${pendingOrders} đang chờ xử lý`,
      icon: Receipt,
      gradient: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
      trend: '+8.2%',
      trendUp: true
    },
    {
      title: 'Sản Phẩm',
      value: products.length,
      sub: `${lowStockProducts.length} sắp hết hàng`,
      icon: ShoppingBag,
      gradient: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
      trend: '+3',
      trendUp: true
    },
    {
      title: 'Quản Trị Viên',
      value: users.length,
      sub: 'Tài khoản đang hoạt động',
      icon: Users,
      gradient: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',
      trend: 'Ổn định',
      trendUp: true
    }
  ];

  const orderStats = [
    { label: 'Chờ xử lý', count: pendingOrders, color: '#f59e0b', width: orders.length ? (pendingOrders / orders.length) * 100 : 0 },
    { label: 'Đang xử lý', count: orders.filter(o => o.status === 'Processing').length, color: '#3b82f6', width: orders.length ? (orders.filter(o => o.status === 'Processing').length / orders.length) * 100 : 0 },
    { label: 'Hoàn thành', count: completedOrders, color: '#10b981', width: orders.length ? (completedOrders / orders.length) * 100 : 0 },
    { label: 'Đã huỷ', count: cancelledOrders, color: '#ef4444', width: orders.length ? (cancelledOrders / orders.length) * 100 : 0 },
  ];

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '60vh', flexDirection: 'column', gap: '16px' }}>
        <div style={{
          width: '48px', height: '48px', border: '3px solid #f3f4f6',
          borderTop: '3px solid #b89078', borderRadius: '50%',
          animation: 'spin 0.8s linear infinite'
        }} />
        <p style={{ color: '#888', fontSize: '0.9rem' }}>Đang tải dữ liệu...</p>
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  return (
    <div style={{ fontFamily: 'var(--font-sans)' }}>
      <style>{`
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes countUp {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        .stat-card {
          animation: fadeUp 0.5s ease forwards;
          transition: transform 0.2s ease, box-shadow 0.2s ease;
        }
        .stat-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 20px 40px rgba(0,0,0,0.12) !important;
        }
        .order-row:hover {
          background: rgba(184,144,120,0.05) !important;
        }
        .progress-bar-fill {
          transition: width 1s ease;
        }
        .dashboard-table th {
          font-size: 0.72rem;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.08em;
          color: #888;
          padding: 14px 18px;
          border-bottom: 1px solid #f0f0f0;
          background: #fafafa;
          white-space: nowrap;
        }
        .dashboard-table td {
          padding: 14px 18px;
          border-bottom: 1px solid #f5f5f5;
          font-size: 0.88rem;
          color: #333;
          vertical-align: middle;
        }
        .status-badge {
          display: inline-flex;
          align-items: center;
          gap: 5px;
          padding: 4px 10px;
          border-radius: 20px;
          font-size: 0.75rem;
          font-weight: 600;
          border: 1px solid;
        }
      `}</style>

      {/* Page Header */}
      <div style={{ marginBottom: '28px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '12px' }}>
        <div>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 700, color: '#1a1a1a', margin: 0, fontFamily: 'var(--font-sans)' }}>
            Tổng Quan Dashboard
          </h1>
          <p style={{ color: '#888', marginTop: '4px', fontSize: '0.9rem' }}>
            Chào mừng trở lại! Đây là tình hình cửa hàng hôm nay.
          </p>
        </div>
        <div style={{
          display: 'flex', alignItems: 'center', gap: '8px',
          background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
          color: '#fff', padding: '10px 18px', borderRadius: '10px',
          fontSize: '0.85rem', fontWeight: 600, boxShadow: '0 4px 15px rgba(16,185,129,0.3)'
        }}>
          <TrendingUp size={16} />
          Cửa hàng đang hoạt động tốt
        </div>
      </div>

      {/* Stats Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '20px', marginBottom: '28px' }}>
        {statCards.map((card, i) => {
          const Icon = card.icon;
          return (
            <div key={i} className="stat-card" style={{
              background: '#fff', borderRadius: '16px', padding: '24px',
              boxShadow: '0 4px 20px rgba(0,0,0,0.06)', animationDelay: `${i * 0.08}s`,
              position: 'relative', overflow: 'hidden'
            }}>
              <div style={{
                position: 'absolute', top: 0, right: 0, width: '80px', height: '80px',
                background: card.gradient, opacity: 0.08, borderRadius: '0 16px 0 80px'
              }} />
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
                <div style={{
                  width: '46px', height: '46px', borderRadius: '12px',
                  background: card.gradient, display: 'flex', alignItems: 'center',
                  justifyContent: 'center', boxShadow: '0 4px 12px rgba(0,0,0,0.15)'
                }}>
                  <Icon size={22} color="#fff" />
                </div>
                <span style={{
                  display: 'flex', alignItems: 'center', gap: '4px',
                  fontSize: '0.75rem', fontWeight: 600,
                  color: card.trendUp ? '#10b981' : '#ef4444'
                }}>
                  {card.trendUp ? <TrendingUp size={13} /> : <TrendingDown size={13} />}
                  {card.trend}
                </span>
              </div>
              <div style={{ fontSize: '1.6rem', fontWeight: 800, color: '#1a1a1a', lineHeight: 1.2, marginBottom: '6px' }}>
                {card.value}
              </div>
              <div style={{ fontSize: '0.82rem', fontWeight: 600, color: '#555', marginBottom: '4px' }}>
                {card.title}
              </div>
              <div style={{ fontSize: '0.78rem', color: '#aaa' }}>{card.sub}</div>
            </div>
          );
        })}
      </div>

      {/* Main Content Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: '20px', marginBottom: '20px' }}>
        {/* Recent Orders */}
        <div style={{ background: '#fff', borderRadius: '16px', boxShadow: '0 4px 20px rgba(0,0,0,0.06)', overflow: 'hidden' }}>
          <div style={{ padding: '20px 24px', borderBottom: '1px solid #f0f0f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Receipt size={18} color="#fff" />
              </div>
              <div>
                <h3 style={{ margin: 0, fontSize: '1rem', fontWeight: 700, color: '#1a1a1a' }}>Đơn Hàng Gần Đây</h3>
                <p style={{ margin: 0, fontSize: '0.78rem', color: '#aaa' }}>${recentOrders.length} đơn hàng mới nhất</p>
              </div>
            </div>
            <Link to="/admin/orders" style={{
              display: 'flex', alignItems: 'center', gap: '6px',
              color: 'var(--color-primary)', fontWeight: 600, fontSize: '0.82rem',
              padding: '6px 14px', border: '1px solid var(--color-primary)',
              borderRadius: '8px', transition: 'all 0.2s'
            }}>
              Xem tất cả <ArrowRight size={14} />
            </Link>
          </div>
          <div style={{ overflowX: 'auto' }}>
            <table className="dashboard-table" style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr>
                  <th>Mã ĐH</th>
                  <th>Khách Hàng</th>
                  <th>Trạng Thái</th>
                  <th>Ngày Đặt</th>
                  <th style={{ textAlign: 'right' }}>Tổng Tiền</th>
                </tr>
              </thead>
              <tbody>
                {recentOrders.length === 0 ? (
                  <tr>
                    <td colSpan={5} style={{ textAlign: 'center', padding: '40px', color: '#aaa' }}>
                      <Package size={32} style={{ marginBottom: '10px', opacity: 0.4 }} />
                      <div>Chưa có đơn hàng nào</div>
                    </td>
                  </tr>
                ) : recentOrders.map((order) => {
                  const statusStyle = getStatusStyle(order.status);
                  return (
                    <tr key={order.id} className="order-row" style={{ cursor: 'pointer', transition: 'background 0.15s' }}>
                      <td><span style={{ fontWeight: 700, color: 'var(--color-primary)', fontFamily: 'monospace' }}>#${order.id}</span></td>
                      <td>
                        <div style={{ fontWeight: 600, color: '#1a1a1a' }}>{order.name}</div>
                        <div style={{ fontSize: '0.78rem', color: '#aaa' }}>{order.email}</div>
                      </td>
                      <td>
                        <span className="status-badge" style={{ background: statusStyle.bg, color: statusStyle.color, borderColor: statusStyle.border }}>
                          {statusStyle.icon} {order.status}
                        </span>
                      </td>
                      <td style={{ color: '#888' }}>{formatDate(order.createdAt)}</td>
                      <td style={{ textAlign: 'right', fontWeight: 700, color: '#1a1a1a' }}>
                        ${order.totalAmount.toFixed(2)}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Order Status Breakdown */}
        <div style={{ background: '#fff', borderRadius: '16px', boxShadow: '0 4px 20px rgba(0,0,0,0.06)', padding: '24px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px' }}>
            <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <BarChart2 size={18} color="#fff" />
            </div>
            <div>
              <h3 style={{ margin: 0, fontSize: '1rem', fontWeight: 700, color: '#1a1a1a' }}>Phân Tích Đơn Hàng</h3>
              <p style={{ margin: 0, fontSize: '0.78rem', color: '#aaa' }}>Tổng ${orders.length} đơn hàng</p>
            </div>
          </div>

          {/* Donut chart visual */}
          <div style={{ position: 'relative', display: 'flex', justifyContent: 'center', marginBottom: '24px' }}>
            <svg width="140" height="140" viewBox="0 0 140 140">
              {(() => {
                const total = orders.length || 1;
                let offset = 0;
                const colors = ['#f59e0b', '#3b82f6', '#10b981', '#ef4444'];
                const counts = [pendingOrders, orders.filter(o => o.status === 'Processing').length, completedOrders, cancelledOrders];
                const circumference = 2 * Math.PI * 50;
                return counts.map((count, idx) => {
                  const dash = (count / total) * circumference;
                  const el = (
                    <circle
                      key={idx}
                      cx="70" cy="70" r="50"
                      fill="none"
                      stroke={colors[idx]}
                      strokeWidth="20"
                      strokeDasharray={`${dash} ${circumference - dash}`}
                      strokeDashoffset={-offset}
                      transform="rotate(-90 70 70)"
                      style={{ transition: 'stroke-dasharray 1s ease' }}
                    />
                  );
                  offset += dash;
                  return el;
                });
              })()}
              <text x="70" y="65" textAnchor="middle" style={{ fontSize: '22px', fontWeight: 800, fill: '#1a1a1a' }}>${orders.length}</text>
              <text x="70" y="82" textAnchor="middle" style={{ fontSize: '10px', fill: '#aaa', fontFamily: 'inherit' }}>tổng</text>
            </svg>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {orderStats.map((stat, i) => (
              <div key={i}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                  <span style={{ fontSize: '0.82rem', color: '#555', fontWeight: 500 }}>{stat.label}</span>
                  <span style={{ fontSize: '0.82rem', fontWeight: 700, color: stat.color }}>{stat.count}</span>
                </div>
                <div style={{ height: '6px', background: '#f0f0f0', borderRadius: '3px', overflow: 'hidden' }}>
                  <div className="progress-bar-fill" style={{ height: '100%', width: `${stat.width}%`, background: stat.color, borderRadius: '3px' }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom Row */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
        {/* Low Stock Warning */}
        <div style={{ background: '#fff', borderRadius: '16px', boxShadow: '0 4px 20px rgba(0,0,0,0.06)', overflow: 'hidden' }}>
          <div style={{ padding: '20px 24px', borderBottom: '1px solid #f0f0f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: 'linear-gradient(135deg, #ff9a9e 0%, #fad0c4 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <AlertTriangle size={18} color="#fff" />
              </div>
              <div>
                <h3 style={{ margin: 0, fontSize: '1rem', fontWeight: 700, color: '#1a1a1a' }}>Cảnh Báo Hết Hàng</h3>
                <p style={{ margin: 0, fontSize: '0.78rem', color: '#aaa' }}>Sản phẩm tồn kho thấp</p>
              </div>
            </div>
            {lowStockProducts.length > 0 && (
              <span style={{ background: '#fef2f2', color: '#ef4444', padding: '4px 10px', borderRadius: '20px', fontSize: '0.75rem', fontWeight: 700, border: '1px solid rgba(239,68,68,0.2)' }}>
                ${lowStockProducts.length} cảnh báo
              </span>
            )}
          </div>
          <div style={{ maxHeight: '300px', overflowY: 'auto', padding: '8px 0' }}>
            {lowStockProducts.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '40px', color: '#aaa' }}>
                <CheckCircle size={32} style={{ marginBottom: '10px', color: '#10b981', opacity: 0.6 }} />
                <div style={{ fontWeight: 600, color: '#10b981' }}>Tất cả sản phẩm đủ hàng!</div>
              </div>
            ) : lowStockProducts.map((prod) => (
              <div key={prod.id} style={{
                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                padding: '12px 24px', borderBottom: '1px solid #f9f9f9', transition: 'background 0.15s'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <img src={prod.imageUrl} alt={prod.name} style={{ width: '42px', height: '42px', borderRadius: '10px', objectFit: 'cover', border: '1px solid #f0f0f0' }} />
                  <div>
                    <div style={{ fontWeight: 600, fontSize: '0.88rem', color: '#1a1a1a' }}>{prod.name}</div>
                    <div style={{ fontSize: '0.75rem', color: '#aaa' }}>#${prod.id}</div>
                  </div>
                </div>
                <span style={{
                  background: prod.stockQuantity === 0 ? '#fef2f2' : '#fff7ed',
                  color: prod.stockQuantity === 0 ? '#ef4444' : '#f59e0b',
                  border: `1px solid ${prod.stockQuantity === 0 ? 'rgba(239,68,68,0.3)' : 'rgba(245,158,11,0.3)'}`,
                  padding: '4px 10px', borderRadius: '20px', fontSize: '0.75rem', fontWeight: 700
                }}>
                  {prod.stockQuantity === 0 ? 'Hết hàng' : `${prod.stockQuantity} còn`}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Top Products */}
        <div style={{ background: '#fff', borderRadius: '16px', boxShadow: '0 4px 20px rgba(0,0,0,0.06)', overflow: 'hidden' }}>
          <div style={{ padding: '20px 24px', borderBottom: '1px solid #f0f0f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Star size={18} color="#fff" />
              </div>
              <div>
                <h3 style={{ margin: 0, fontSize: '1rem', fontWeight: 700, color: '#1a1a1a' }}>Sản Phẩm Nổi Bật</h3>
                <p style={{ margin: 0, fontSize: '0.78rem', color: '#aaa' }}>Top 5 sản phẩm</p>
              </div>
            </div>
            <Link to="/admin/products" style={{
              display: 'flex', alignItems: 'center', gap: '6px',
              color: 'var(--color-primary)', fontWeight: 600, fontSize: '0.82rem',
              padding: '6px 14px', border: '1px solid var(--color-primary)',
              borderRadius: '8px', transition: 'all 0.2s'
            }}>
              Xem tất cả <ArrowRight size={14} />
            </Link>
          </div>
          <div style={{ padding: '8px 0' }}>
            {topProducts.map((prod, i) => (
              <div key={prod.id} style={{
                display: 'flex', alignItems: 'center', gap: '14px',
                padding: '12px 24px', borderBottom: '1px solid #f9f9f9'
              }}>
                <div style={{
                  width: '28px', height: '28px', borderRadius: '50%', flexShrink: 0,
                  background: i === 0 ? 'linear-gradient(135deg, #f6d365 0%, #fda085 100%)' : i === 1 ? 'linear-gradient(135deg, #a1c4fd 0%, #c2e9fb 100%)' : '#f5f5f5',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontWeight: 800, fontSize: '0.8rem', color: i < 2 ? '#fff' : '#aaa'
                }}>
                  {i + 1}
                </div>
                <img src={prod.imageUrl} alt={prod.name} style={{ width: '42px', height: '42px', borderRadius: '10px', objectFit: 'cover', border: '1px solid #f0f0f0', flexShrink: 0 }} />
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontWeight: 600, fontSize: '0.88rem', color: '#1a1a1a', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{prod.name}</div>
                  <div style={{ fontSize: '0.75rem', color: '#aaa' }}>Tồn kho: {prod.stockQuantity}</div>
                </div>
                <div style={{ fontWeight: 700, fontSize: '0.9rem', color: 'var(--color-primary)', flexShrink: 0 }}>
                  $${prod.price.toFixed(2)}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;