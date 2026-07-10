import React, { useState } from 'react';
import { useLocation, Link, useNavigate } from 'react-router-dom';
import { useWishlistStore } from '../store/useWishlistStore';
import { useCartStore } from '../store/useCartStore';
import toast from 'react-hot-toast';

export const ShopOthers: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const path = location.pathname;

  // Stores
  const wishlistItems = useWishlistStore((state) => state.items);
  const removeWishlist = useWishlistStore((state) => state.removeItem);
  const addToCart = useCartStore((state) => state.addItem);

  // States
  const [activeTab, setActiveTab] = useState<'dashboard' | 'orders' | 'address' | 'details'>('dashboard');

  const handleTrackSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const orderId = formData.get('orderId')?.toString().trim();
    if (!orderId) return;

    toast.success(`Tracking details retrieved: Order #${orderId} is currently IN TRANSIT.`);
  };

  const handleResetPassword = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    toast.success('Password recovery link has been sent to your email.');
    e.currentTarget.reset();
  };

  const handleLoginSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    toast.success('Successfully logged in!');
    navigate('/my-account');
  };

  const handleRegisterSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    toast.success('Registration successful! Welcome to Learts Store.');
    navigate('/my-account');
  };

  const handleAddToCart = (product: any) => {
    const result = addToCart(product, 1);
    if (result.success) {
      toast.success(`${product.name} added to cart!`);
    } else {
      toast.error(result.message || 'Error adding to cart.');
    }
  };

  const formatPrice = (price: number) => {
    return '$' + price.toFixed(2);
  };

  // 1. Order Tracking Page
  if (path === '/order-tracking') {
    return (
      <div className="order-tracking-page">
        <div 
          className="page-title-section section" 
          style={{ 
            backgroundImage: 'url("/assets/images/bg/page-title-1.webp")',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            padding: '60px 0'
          }}
        >
          <div className="container">
            <div className="page-title">
              <h1 className="title" style={{ fontFamily: 'var(--font-serif)', color: '#111' }}>Order Tracking</h1>
              <ul className="breadcrumb">
                <li className="breadcrumb-item"><a href="/">Home</a></li>
                <li className="breadcrumb-item active">Order Tracking</li>
              </ul>
            </div>
          </div>
        </div>

        <div className="section section-padding">
          <div className="container" style={{ maxWidth: '600px', margin: '0 auto' }}>
            <div className="order-tracking" style={{ color: '#555', lineHeight: '1.7' }}>
              <p className="mb-4">To track your order please enter your Order ID in the box below and press the "Track" button. This was given to you on your receipt and in the confirmation email you should have received.</p>
              <form onSubmit={handleTrackSubmit}>
                <div className="row learts-mb-n30">
                  <div className="col-12 learts-mb-30" style={{ marginBottom: '20px' }}>
                    <label style={{ fontWeight: 600, display: 'block', marginBottom: '8px' }}>Order ID</label>
                    <input name="orderId" required type="text" placeholder="Found in your order confirmation email." style={{ width: '100%', height: '45px', padding: '0 15px', border: '1px solid #ddd' }} />
                  </div>
                  <div className="col-12 learts-mb-30" style={{ marginBottom: '25px' }}>
                    <label style={{ fontWeight: 600, display: 'block', marginBottom: '8px' }}>Billing email</label>
                    <input required type="email" placeholder="Email you used during checkout." style={{ width: '100%', height: '45px', padding: '0 15px', border: '1px solid #ddd' }} />
                  </div>
                  <div className="col-12 text-center learts-mb-30">
                    <button type="submit" className="btn btn-dark btn-outline-hover-dark" style={{ padding: '12px 30px' }}>Track</button>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // 2. Wishlist Page
  if (path === '/wishlist') {
    return (
      <div className="wishlist-page">
        <div 
          className="page-title-section section" 
          style={{ 
            backgroundImage: 'url("/assets/images/bg/page-title-1.webp")',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            padding: '60px 0'
          }}
        >
          <div className="container">
            <div className="page-title">
              <h1 className="title" style={{ fontFamily: 'var(--font-serif)', color: '#111' }}>Wishlist</h1>
              <ul className="breadcrumb">
                <li className="breadcrumb-item"><a href="/">Home</a></li>
                <li className="breadcrumb-item active">Wishlist</li>
              </ul>
            </div>
          </div>
        </div>

        <div className="section section-padding">
          <div className="container">
            {wishlistItems.length === 0 ? (
              <div className="text-center py-5">
                <h3 style={{ fontFamily: 'var(--font-serif)' }}>Your wishlist is empty</h3>
                <p className="text-muted">Browse our collection and add your favorite items!</p>
                <Link to="/shop" className="btn btn-dark mt-3">Back to Shop</Link>
              </div>
            ) : (
              <div className="cart-form">
                <table className="cart-wishlist-table table table-bordered">
                  <thead>
                    <tr>
                      <th className="name" colSpan={2}>Product</th>
                      <th className="price text-center">Unit Price</th>
                      <th className="add-to-cart text-center">&nbsp;</th>
                      <th className="remove text-center">&nbsp;</th>
                    </tr>
                  </thead>
                  <tbody>
                    {wishlistItems.map((item) => (
                      <tr key={item.id}>
                        <td className="thumbnail" style={{ width: '100px', textAlign: 'center' }}>
                          <Link to={`/product/${item.id}`}>
                            <img src={item.imageUrl} alt={item.name} style={{ width: '80px', height: '80px', objectFit: 'contain' }} />
                          </Link>
                        </td>
                        <td className="name" style={{ verticalAlign: 'middle' }}>
                          <Link to={`/product/${item.id}`} style={{ color: '#111', fontWeight: 600 }}>{item.name}</Link>
                        </td>
                        <td className="price text-center" style={{ verticalAlign: 'middle', color: 'var(--color-primary)' }}>
                          <span>{formatPrice(item.price)}</span>
                        </td>
                        <td className="add-to-cart text-center" style={{ verticalAlign: 'middle' }}>
                          <button onClick={() => handleAddToCart(item)} className="btn btn-light btn-hover-dark">
                            <i className="fas fa-shopping-cart" style={{ marginRight: '8px' }}></i>Add to Cart
                          </button>
                        </td>
                        <td className="remove text-center" style={{ verticalAlign: 'middle' }}>
                          <button onClick={() => removeWishlist(item.id)} className="btn text-danger" style={{ border: 'none', background: 'none', fontSize: '1.2rem' }}>
                            <i className="ti-close"></i>
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  // 3. Login / Register Page
  if (path === '/login') {
    return (
      <div className="login-page">
        <div 
          className="page-title-section section" 
          style={{ 
            backgroundImage: 'url("/assets/images/bg/page-title-1.webp")',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            padding: '60px 0'
          }}
        >
          <div className="container">
            <div className="page-title">
              <h1 className="title" style={{ fontFamily: 'var(--font-serif)', color: '#111' }}>Login & Register</h1>
              <ul className="breadcrumb">
                <li className="breadcrumb-item"><a href="/">Home</a></li>
                <li className="breadcrumb-item active">Login & Register</li>
              </ul>
            </div>
          </div>
        </div>

        <div className="section section-padding">
          <div className="container">
            <div className="row g-0" style={{ border: '1px solid #eee' }}>
              {/* Login */}
              <div className="col-lg-6">
                <div className="user-login-register bg-light" style={{ padding: '50px 40px', height: '100%' }}>
                  <div className="login-register-title" style={{ marginBottom: '30px' }}>
                    <h2 className="title" style={{ fontFamily: 'var(--font-serif)', fontSize: '2rem' }}>Login</h2>
                    <p className="desc text-muted">Great to have you back!</p>
                  </div>
                  <form onSubmit={handleLoginSubmit}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                      <input required type="email" placeholder="Username or email address" style={{ width: '100%', height: '48px', padding: '0 15px', border: '1px solid #ddd', backgroundColor: '#fff' }} />
                      <input required type="password" placeholder="Password" style={{ width: '100%', height: '48px', padding: '0 15px', border: '1px solid #ddd', backgroundColor: '#fff' }} />
                      <button type="submit" className="btn btn-dark btn-outline-hover-dark" style={{ height: '48px', alignSelf: 'center', padding: '0 40px' }}>login</button>
                      
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '10px' }}>
                        <div className="form-check">
                          <input type="checkbox" className="form-check-input" id="rememberMe" />
                          <label className="form-check-label" htmlFor="rememberMe">Remember me</label>
                        </div>
                        <Link to="/lost-password" style={{ color: 'var(--color-primary)' }}>Lost your password?</Link>
                      </div>
                    </div>
                  </form>
                </div>
              </div>

              {/* Register */}
              <div className="col-lg-6">
                <div className="user-login-register" style={{ padding: '50px 40px', backgroundColor: '#fff' }}>
                  <div className="login-register-title" style={{ marginBottom: '30px' }}>
                    <h2 className="title" style={{ fontFamily: 'var(--font-serif)', fontSize: '2rem' }}>Register</h2>
                    <p className="desc text-muted">If you don’t have an account, register now!</p>
                  </div>
                  <form onSubmit={handleRegisterSubmit}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                      <div>
                        <label style={{ fontWeight: 600, display: 'block', marginBottom: '8px' }}>Email address *</label>
                        <input required type="email" style={{ width: '100%', height: '48px', padding: '0 15px', border: '1px solid #ddd' }} />
                      </div>
                      <p className="text-muted" style={{ fontSize: '0.85rem', lineHeight: '1.6' }}>Your personal data will be used to support your experience throughout this website, to manage access to your account, and for other purposes described in our privacy policy.</p>
                      <button type="submit" className="btn btn-dark btn-outline-hover-dark" style={{ height: '48px', alignSelf: 'center', padding: '0 40px' }}>Register</button>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // 4. Lost Password Page
  if (path === '/lost-password') {
    return (
      <div className="lost-password-page">
        <div 
          className="page-title-section section" 
          style={{ 
            backgroundImage: 'url("/assets/images/bg/page-title-1.webp")',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            padding: '60px 0'
          }}
        >
          <div className="container">
            <div className="page-title">
              <h1 className="title" style={{ fontFamily: 'var(--font-serif)', color: '#111' }}>Lost Password</h1>
              <ul className="breadcrumb">
                <li className="breadcrumb-item"><a href="/">Home</a></li>
                <li className="breadcrumb-item active">Lost Password</li>
              </ul>
            </div>
          </div>
        </div>

        <div className="section section-padding">
          <div className="container" style={{ maxWidth: '600px', margin: '0 auto' }}>
            <div className="lost-password" style={{ color: '#555', lineHeight: '1.7' }}>
              <p className="mb-4">Lost your password? Please enter your username or email address. You will receive a link to create a new password via email.</p>
              <form onSubmit={handleResetPassword}>
                <div className="row learts-mb-n30">
                  <div className="col-12 learts-mb-30" style={{ marginBottom: '25px' }}>
                    <label style={{ fontWeight: 600, display: 'block', marginBottom: '8px' }}>Username or email</label>
                    <input required type="text" style={{ width: '100%', height: '45px', padding: '0 15px', border: '1px solid #ddd' }} />
                  </div>
                  <div className="col-12 text-center learts-mb-30">
                    <button type="submit" className="btn btn-dark btn-outline-hover-dark" style={{ padding: '12px 30px' }}>reset password</button>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // 5. My Account Dashboard
  if (path === '/my-account') {
    return (
      <div className="my-account-page">
        <div 
          className="page-title-section section" 
          style={{ 
            backgroundImage: 'url("/assets/images/bg/page-title-1.webp")',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            padding: '60px 0'
          }}
        >
          <div className="container">
            <div className="page-title">
              <h1 className="title" style={{ fontFamily: 'var(--font-serif)', color: '#111' }}>My Account</h1>
              <ul className="breadcrumb">
                <li className="breadcrumb-item"><a href="/">Home</a></li>
                <li className="breadcrumb-item active">My Account</li>
              </ul>
            </div>
          </div>
        </div>

        <div className="section section-padding">
          <div className="container">
            <div className="row g-4">
              {/* Tab menu */}
              <div className="col-lg-4 col-12">
                <div className="myaccount-tab-list nav" style={{ display: 'flex', flexDirection: 'column', border: '1px solid #eee' }}>
                  <button onClick={() => setActiveTab('dashboard')} className={activeTab === 'dashboard' ? 'active' : ''} style={{ border: 'none', borderBottom: '1px solid #eee', padding: '15px 20px', textAlign: 'left', background: 'none' }}>
                    Dashboard <i className="far fa-home" style={{ float: 'right' }}></i>
                  </button>
                  <button onClick={() => setActiveTab('orders')} className={activeTab === 'orders' ? 'active' : ''} style={{ border: 'none', borderBottom: '1px solid #eee', padding: '15px 20px', textAlign: 'left', background: 'none' }}>
                    Orders <i className="far fa-file-alt" style={{ float: 'right' }}></i>
                  </button>
                  <button onClick={() => setActiveTab('address')} className={activeTab === 'address' ? 'active' : ''} style={{ border: 'none', borderBottom: '1px solid #eee', padding: '15px 20px', textAlign: 'left', background: 'none' }}>
                    Address <i className="far fa-map-marker-alt" style={{ float: 'right' }}></i>
                  </button>
                  <button onClick={() => setActiveTab('details')} className={activeTab === 'details' ? 'active' : ''} style={{ border: 'none', borderBottom: '1px solid #eee', padding: '15px 20px', textAlign: 'left', background: 'none' }}>
                    Account Details <i className="far fa-user" style={{ float: 'right' }}></i>
                  </button>
                  <Link to="/login" style={{ padding: '15px 20px', textDecoration: 'none', color: '#111' }}>
                    Logout <i className="far fa-sign-out-alt" style={{ float: 'right' }}></i>
                  </Link>
                </div>
              </div>

              {/* Tab content */}
              <div className="col-lg-8 col-12">
                <div className="tab-content" style={{ border: '1px solid #eee', padding: '30px', minHeight: '300px' }}>
                  {activeTab === 'dashboard' && (
                    <div className="myaccount-content dashboard" style={{ color: '#555', lineHeight: '1.7' }}>
                      <p>Hello <strong>Guest User</strong> (not <strong>Guest User</strong>? <Link to="/login">Log out</Link>)</p>
                      <p>From your account dashboard you can view your <span>recent orders</span>, manage your <span>shipping and billing addresses</span>, and <span>edit your password and account details</span>.</p>
                    </div>
                  )}

                  {activeTab === 'orders' && (
                    <div className="myaccount-content order">
                      <h4 style={{ fontFamily: 'var(--font-serif)', marginBottom: '20px' }}>Your Orders</h4>
                      <p style={{ color: '#666' }}>No orders have been placed yet.</p>
                    </div>
                  )}

                  {activeTab === 'address' && (
                    <div className="myaccount-content address">
                      <h4 style={{ fontFamily: 'var(--font-serif)', marginBottom: '20px' }}>Billing Address</h4>
                      <address style={{ color: '#666', fontStyle: 'normal', lineHeight: '1.6' }}>
                        <strong>John Doe</strong><br />
                        1800 Abbot Kinney Blvd. Unit D & E<br />
                        Venice, CA 90291<br />
                        United States
                      </address>
                    </div>
                  )}

                  {activeTab === 'details' && (
                    <div className="myaccount-content account-details">
                      <h4 style={{ fontFamily: 'var(--font-serif)', marginBottom: '20px' }}>Account Details</h4>
                      <form onSubmit={(e) => { e.preventDefault(); toast.success('Account details updated successfully!'); }}>
                        <div className="row g-3">
                          <div className="col-md-6 col-12">
                            <label style={{ display: 'block', marginBottom: '8px' }}>First Name</label>
                            <input type="text" defaultValue="John" style={{ width: '100%', height: '40px', padding: '0 10px', border: '1px solid #ddd' }} />
                          </div>
                          <div className="col-md-6 col-12">
                            <label style={{ display: 'block', marginBottom: '8px' }}>Last Name</label>
                            <input type="text" defaultValue="Doe" style={{ width: '100%', height: '40px', padding: '0 10px', border: '1px solid #ddd' }} />
                          </div>
                          <div className="col-12" style={{ marginTop: '15px' }}>
                            <label style={{ display: 'block', marginBottom: '8px' }}>Email Address</label>
                            <input type="email" defaultValue="johndoe@example.com" style={{ width: '100%', height: '40px', padding: '0 10px', border: '1px solid #ddd' }} />
                          </div>
                          <div className="col-12 text-center" style={{ marginTop: '20px' }}>
                            <button type="submit" className="btn btn-dark">Save Changes</button>
                          </div>
                        </div>
                      </form>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container text-center py-5">
      <h3>Utility Page</h3>
    </div>
  );
};
export default ShopOthers;
