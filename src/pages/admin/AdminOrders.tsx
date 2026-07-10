import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import { getAdminOrders, updateOrderStatus } from '../../services/api';
import type { Order } from '../../services/api';

export const AdminOrders: React.FC = () => {
  const navigate = useNavigate();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const data = await getAdminOrders();
      setOrders(data);
    } catch (err: any) {
      toast.error('Failed to load orders.');
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (orderId: number, newStatus: string) => {
    const originalOrders = [...orders];
    
    // Optimistic update
    setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status: newStatus as any } : o));

    try {
      await updateOrderStatus(orderId, newStatus);
      toast.success(`Order #${orderId} status updated to ${newStatus}.`);
    } catch (err: any) {
      // Revert if error
      setOrders(originalOrders);
      const errMsg = err.response?.data?.message || 'Failed to update order status.';
      toast.error(errMsg);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('admin_token');
    localStorage.removeItem('admin_user');
    toast.success('Logged out successfully.');
    navigate('/admin/login');
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Pending':
        return { bg: '#f1f1f1', text: '#555555', border: '#cccccc' };
      case 'Processing':
        return { bg: '#eef6ff', text: '#3182ce', border: '#bde0fe' };
      case 'Completed':
        return { bg: '#f0fdf4', text: '#2f855a', border: '#bbf7d0' };
      case 'Cancelled':
        return { bg: '#fdf2f2', text: '#c53030', border: '#fecaca' };
      default:
        return { bg: '#ffffff', text: '#111111', border: '#ffffff' };
    }
  };

  const formatDate = (dateStr: string) => {
    try {
      const date = new Date(dateStr);
      return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch (e) {
      return dateStr;
    }
  };

  return (
    <div className="admin-dashboard" style={{ backgroundColor: 'var(--color-light-bg)', minHeight: '100vh' }}>
      {/* Admin Navigation Bar */}
      <nav style={{
        backgroundColor: '#ffffff',
        borderBottom: '1px solid var(--color-border)',
        padding: '15px 40px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        position: 'sticky',
        top: 0,
        zIndex: 10
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '30px' }}>
          <h1 style={{ 
            fontFamily: 'var(--font-serif)', 
            fontSize: '1.6rem', 
            margin: 0, 
            letterSpacing: '0.05em',
            fontWeight: 600
          }}>
            Learts <span style={{ color: 'var(--color-primary)', fontSize: '1rem', verticalAlign: 'middle' }}>ADMIN</span>
          </h1>
          <div style={{ display: 'flex', gap: '20px', marginLeft: '20px' }}>
            <Link to="/admin/products" style={{ 
              fontWeight: 500, 
              color: 'var(--color-muted)',
              paddingBottom: '5px',
              fontSize: '0.95rem'
            }}>Products</Link>
            <Link to="/admin/orders" style={{ 
              fontWeight: 600, 
              color: 'var(--color-dark)',
              borderBottom: '2px solid var(--color-dark)',
              paddingBottom: '5px',
              fontSize: '0.95rem'
            }}>Orders</Link>
          </div>
        </div>
        <div>
          <button 
            onClick={handleLogout}
            style={{
              padding: '8px 18px',
              backgroundColor: 'transparent',
              border: '1px solid var(--color-border)',
              color: 'var(--color-dark)',
              cursor: 'pointer',
              fontSize: '0.85rem',
              fontWeight: 500,
              textTransform: 'uppercase',
              letterSpacing: '0.05em',
              transition: 'var(--transition-fast)'
            }}
          >
            Log Out
          </button>
        </div>
      </nav>

      {/* Main Content Area */}
      <div className="container" style={{ padding: '40px 24px' }}>
        <div style={{ marginBottom: '30px' }}>
          <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '2rem', color: 'var(--color-dark)' }}>Orders Management</h2>
          <p style={{ color: 'var(--color-muted)', fontSize: '0.9rem', marginTop: '5px' }}>
            Process customer orders, verify transaction amounts, and manage status lifecycles.
          </p>
        </div>

        {/* Orders Table */}
        {loading ? (
          <div style={{ display: 'flex', justifyContent: 'center', padding: '60px' }}>
            <p style={{ color: 'var(--color-muted)' }}>Loading orders database...</p>
          </div>
        ) : orders.length === 0 ? (
          <div style={{
            backgroundColor: '#ffffff',
            border: '1px solid var(--color-border)',
            padding: '60px',
            textAlign: 'center'
          }}>
            <p style={{ color: 'var(--color-muted)' }}>No customer orders found in the database.</p>
          </div>
        ) : (
          <div style={{ backgroundColor: '#ffffff', border: '1px solid var(--color-border)', overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', minWidth: '1000px' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid var(--color-border)', backgroundColor: 'var(--color-cream)' }}>
                  <th style={{ padding: '15px 20px', fontWeight: 600, fontSize: '0.85rem', textTransform: 'uppercase', color: 'var(--color-dark)' }}>Order ID</th>
                  <th style={{ padding: '15px 20px', fontWeight: 600, fontSize: '0.85rem', textTransform: 'uppercase', color: 'var(--color-dark)' }}>Customer</th>
                  <th style={{ padding: '15px 20px', fontWeight: 600, fontSize: '0.85rem', textTransform: 'uppercase', color: 'var(--color-dark)' }}>Address</th>
                  <th style={{ padding: '15px 20px', fontWeight: 600, fontSize: '0.85rem', textTransform: 'uppercase', color: 'var(--color-dark)' }}>Items & Details</th>
                  <th style={{ padding: '15px 20px', fontWeight: 600, fontSize: '0.85rem', textTransform: 'uppercase', color: 'var(--color-dark)' }}>Total</th>
                  <th style={{ padding: '15px 20px', fontWeight: 600, fontSize: '0.85rem', textTransform: 'uppercase', color: 'var(--color-dark)' }}>Date</th>
                  <th style={{ padding: '15px 20px', fontWeight: 600, fontSize: '0.85rem', textTransform: 'uppercase', color: 'var(--color-dark)', width: '160px' }}>Status</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((order) => (
                  <tr key={order.id} style={{ borderBottom: '1px solid var(--color-border)' }}>
                    <td style={{ padding: '15px 20px', fontWeight: 600, fontSize: '0.9rem' }}>#{order.id}</td>
                    <td style={{ padding: '15px 20px' }}>
                      <div style={{ fontWeight: 500, fontSize: '0.95rem', color: 'var(--color-dark)' }}>{order.name}</div>
                      <div style={{ fontSize: '0.85rem', color: 'var(--color-muted)', marginTop: '2px' }}>{order.phone}</div>
                      <div style={{ fontSize: '0.85rem', color: 'var(--color-muted)' }}>{order.email}</div>
                    </td>
                    <td style={{ padding: '15px 20px', fontSize: '0.9rem', color: 'var(--color-dark)', maxWidth: '200px', wordBreak: 'break-word' }}>
                      {order.address}
                    </td>
                    <td style={{ padding: '15px 20px' }}>
                      <ul style={{ paddingLeft: '15px', margin: 0, fontSize: '0.85rem', color: 'var(--color-dark)' }}>
                        {order.items.map((item, idx) => (
                          <li key={idx} style={{ marginBottom: '4px' }}>
                            <span style={{ fontWeight: 500 }}>{item.quantity}x</span> {item.name} 
                            <span style={{ color: 'var(--color-muted)', marginLeft: '6px' }}>(${item.price.toFixed(2)} ea)</span>
                          </li>
                        ))}
                      </ul>
                    </td>
                    <td style={{ padding: '15px 20px', fontWeight: 600, fontSize: '0.95rem', color: 'var(--color-dark)' }}>
                      ${order.totalAmount.toFixed(2)}
                    </td>
                    <td style={{ padding: '15px 20px', fontSize: '0.85rem', color: 'var(--color-muted)' }}>
                      {formatDate(order.createdAt)}
                    </td>
                    <td style={{ padding: '15px 20px' }}>
                      {(() => {
                        const colors = getStatusColor(order.status);
                        return (
                          <select
                            value={order.status}
                            onChange={(e) => handleStatusChange(order.id, e.target.value)}
                            style={{
                              backgroundColor: colors.bg,
                              color: colors.text,
                              borderColor: colors.border,
                              padding: '6px 12px',
                              borderWidth: '1px',
                              borderStyle: 'solid',
                              borderRadius: '0px',
                              fontWeight: 600,
                              fontSize: '0.85rem',
                              cursor: 'pointer',
                              width: '130px',
                              outline: 'none',
                              transition: 'var(--transition-fast)'
                            }}
                          >
                            <option value="Pending" style={{ backgroundColor: '#fff', color: '#555' }}>Pending</option>
                            <option value="Processing" style={{ backgroundColor: '#fff', color: '#3182ce' }}>Processing</option>
                            <option value="Completed" style={{ backgroundColor: '#fff', color: '#2f855a' }}>Completed</option>
                            <option value="Cancelled" style={{ backgroundColor: '#fff', color: '#c53030' }}>Cancelled</option>
                          </select>
                        );
                      })()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminOrders;
