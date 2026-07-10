import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { getProducts, getAdminOrders, getAdminUsers } from '../../services/api';
import { 
  DollarSign, 
  ShoppingBag, 
  Receipt, 
  Users, 
  AlertTriangle,
  ArrowRight,
  TrendingUp
} from 'lucide-react';
import { Link } from 'react-router-dom';

export const AdminDashboard: React.FC = () => {
  // Query Products
  const { data: productsData, isLoading: isProductsLoading } = useQuery({
    queryKey: ['adminDashboardProducts'],
    queryFn: () => getProducts({ limit: 100 }),
  });
  const products = productsData?.products || [];

  // Query Orders
  const { data: orders = [], isLoading: isOrdersLoading } = useQuery({
    queryKey: ['adminDashboardOrders'],
    queryFn: getAdminOrders,
  });

  // Query Users
  const { data: users = [], isLoading: isUsersLoading } = useQuery({
    queryKey: ['adminDashboardUsers'],
    queryFn: getAdminUsers,
  });

  const isLoading = isProductsLoading || isOrdersLoading || isUsersLoading;

  // Calculations
  const totalRevenue = orders
    .filter(order => order.status !== 'Cancelled')
    .reduce((sum, order) => sum + order.totalAmount, 0);

  const lowStockProducts = products.filter(p => p.stockQuantity < 5);
  const recentOrders = orders.slice(0, 5);

  const formatPrice = (value: number) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(value);
  };

  if (isLoading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '300px' }}>
        <div className="spinner-border text-primary" role="status">
          <span className="sr-only">Loading...</span>
        </div>
      </div>
    );
  }

  const statCards = [
    {
      title: 'Total Revenue',
      value: formatPrice(totalRevenue),
      icon: DollarSign,
      color: '#28a745',
      bg: '#e8f5e9'
    },
    {
      title: 'Total Orders',
      value: orders.length,
      icon: Receipt,
      color: '#17a2b8',
      bg: '#e0f7fa'
    },
    {
      title: 'Products in Catalog',
      value: products.length,
      icon: ShoppingBag,
      color: '#ffc107',
      bg: '#fffde7'
    },
    {
      title: 'Admin Users',
      value: users.length,
      icon: Users,
      color: '#6c757d',
      bg: '#f8f9fa'
    }
  ];

  return (
    <div className="container-fluid p-0">
      {/* Page Title & Tagline */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h2 className="font-weight-bold text-dark m-0">Admin Dashboard</h2>
          <span className="text-muted small">Overview stats and critical items</span>
        </div>
        <div className="d-none d-md-flex align-items-center bg-white shadow-sm p-3 rounded" style={{ gap: '10px' }}>
          <TrendingUp size={20} className="text-success" />
          <span className="font-weight-bold text-success">Store health looks stable</span>
        </div>
      </div>

      {/* Stats Cards Row */}
      <div className="row mb-4">
        {statCards.map((card, i) => {
          const Icon = card.icon;
          return (
            <div className="col-12 col-sm-6 col-xl-3 mb-3 mb-xl-0" key={i}>
              <div className="card border-0 shadow-sm rounded p-4 h-100 d-flex flex-row align-items-center justify-content-between bg-white">
                <div>
                  <span className="text-muted text-uppercase font-weight-bold small">{card.title}</span>
                  <h3 className="m-0 font-weight-bold mt-2 text-dark">{card.value}</h3>
                </div>
                <div className="p-3 rounded-circle" style={{ color: card.color, backgroundColor: card.bg }}>
                  <Icon size={24} />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="row">
        {/* Recent Orders List */}
        <div className="col-12 col-lg-8 mb-4">
          <div className="card border-0 shadow-sm rounded h-100 bg-white">
            <div className="card-header bg-white border-bottom py-3 d-flex justify-content-between align-items-center">
              <h5 className="m-0 font-weight-bold text-dark">Recent Orders</h5>
              <Link to="/admin/orders" className="btn btn-sm btn-link text-primary font-weight-bold p-0 d-flex align-items-center" style={{ gap: '5px' }}>
                <span>View All Orders</span>
                <ArrowRight size={14} />
              </Link>
            </div>
            <div className="card-body p-0">
              <div className="table-responsive">
                <table className="table table-hover table-striped align-middle mb-0">
                  <thead className="table-light text-uppercase small font-weight-bold">
                    <tr>
                      <th className="px-4 py-3">Order ID</th>
                      <th className="px-4 py-3">Customer</th>
                      <th className="px-4 py-3">Status</th>
                      <th className="px-4 py-3">Date</th>
                      <th className="px-4 py-3 text-right">Total</th>
                    </tr>
                  </thead>
                  <tbody>
                    {recentOrders.length === 0 ? (
                      <tr>
                        <td colSpan={5} className="text-center py-5 text-muted">
                          No orders placed yet.
                        </td>
                      </tr>
                    ) : (
                      recentOrders.map((order) => (
                        <tr key={order.id}>
                          <td className="px-4 py-3 font-weight-bold">#{order.id}</td>
                          <td className="px-4 py-3">{order.name}</td>
                          <td className="px-4 py-3">
                            <span 
                              className="badge px-3 py-2 text-capitalize"
                              style={{
                                backgroundColor: 
                                  order.status === 'Completed' ? '#d4edda' :
                                  order.status === 'Processing' ? '#cce5ff' :
                                  order.status === 'Cancelled' ? '#f8d7da' : '#fff3cd',
                                color:
                                  order.status === 'Completed' ? '#155724' :
                                  order.status === 'Processing' ? '#004085' :
                                  order.status === 'Cancelled' ? '#721c24' : '#856404',
                              }}
                            >
                              {order.status}
                            </span>
                          </td>
                          <td className="px-4 py-3 text-muted">
                            {new Date(order.createdAt).toLocaleDateString()}
                          </td>
                          <td className="px-4 py-3 text-right font-weight-bold">{formatPrice(order.totalAmount)}</td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>

        {/* Low Stock Alerts */}
        <div className="col-12 col-lg-4 mb-4">
          <div className="card border-0 shadow-sm rounded h-100 bg-white">
            <div className="card-header bg-white border-bottom py-3 d-flex justify-content-between align-items-center">
              <h5 className="m-0 font-weight-bold text-dark d-flex align-items-center" style={{ gap: '8px' }}>
                <AlertTriangle size={18} className="text-warning" />
                <span>Low Stock Warning</span>
              </h5>
              <span className="badge badge-warning text-dark px-2 py-1 font-weight-bold">{lowStockProducts.length} Alert(s)</span>
            </div>
            <div className="card-body p-4" style={{ maxHeight: '350px', overflowY: 'auto' }}>
              {lowStockProducts.length === 0 ? (
                <div className="text-center py-5 text-muted">
                  All products are sufficiently stocked!
                </div>
              ) : (
                <div className="d-flex flex-column" style={{ gap: '15px' }}>
                  {lowStockProducts.map((prod) => (
                    <div className="d-flex align-items-center justify-content-between border-bottom pb-2" key={prod.id}>
                      <div className="d-flex align-items-center" style={{ gap: '12px' }}>
                        <img 
                          src={prod.imageUrl} 
                          alt={prod.name} 
                          className="rounded object-fit-cover" 
                          style={{ width: '45px', height: '45px' }}
                        />
                        <div className="text-left">
                          <h6 className="m-0 font-weight-bold text-dark" style={{ fontSize: '0.9rem' }}>{prod.name}</h6>
                          <span className="text-muted small">ID: #{prod.id}</span>
                        </div>
                      </div>
                      <span className="badge badge-danger font-weight-bold px-2 py-1" style={{ fontSize: '0.85rem' }}>
                        {prod.stockQuantity} left
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
