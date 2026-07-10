import React, { useEffect, useState } from 'react';
import {
  Search, Filter, RefreshCw, Eye, ChevronDown,
  Clock, CheckCircle, XCircle, Package, Phone,
  Mail, MapPin, ShoppingCart, Calendar, DollarSign,
  ChevronLeft, ChevronRight, X, TrendingUp
} from 'lucide-react';
import toast from 'react-hot-toast';
import { getAdminOrders, updateOrderStatus } from '../../services/api';
import type { Order } from '../../services/api';

const STATUS_OPTIONS = ['Pending', 'Processing', 'Completed', 'Cancelled'];

const STATUS_CONFIG: Record<string, { label: string; color: string; bg: string; border: string; icon: React.ReactNode }> = {
  Pending:    { label: 'Chờ xử lý',  color: '#f59e0b', bg: 'rgba(245,158,11,0.12)',  border: 'rgba(245,158,11,0.3)',  icon: <Clock size={13} /> },
  Processing: { label: 'Đang xử lý', color: '#3b82f6', bg: 'rgba(59,130,246,0.12)',  border: 'rgba(59,130,246,0.3)',  icon: <RefreshCw size={13} /> },
  Completed:  { label: 'Hoàn thành', color: '#10b981', bg: 'rgba(16,185,129,0.12)',  border: 'rgba(16,185,129,0.3)',  icon: <CheckCircle size={13} /> },
  Cancelled:  { label: 'Đã huỷ',     color: '#ef4444', bg: 'rgba(239,68,68,0.12)',   border: 'rgba(239,68,68,0.3)',   icon: <XCircle size={13} /> },
};

const formatDate = (dateStr: string) =>
  new Date(dateStr).toLocaleString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' });

const PAGE_SIZE = 10;

