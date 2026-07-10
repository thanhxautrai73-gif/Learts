import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useCartStore } from '../store/useCartStore';
import { createOrder, type OrderInput } from '../services/api';
import toast from 'react-hot-toast';

// Define strict validation schema using Zod
const checkoutSchema = z.object({
  name: z.string()
    .min(3, 'Full name must be at least 3 characters long')
    .max(50, 'Full name cannot exceed 50 characters'),
  phone: z.string()
    .regex(/^[0-9]{10}$/, 'Phone number must be exactly 10 digits')
    .refine((val) => val.startsWith('0'), 'Phone number must start with 0 (Vietnamese format)'),
  email: z.string()
    .email('Please enter a valid email address'),
  address: z.string()
    .min(10, 'Please enter a complete address (at least 10 characters)')
    .max(150, 'Address cannot exceed 150 characters'),
});

type CheckoutFormData = z.infer<typeof checkoutSchema>;

export const Checkout: React.FC = () => {
  const navigate = useNavigate();
  const { items, getTotalPrice, clearCart } = useCartStore();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [orderSuccessData, setOrderSuccessData] = useState<{ id: number; total: number } | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CheckoutFormData>({
    resolver: zodResolver(checkoutSchema),
    defaultValues: {
      name: '',
      phone: '',
      email: '',
      address: '',
    }
  });

  const subtotal = getTotalPrice();
  const shippingFee = subtotal > 1000000 ? 0 : 30000;
  const total = subtotal + shippingFee;

  const handleOrderSubmit = async (data: CheckoutFormData) => {
    if (items.length === 0) {
      toast.error('Your cart is empty.');
      return;
    }

    setIsSubmitting(true);
    
    // Prepare API request payload
    const orderPayload: OrderInput = {
      name: data.name,
      phone: data.phone,
      email: data.email,
      address: data.address,
      items: items.map(item => ({
        productId: item.product.id,
        quantity: item.quantity
      }))
    };

    try {
      const response = await createOrder(orderPayload);
      setOrderSuccessData({
        id: response.orderId,
        total: response.totalAmount + shippingFee
      });
      toast.success('Order placed successfully!');
      clearCart();
    } catch (error: any) {
      console.error('Checkout error:', error);
      const errorMsg = error.response?.data?.message || 'Failed to place order. Please try again.';
      toast.error(errorMsg);
    } finally {
      setIsSubmitting(false);
    }
  };

  const formatPrice = (price: number) => {
    return '$' + price.toFixed(2);
  };

  // Success receipt view
  if (orderSuccessData) {
    return (
      <div className="section section-padding">
        <div className="container text-center py-5" style={{ maxWidth: '600px', margin: '0 auto' }}>
          <div style={{ display: 'inline-flex', width: '80px', height: '80px', borderRadius: '50%', backgroundColor: 'var(--color-cream)', color: 'var(--color-primary)', alignItems: 'center', justifyContent: 'center', marginBottom: '24px', fontSize: '32px' }}>
            <i className="fas fa-check"></i>
          </div>
          <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '2.5rem', marginBottom: '16px' }}>Order Placed!</h2>
          <p className="text-muted mb-4" style={{ fontSize: '1.05rem', lineHeight: '1.7' }}>
            Thank you for shopping with Learts! Your order <b>#{orderSuccessData.id}</b> has been received and is currently being processed. Total amount charged: <b>{formatPrice(orderSuccessData.total)}</b> (COD).
          </p>
          <button onClick={() => navigate('/')} className="btn btn-dark">
            Back to Homepage
          </button>
        </div>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="section section-padding">
        <div className="container text-center py-5">
          <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '2.5rem', marginBottom: '16px' }}>No items to checkout</h2>
          <p className="text-muted mb-4">
            Please add products to your cart before proceeding to checkout.
          </p>
          <Link to="/shop" className="btn btn-dark">
            Browse Catalog
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="checkout-page-template">
      {/* Page Title Section Start */}
      <div 
        className="page-title-section section" 
        style={{ 
          backgroundImage: 'url("/assets/images/slider/home1/slide-1.webp")',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          padding: '80px 0'
        }}
      >
        <div className="container">
          <div className="row">
            <div className="col">
              <div className="page-title">
                <h1 className="title" style={{ fontFamily: 'var(--font-serif)', color: '#111' }}>Checkout</h1>
                <ul className="breadcrumb">
                  <li className="breadcrumb-item"><a href="/">Home</a></li>
                  <li className="breadcrumb-item"><Link to="/cart">Cart</Link></li>
                  <li className="breadcrumb-item active">Checkout</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* Page Title Section End */}

      {/* Checkout Section Start */}
      <div className="section section-padding">
        <div className="container">
          <form onSubmit={handleSubmit(handleOrderSubmit)} className="checkout-form learts-mb-50">
            <div className="section-title2">
              <h2 className="title" style={{ fontFamily: 'var(--font-serif)' }}>Billing details</h2>
            </div>
            
            <div className="row">
              <div className="col-12 learts-mb-20">
                <label htmlFor="bdName">Full Name <abbr className="required" title="required">*</abbr></label>
                <input 
                  type="text" 
                  id="bdName" 
                  placeholder="Enter your full name" 
                  {...register('name')}
                />
                {errors.name && <span style={{ color: 'var(--color-error)', fontSize: '0.8rem', marginTop: '4px', display: 'block' }}>{errors.name.message}</span>}
              </div>

              <div className="col-md-6 col-12 learts-mb-20">
                <label htmlFor="bdEmail">Email address <abbr className="required" title="required">*</abbr></label>
                <input 
                  type="email" 
                  id="bdEmail" 
                  placeholder="Enter your email" 
                  {...register('email')}
                />
                {errors.email && <span style={{ color: 'var(--color-error)', fontSize: '0.8rem', marginTop: '4px', display: 'block' }}>{errors.email.message}</span>}
              </div>

              <div className="col-md-6 col-12 learts-mb-20">
                <label htmlFor="bdPhone">Phone <abbr className="required" title="required">*</abbr></label>
                <input 
                  type="text" 
                  id="bdPhone" 
                  placeholder="Enter 10-digit phone number" 
                  {...register('phone')}
                />
                {errors.phone && <span style={{ color: 'var(--color-error)', fontSize: '0.8rem', marginTop: '4px', display: 'block' }}>{errors.phone.message}</span>}
              </div>

              <div className="col-12 learts-mb-30">
                <label htmlFor="bdAddress">Delivery Address <abbr className="required" title="required">*</abbr></label>
                <textarea 
                  id="bdAddress" 
                  style={{ height: '80px', padding: '12px 20px', resize: 'vertical' }}
                  placeholder="Street address, district, city" 
                  {...register('address')}
                />
                {errors.address && <span style={{ color: 'var(--color-error)', fontSize: '0.8rem', marginTop: '4px', display: 'block' }}>{errors.address.message}</span>}
              </div>
            </div>

            <div className="section-title2 text-center mt-5">
              <h2 className="title" style={{ fontFamily: 'var(--font-serif)' }}>Your order</h2>
            </div>

            <div className="row learts-mb-n30">
              {/* Order Review List */}
              <div className="col-lg-6 order-lg-2 learts-mb-30">
                <div className="order-review">
                  <table className="table">
                    <thead>
                      <tr>
                        <th className="name">Product</th>
                        <th className="total">Subtotal</th>
                      </tr>
                    </thead>
                    <tbody>
                      {items.map((item) => (
                        <tr key={item.product.id}>
                          <td className="name">
                            {item.product.name}&nbsp; <strong className="quantity">×&nbsp;{item.quantity}</strong>
                          </td>
                          <td className="total">
                            <span>{formatPrice(item.product.price * item.quantity)}</span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                    <tfoot>
                      <tr className="subtotal">
                        <th>Subtotal</th>
                        <td><span>{formatPrice(subtotal)}</span></td>
                      </tr>
                      <tr className="subtotal">
                        <th>Shipping</th>
                        <td><span>{shippingFee === 0 ? 'Free' : formatPrice(shippingFee)}</span></td>
                      </tr>
                      <tr className="total">
                        <th>Total</th>
                        <td><strong><span>{formatPrice(total)}</span></strong></td>
                      </tr>
                    </tfoot>
                  </table>
                </div>
              </div>

              {/* Order Payment selection */}
              <div className="col-lg-6 order-lg-1 learts-mb-30">
                <div className="order-payment">
                  <div className="payment-method">
                    <div className="accordion" id="paymentMethod">
                      <div className="card active">
                        <div className="card-header" style={{ padding: '15px 20px' }}>
                          <button type="button" style={{ fontWeight: 600, border: 'none', background: 'none' }}>
                            Cash on delivery
                          </button>
                        </div>
                        <div className="collapse show">
                          <div className="card-body" style={{ padding: '15px 20px', fontSize: '0.85rem', color: '#666' }}>
                            <p>Pay with cash upon delivery. COD is safe, secure, and available nationwide.</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="text-center mt-4">
                    <p className="payment-note" style={{ fontSize: '0.8rem', color: '#999', marginBottom: '20px' }}>
                      Your personal data will be used to process your order, support your experience throughout this website, and for other purposes described in our privacy policy.
                    </p>
                    <button 
                      type="submit" 
                      className="btn btn-dark btn-outline-hover-dark" 
                      style={{ padding: '15px 40px' }}
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? 'Placing Order...' : 'place order'}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </form>
        </div>
      </div>
      {/* Checkout Section End */}
    </div>
  );
};
export default Checkout;
