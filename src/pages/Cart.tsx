import React from 'react';
import { Link } from 'react-router-dom';
import { useCartStore } from '../store/useCartStore';
import toast from 'react-hot-toast';

export const Cart: React.FC = () => {
  const { items, updateQuantity, removeItem, getTotalPrice } = useCartStore();

  const handleQtyChange = (productId: number, newQty: number, stockQuantity: number) => {
    const result = updateQuantity(productId, newQty, stockQuantity);
    if (!result.success) {
      toast.error(result.message || 'Cannot update quantity.');
    }
  };

  const handleRemove = (productId: number, productName: string) => {
    removeItem(productId);
    toast.success(`Removed ${productName} from cart.`);
  };

  const formatPrice = (price: number) => {
    return '$' + price.toFixed(2);
  };

  const subtotal = getTotalPrice();
  const shippingFee = subtotal > 1000000 || subtotal === 0 ? 0 : 30000;
  const total = subtotal + shippingFee;

  if (items.length === 0) {
    return (
      <div className="section section-padding">
        <div className="container text-center py-5">
          <div className="mb-4" style={{ fontSize: '72px', color: 'var(--color-primary-light)' }}>
            <i className="fas fa-shopping-bag"></i>
          </div>
          <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '2.5rem', marginBottom: '16px' }}>Your Cart is Empty</h2>
          <p className="text-muted mb-4">
            Looks like you haven't added anything to your cart yet. Browse our premium collections to get started!
          </p>
          <Link to="/shop" className="btn btn-dark">
            Start Shopping
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="cart-page-template">
      {/* Page Title Section Start */}
      <div 
        className="page-title-section section" 
        style={{ 
          backgroundImage: 'url("/assets/images/slider/home1/slide-2.webp")',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          padding: '80px 0'
        }}
      >
        <div className="container">
          <div className="row">
            <div className="col">
              <div className="page-title">
                <h1 className="title" style={{ fontFamily: 'var(--font-serif)', color: '#111' }}>Shopping Cart</h1>
                <ul className="breadcrumb">
                  <li className="breadcrumb-item"><a href="/">Home</a></li>
                  <li className="breadcrumb-item active">Cart</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* Page Title Section End */}

      {/* Shopping Cart Section Start */}
      <div className="section section-padding">
        <div className="container">
          <form className="cart-form" onSubmit={(e) => e.preventDefault()}>
            <table className="cart-wishlist-table table">
              <thead>
                <tr>
                  <th className="name" colSpan={2}>Product</th>
                  <th className="price">Price</th>
                  <th className="quantity">Quantity</th>
                  <th className="subtotal">Total</th>
                  <th className="remove">&nbsp;</th>
                </tr>
              </thead>
              <tbody>
                {items.map((item) => (
                  <tr key={item.product.id}>
                    <td className="thumbnail">
                      <Link to={`/product/${item.product.id}`}>
                        <img src={item.product.imageUrl} alt={item.product.name} style={{ width: '70px', height: '70px', objectFit: 'cover' }} />
                      </Link>
                    </td>
                    <td className="name">
                      <Link to={`/product/${item.product.id}`}>{item.product.name}</Link>
                    </td>
                    <td className="price">
                      <span>{formatPrice(item.product.price)}</span>
                    </td>
                    <td className="quantity">
                      <div className="product-quantity">
                        <span 
                          className="qty-btn minus" 
                          onClick={() => handleQtyChange(item.product.id, item.quantity - 1, item.product.stockQuantity)}
                          style={{ cursor: item.quantity <= 1 ? 'not-allowed' : 'pointer', opacity: item.quantity <= 1 ? 0.4 : 1 }}
                        >
                          <i className="ti-minus"></i>
                        </span>
                        <input type="text" className="input-qty" value={item.quantity} readOnly />
                        <span 
                          className="qty-btn plus" 
                          onClick={() => handleQtyChange(item.product.id, item.quantity + 1, item.product.stockQuantity)}
                          style={{ cursor: item.quantity >= item.product.stockQuantity ? 'not-allowed' : 'pointer', opacity: item.quantity >= item.product.stockQuantity ? 0.4 : 1 }}
                        >
                          <i className="ti-plus"></i>
                        </span>
                      </div>
                    </td>
                    <td className="subtotal">
                      <span>{formatPrice(item.product.price * item.quantity)}</span>
                    </td>
                    <td className="remove">
                      <button 
                        onClick={() => handleRemove(item.product.id, item.product.name)}
                        className="btn" 
                        style={{ border: 'none', background: 'none', color: 'var(--color-error)' }}
                        title="Remove"
                      >
                        ×
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            
            <div className="row justify-content-between mb-n3">
              <div className="col-auto mb-3">
                <div className="cart-coupon">
                  <input type="text" placeholder="Enter your coupon code" />
                  <button className="btn"><i className="fas fa-gift"></i></button>
                </div>
              </div>
              <div className="col-auto">
                <Link className="btn btn-light btn-hover-dark mr-3 mb-3" to="/shop" style={{ marginRight: '15px' }}>
                  Continue Shopping
                </Link>
              </div>
            </div>
          </form>

          <div className="cart-totals mt-5">
            <h2 className="title" style={{ fontFamily: 'var(--font-serif)' }}>Cart totals</h2>
            <table>
              <tbody>
                <tr className="subtotal">
                  <th>Subtotal</th>
                  <td><span className="amount">{formatPrice(subtotal)}</span></td>
                </tr>
                <tr className="subtotal">
                  <th>Shipping</th>
                  <td><span className="amount">{shippingFee === 0 ? 'Free' : formatPrice(shippingFee)}</span></td>
                </tr>
                <tr className="total">
                  <th>Total</th>
                  <td><strong><span className="amount">{formatPrice(total)}</span></strong></td>
                </tr>
              </tbody>
            </table>
            <Link to="/checkout" className="btn btn-dark btn-outline-hover-dark mt-3" style={{ padding: '15px 30px' }}>
              Proceed to Checkout
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
export default Cart;