export const AdminOrders: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [filtered, setFiltered] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [updatingId, setUpdatingId] = useState<number | null>(null);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const data = await getAdminOrders();
      const sorted = [...data].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
      setOrders(sorted);
      applyFilter(sorted, search, statusFilter);
    } catch {
      toast.error('Không thể tải dữ liệu đơn hàng');
    } finally {
      setLoading(false);
    }
  };

  const applyFilter = (data: Order[], q: string, status: string) => {
    let result = data;
    if (q.trim()) {
      const lower = q.toLowerCase();
      result = result.filter(o =>
        o.name.toLowerCase().includes(lower) ||
        o.email.toLowerCase().includes(lower) ||
        o.phone.includes(lower) ||
        String(o.id).includes(lower)
      );
    }
    if (status) result = result.filter(o => o.status === status);
    setFiltered(result);
    setCurrentPage(1);
  };

  useEffect(() => { fetchOrders(); }, []);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const q = e.target.value;
    setSearch(q);
    applyFilter(orders, q, statusFilter);
  };

  const handleStatusFilter = (status: string) => {
    setStatusFilter(status);
    applyFilter(orders, search, status);
  };

  const handleStatusChange = async (orderId: number, newStatus: string) => {
    setUpdatingId(orderId);
    try {
      await updateOrderStatus(orderId, newStatus);
      toast.success(`Cập nhật trạng thái → ${STATUS_CONFIG[newStatus]?.label || newStatus}`);
      const updated = orders.map(o => o.id === orderId ? { ...o, status: newStatus as Order['status'] } : o);
      setOrders(updated);
      applyFilter(updated, search, statusFilter);
      if (selectedOrder?.id === orderId) {
        setSelectedOrder(prev => prev ? { ...prev, status: newStatus as Order['status'] } : null);
      }
    } catch {
      toast.error('Cập nhật thất bại, thử lại');
    } finally {
      setUpdatingId(null);
    }
  };

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const paginated = filtered.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);

  const stats = {
    total: orders.length,
    pending: orders.filter(o => o.status === 'Pending').length,
    processing: orders.filter(o => o.status === 'Processing').length,
    completed: orders.filter(o => o.status === 'Completed').length,
    cancelled: orders.filter(o => o.status === 'Cancelled').length,
    revenue: orders.filter(o => o.status === 'Completed').reduce((s, o) => s + o.totalAmount, 0)
  };

  return (
    <div style={{ fontFamily: 'var(--font-sans)' }}>
      <style>{`
        @keyframes slideIn { from { opacity:0; transform: translateX(20px); } to { opacity:1; transform:translateX(0); } }
        @keyframes fadeIn { from { opacity:0; } to { opacity:1; } }
        @keyframes spin { to { transform: rotate(360deg); } }
        @keyframes modalIn { from { opacity:0; transform:scale(0.95) translateY(10px); } to { opacity:1; transform:scale(1) translateY(0); } }
        .order-row { transition: background 0.15s; cursor: pointer; }
        .order-row:hover { background: rgba(184,144,120,0.04) !important; }
        .status-select {
          border: none; background: transparent; font-size: 0.8rem; font-weight: 700;
          cursor: pointer; appearance: none; padding: 0 16px 0 0;
          outline: none; font-family: var(--font-sans);
        }
        .tab-btn {
          padding: 8px 16px; border-radius: 8px; border: 1.5px solid #e5e7eb;
          background: #fff; cursor: pointer; font-size: 0.82rem; font-weight: 600;
          color: #555; transition: all 0.15s; display: inline-flex; align-items: center; gap: 6px;
          font-family: var(--font-sans);
        }
        .tab-btn:hover { border-color: var(--color-primary); color: var(--color-primary); }
        .tab-btn.active { background: var(--color-primary); border-color: var(--color-primary); color: #fff; }
        .pagination-btn {
          width: 34px; height: 34px; border-radius: 8px; border: 1px solid #e5e7eb;
          background: #fff; cursor: pointer; display: inline-flex;
          align-items: center; justify-content: center; font-size: 0.85rem;
          font-weight: 600; transition: all 0.15s; color: #555;
        }
        .pagination-btn:hover:not(:disabled) { border-color: var(--color-primary); color: var(--color-primary); }
        .pagination-btn.active { background: var(--color-primary); border-color: var(--color-primary); color: #fff; }
        .pagination-btn:disabled { opacity: 0.4; cursor: not-allowed; }
        .form-input:focus { border-color: var(--color-primary) !important; box-shadow: 0 0 0 3px rgba(184,144,120,0.12) !important; }
      `}</style>

      {/* Page Header */}
      <div style={{ marginBottom: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '12px' }}>
        <div>
          <h1 style={{ fontSize: '1.6rem', fontWeight: 700, color: '#1a1a1a', margin: 0 }}>Quản Lý Đơn Hàng</h1>
          <p style={{ color: '#888', marginTop: '4px', fontSize: '0.88rem' }}>
            Xử lý và theo dõi tất cả đơn hàng của khách hàng
          </p>
        </div>
        <button onClick={fetchOrders} style={{
          display: 'flex', alignItems: 'center', gap: '8px',
          background: '#fff', color: '#555', border: '1.5px solid #e5e7eb',
          padding: '10px 18px', borderRadius: '10px', fontWeight: 600, fontSize: '0.88rem',
          cursor: 'pointer', transition: 'all 0.2s', fontFamily: 'var(--font-sans)'
        }}>
          <RefreshCw size={16} /> Làm mới
        </button>
      </div>

      {/* Stats Row */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: '16px', marginBottom: '24px' }}>
        {[
          { label: 'Tổng Đơn Hàng', value: stats.total, color: '#667eea', bg: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' },
          { label: 'Chờ Xử Lý', value: stats.pending, color: '#f59e0b', bg: 'linear-gradient(135deg, #f6d365 0%, #fda085 100%)' },
          { label: 'Đang Xử Lý', value: stats.processing, color: '#3b82f6', bg: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)' },
          { label: 'Hoàn Thành', value: stats.completed, color: '#10b981', bg: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)' },
          { label: 'Đã Huỷ', value: stats.cancelled, color: '#ef4444', bg: 'linear-gradient(135deg, #ff9a9e 0%, #fad0c4 100%)' },
        ].map((stat, i) => (
          <div key={i} style={{ background: '#fff', borderRadius: '14px', padding: '18px 20px', boxShadow: '0 2px 10px rgba(0,0,0,0.05)', display: 'flex', alignItems: 'center', gap: '14px' }}>
            <div style={{ width: '42px', height: '42px', borderRadius: '12px', background: stat.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <TrendingUp size={20} color="#fff" />
            </div>
            <div>
              <div style={{ fontSize: '1.5rem', fontWeight: 800, color: '#1a1a1a', lineHeight: 1 }}>{stat.value}</div>
              <div style={{ fontSize: '0.75rem', color: '#aaa', marginTop: '4px', fontWeight: 500 }}>{stat.label}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Filters Toolbar */}
      <div style={{ background: '#fff', borderRadius: '14px', padding: '16px 20px', marginBottom: '20px', boxShadow: '0 2px 10px rgba(0,0,0,0.05)' }}>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px', alignItems: 'center' }}>
          {/* Search */}
          <div style={{ position: 'relative', flex: '1', minWidth: '220px', maxWidth: '360px' }}>
            <Search size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#aaa' }} />
            <input
              type="text"
              placeholder="Tìm theo tên, email, SĐT, mã đơn..."
              value={search}
              onChange={handleSearch}
              className="form-input"
              style={{ width: '100%', padding: '10px 14px 10px 38px', border: '1.5px solid #e5e7eb', borderRadius: '10px', fontSize: '0.88rem', outline: 'none', fontFamily: 'var(--font-sans)', transition: 'border-color 0.2s, box-shadow 0.2s' }}
            />
          </div>

          {/* Status Tabs */}
          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', alignItems: 'center' }}>
            <Filter size={14} style={{ color: '#aaa', flexShrink: 0 }} />
            <button className={`tab-btn ${statusFilter === '' ? 'active' : ''}`} onClick={() => handleStatusFilter('')}>
              Tất cả <span style={{ opacity: 0.8 }}>({stats.total})</span>
            </button>
            {STATUS_OPTIONS.map(s => (
              <button key={s} className={`tab-btn ${statusFilter === s ? 'active' : ''}`} onClick={() => handleStatusFilter(s)}>
                {STATUS_CONFIG[s].icon}
                {STATUS_CONFIG[s].label}
                <span style={{ opacity: 0.8 }}>({orders.filter(o => o.status === s).length})</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Orders Table */}
      <div style={{ background: '#fff', borderRadius: '14px', boxShadow: '0 2px 10px rgba(0,0,0,0.05)', overflow: 'hidden' }}>
        {loading ? (
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '80px', flexDirection: 'column', gap: '14px' }}>
            <div style={{ width: '40px', height: '40px', border: '3px solid #f3f4f6', borderTop: '3px solid var(--color-primary)', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
            <p style={{ color: '#aaa', fontSize: '0.88rem' }}>Đang tải đơn hàng...</p>
          </div>
        ) : paginated.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '80px 20px', color: '#aaa' }}>
            <Package size={48} style={{ marginBottom: '16px', opacity: 0.3 }} />
            <h3 style={{ color: '#ccc', marginBottom: '8px' }}>Không tìm thấy đơn hàng</h3>
            <p style={{ fontSize: '0.88rem' }}>Thử thay đổi bộ lọc hoặc từ khóa tìm kiếm</p>
          </div>
        ) : (
          <>
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: '900px' }}>
                <thead>
                  <tr style={{ background: '#fafafa' }}>
                    {['Mã ĐH', 'Khách Hàng', 'Sản Phẩm', 'Tổng Tiền', 'Ngày Đặt', 'Trạng Thái', 'Thao Tác'].map((h, i) => (
                      <th key={i} style={{
                        padding: '13px 16px', fontSize: '0.72rem', fontWeight: 700,
                        textTransform: 'uppercase', letterSpacing: '0.07em', color: '#888',
                        borderBottom: '1px solid #f0f0f0', textAlign: 'left', whiteSpace: 'nowrap'
                      }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {paginated.map((order) => {
                    const sc = STATUS_CONFIG[order.status] || STATUS_CONFIG['Pending'];
                    const isUpdating = updatingId === order.id;
                    return (
                      <tr key={order.id} className="order-row" style={{ borderBottom: '1px solid #f5f5f5' }}>
                        <td style={{ padding: '14px 16px' }}>
                          <span style={{ fontWeight: 700, color: 'var(--color-primary)', fontFamily: 'monospace', fontSize: '0.9rem' }}>#${order.id}</span>
                        </td>
                        <td style={{ padding: '14px 16px' }}>
                          <div style={{ fontWeight: 600, color: '#1a1a1a', fontSize: '0.9rem' }}>{order.name}</div>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '4px', marginTop: '3px', color: '#aaa', fontSize: '0.75rem' }}>
                            <Phone size={11} /> {order.phone}
                          </div>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '4px', color: '#aaa', fontSize: '0.75rem' }}>
                            <Mail size={11} /> {order.email}
                          </div>
                        </td>
                        <td style={{ padding: '14px 16px', maxWidth: '220px' }}>
                          {order.items.slice(0, 2).map((item, idx) => (
                            <div key={idx} style={{ fontSize: '0.8rem', color: '#555', marginBottom: '2px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                              <span style={{ background: '#f0f0f0', color: '#333', padding: '1px 6px', borderRadius: '4px', fontSize: '0.72rem', fontWeight: 700 }}>{item.quantity}x</span>
                              <span style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: '140px' }}>{item.name}</span>
                            </div>
                          ))}
                          {order.items.length > 2 && (
                            <div style={{ fontSize: '0.75rem', color: '#aaa' }}>+${order.items.length - 2} sản phẩm khác</div>
                          )}
                        </td>
                        <td style={{ padding: '14px 16px' }}>
                          <div style={{ fontWeight: 700, color: '#1a1a1a', fontSize: '0.95rem' }}>$${order.totalAmount.toFixed(2)}</div>
                        </td>
                        <td style={{ padding: '14px 16px' }}>
                          <div style={{ fontSize: '0.8rem', color: '#555' }}>
                            {new Date(order.createdAt).toLocaleDateString('vi-VN')}
                          </div>
                          <div style={{ fontSize: '0.75rem', color: '#aaa' }}>
                            {new Date(order.createdAt).toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })}
                          </div>
                        </td>
                        <td style={{ padding: '14px 16px' }}>
                          <div style={{
                            display: 'inline-flex', alignItems: 'center', gap: '6px',
                            background: sc.bg, border: `1px solid ${sc.border}`,
                            borderRadius: '20px', padding: '5px 12px', position: 'relative'
                          }}>
                            {isUpdating ? (
                              <div style={{ width: '14px', height: '14px', border: `2px solid ${sc.color}`, borderTop: '2px solid transparent', borderRadius: '50%', animation: 'spin 0.6s linear infinite' }} />
                            ) : sc.icon}
                            <select
                              value={order.status}
                              onChange={e => handleStatusChange(order.id, e.target.value)}
                              disabled={isUpdating}
                              className="status-select"
                              style={{ color: sc.color, cursor: isUpdating ? 'not-allowed' : 'pointer' }}
                            >
                              {STATUS_OPTIONS.map(s => (
                                <option key={s} value={s}>{STATUS_CONFIG[s].label}</option>
                              ))}
                            </select>
                            <ChevronDown size={11} color={sc.color} style={{ flexShrink: 0 }} />
                          </div>
                        </td>
                        <td style={{ padding: '14px 16px' }}>
                          <button
                            onClick={() => setSelectedOrder(order)}
                            style={{
                              display: 'inline-flex', alignItems: 'center', gap: '6px',
                              padding: '8px 14px', borderRadius: '8px', border: '1px solid #e5e7eb',
                              background: '#fff', cursor: 'pointer', fontWeight: 600, fontSize: '0.8rem',
                              color: '#555', transition: 'all 0.15s', fontFamily: 'var(--font-sans)'
                            }}
                          >
                            <Eye size={14} /> Chi tiết
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            <div style={{ padding: '16px 20px', borderTop: '1px solid #f0f0f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
              <span style={{ fontSize: '0.82rem', color: '#888' }}>
                Hiển thị ${(currentPage - 1) * PAGE_SIZE + 1}–${Math.min(currentPage * PAGE_SIZE, filtered.length)} trong ${filtered.length} đơn hàng
              </span>
              <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
                <button className="pagination-btn" disabled={currentPage === 1} onClick={() => setCurrentPage(p => p - 1)}>
                  <ChevronLeft size={16} />
                </button>
                {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
                  const page = i + 1;
                  return <button key={page} className={`pagination-btn ${page === currentPage ? 'active' : ''}`} onClick={() => setCurrentPage(page)}>{page}</button>;
                })}
                {totalPages > 5 && <span style={{ color: '#aaa' }}>...</span>}
                <button className="pagination-btn" disabled={currentPage === totalPages} onClick={() => setCurrentPage(p => p + 1)}>
                  <ChevronRight size={16} />
                </button>
              </div>
            </div>
          </>
        )}
      </div>

      {/* Order Detail Modal */}
      {selectedOrder && (
        <div style={{
          position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.55)', backdropFilter: 'blur(5px)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: '20px',
          animation: 'fadeIn 0.2s ease'
        }}>
          <div style={{
            background: '#fff', borderRadius: '20px', width: '100%', maxWidth: '640px',
            maxHeight: '90vh', overflowY: 'auto', boxShadow: '0 24px 60px rgba(0,0,0,0.25)',
            animation: 'modalIn 0.25s ease'
          }}>
            {/* Modal Header */}
            <div style={{ padding: '22px 28px', borderBottom: '1px solid #f0f0f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center', position: 'sticky', top: 0, background: '#fff', zIndex: 1 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <ShoppingCart size={18} color="#fff" />
                </div>
                <div>
                  <h2 style={{ margin: 0, fontSize: '1.15rem', fontWeight: 700, color: '#1a1a1a' }}>
                    Chi Tiết Đơn Hàng <span style={{ color: 'var(--color-primary)', fontFamily: 'monospace' }}>#${selectedOrder.id}</span>
                  </h2>
                  <p style={{ margin: '2px 0 0', fontSize: '0.78rem', color: '#aaa', display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <Calendar size={11} /> ${formatDate(selectedOrder.createdAt)}
                  </p>
                </div>
              </div>
              <button onClick={() => setSelectedOrder(null)} style={{ width: '36px', height: '36px', borderRadius: '10px', border: '1px solid #e5e7eb', background: '#f9f9f9', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#888' }}>
                <X size={18} />
              </button>
            </div>

            <div style={{ padding: '24px 28px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
              {/* Status Banner */}
              {(() => {
                const sc = STATUS_CONFIG[selectedOrder.status] || STATUS_CONFIG['Pending'];
                return (
                  <div style={{ background: sc.bg, border: `1px solid ${sc.border}`, borderRadius: '12px', padding: '14px 18px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: sc.color, fontWeight: 700 }}>
                      {sc.icon} Trạng thái: {sc.label}
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span style={{ fontSize: '0.82rem', color: '#888' }}>Thay đổi:</span>
                      <select
                        value={selectedOrder.status}
                        onChange={e => handleStatusChange(selectedOrder.id, e.target.value)}
                        disabled={updatingId === selectedOrder.id}
                        style={{
                          padding: '6px 10px', borderRadius: '8px', border: `1.5px solid ${sc.border}`,
                          background: '#fff', color: sc.color, fontWeight: 700, fontSize: '0.82rem',
                          cursor: 'pointer', fontFamily: 'var(--font-sans)', outline: 'none'
                        }}
                      >
                        {STATUS_OPTIONS.map(s => <option key={s} value={s}>{STATUS_CONFIG[s].label}</option>)}
                      </select>
                    </div>
                  </div>
                );
              })()}

              {/* Customer Info */}
              <div style={{ background: '#fafafa', borderRadius: '12px', padding: '18px 20px' }}>
                <h3 style={{ margin: '0 0 14px', fontSize: '0.9rem', fontWeight: 700, color: '#1a1a1a', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  Thông Tin Khách Hàng
                </h3>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                  <div style={{ display: 'flex', alignItems: 'flex-start', gap: '8px' }}>
                    <div style={{ width: '28px', height: '28px', borderRadius: '8px', background: '#fff', border: '1px solid #e5e7eb', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                      <ShoppingCart size={13} color="#888" />
                    </div>
                    <div>
                      <div style={{ fontSize: '0.72rem', color: '#aaa', fontWeight: 600, textTransform: 'uppercase' }}>Họ tên</div>
                      <div style={{ fontWeight: 600, color: '#1a1a1a', fontSize: '0.88rem' }}>{selectedOrder.name}</div>
                    </div>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'flex-start', gap: '8px' }}>
                    <div style={{ width: '28px', height: '28px', borderRadius: '8px', background: '#fff', border: '1px solid #e5e7eb', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                      <Phone size={13} color="#888" />
                    </div>
                    <div>
                      <div style={{ fontSize: '0.72rem', color: '#aaa', fontWeight: 600, textTransform: 'uppercase' }}>Điện thoại</div>
                      <div style={{ fontWeight: 600, color: '#1a1a1a', fontSize: '0.88rem' }}>{selectedOrder.phone}</div>
                    </div>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'flex-start', gap: '8px' }}>
                    <div style={{ width: '28px', height: '28px', borderRadius: '8px', background: '#fff', border: '1px solid #e5e7eb', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                      <Mail size={13} color="#888" />
                    </div>
                    <div>
                      <div style={{ fontSize: '0.72rem', color: '#aaa', fontWeight: 600, textTransform: 'uppercase' }}>Email</div>
                      <div style={{ fontWeight: 600, color: '#1a1a1a', fontSize: '0.88rem' }}>{selectedOrder.email}</div>
                    </div>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'flex-start', gap: '8px', gridColumn: 'span 2' }}>
                    <div style={{ width: '28px', height: '28px', borderRadius: '8px', background: '#fff', border: '1px solid #e5e7eb', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                      <MapPin size={13} color="#888" />
                    </div>
                    <div>
                      <div style={{ fontSize: '0.72rem', color: '#aaa', fontWeight: 600, textTransform: 'uppercase' }}>Địa chỉ giao hàng</div>
                      <div style={{ fontWeight: 600, color: '#1a1a1a', fontSize: '0.88rem' }}>{selectedOrder.address}</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Order Items */}
              <div>
                <h3 style={{ margin: '0 0 14px', fontSize: '0.9rem', fontWeight: 700, color: '#1a1a1a', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  Sản Phẩm Đã Đặt (${selectedOrder.items.length} sản phẩm)
                </h3>
                <div style={{ border: '1px solid #f0f0f0', borderRadius: '12px', overflow: 'hidden' }}>
                  {selectedOrder.items.map((item, idx) => (
                    <div key={idx} style={{
                      display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                      padding: '14px 18px', borderBottom: idx < selectedOrder.items.length - 1 ? '1px solid #f5f5f5' : 'none',
                      background: idx % 2 === 0 ? '#fff' : '#fafafa'
                    }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flex: 1, minWidth: 0 }}>
                        <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: 'linear-gradient(135deg, var(--color-primary) 0%, var(--color-primary-dark) 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                          <Package size={15} color="#fff" />
                        </div>
                        <div style={{ minWidth: 0, flex: 1 }}>
                          <div style={{ fontWeight: 600, fontSize: '0.88rem', color: '#1a1a1a', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{item.name}</div>
                          <div style={{ fontSize: '0.75rem', color: '#aaa' }}>Đơn giá: $${item.price.toFixed(2)} × {item.quantity}</div>
                        </div>
                      </div>
                      <div style={{ fontWeight: 700, color: '#1a1a1a', fontSize: '0.9rem', marginLeft: '12px', flexShrink: 0 }}>
                        $${(item.price * item.quantity).toFixed(2)}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Total */}
              <div style={{ background: 'linear-gradient(135deg, var(--color-primary) 0%, var(--color-primary-dark) 100%)', borderRadius: '12px', padding: '18px 20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'rgba(255,255,255,0.85)', fontWeight: 600 }}>
                  <DollarSign size={18} />
                  Tổng Thanh Toán
                </div>
                <div style={{ fontSize: '1.4rem', fontWeight: 800, color: '#fff' }}>
                  $${selectedOrder.totalAmount.toFixed(2)}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminOrders;