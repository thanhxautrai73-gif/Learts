import React, { useState } from 'react';
import { useParams, Link, useSearchParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { getProductDetail, getProducts } from '../services/api';
import { useCartStore } from '../store/useCartStore';
import { LoadingSpinner } from '../components/LoadingSpinner';
import { ProductCard } from '../components/ProductCard';
import toast from 'react-hot-toast';

export const ProductDetail: React.FC = () => {
  const { productId } = useParams<{ productId: string }>();
  const [searchParams] = useSearchParams();
  const layout = searchParams.get('layout') || 'basic';

  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState<'description' | 'brand' | 'additional' | 'reviews' | 'extra'>('description');
  const addItem = useCartStore((state) => state.addItem);

  // Layout-specific states
  const [selectedVariant, setSelectedVariant] = useState('Gold');
  const [includeBundleAccessories, setIncludeBundleAccessories] = useState(true);

  const renderSummaryContent = () => {
    if (!product) return null;
    return (
      <div className="product-summery">
        <div className="product-ratings">
          <span className="star-rating">
            <span className="rating-active" style={{ width: '100%' }}>ratings</span>
          </span>
          <a href="#tab-reviews" className="review-link" onClick={(e) => { e.preventDefault(); setActiveTab('reviews'); }}>
            (<span className="count">3</span> customer reviews)
          </a>
        </div>
        
        <h3 className="product-title" style={{ fontFamily: 'var(--font-serif)', color: '#111', marginTop: '10px' }}>{product.name}</h3>
        
        <div className="product-price" style={{ color: 'var(--color-primary)', fontSize: '1.4rem', fontWeight: 600, margin: '15px 0' }}>
          {formatPrice(product.price)}
        </div>
        
        <div className="product-description" style={{ marginBottom: '25px', color: '#666', lineHeight: '1.7' }}>
          <p>{product.description}</p>
        </div>

        {/* Variations Images Swatches variant option */}
        {layout === 'variations' && (
          <div className="product-variations-swatches" style={{ marginBottom: '25px', borderTop: '1px solid #eee', paddingTop: '15px' }}>
            <span style={{ fontWeight: 600, display: 'block', marginBottom: '8px', fontSize: '0.9rem' }}>Color Variation: {selectedVariant}</span>
            <div style={{ display: 'flex', gap: '10px' }}>
              {['Gold', 'Silver', 'Space Gray'].map(col => (
                <button 
                  key={col}
                  onClick={() => { setSelectedVariant(col); toast.success(`Selected color: ${col}`); }}
                  style={{ 
                    width: '30px', 
                    height: '30px', 
                    borderRadius: '50%', 
                    backgroundColor: col === 'Gold' ? '#dfd0ab' : col === 'Silver' ? '#e1e1e1' : '#3c3d3a',
                    border: selectedVariant === col ? '2px solid #111' : '1px solid #ddd',
                    cursor: 'pointer'
                  }}
                />
              ))}
            </div>
          </div>
        )}

        <div className="product-variations" style={{ marginBottom: '20px' }}>
          <table>
            <tbody>
              <tr>
                <td className="label" style={{ fontWeight: 600, paddingRight: '20px' }}><span>Availability</span></td>
                <td className="value">
                  <span style={{ fontWeight: 600, color: isOutOfStock ? 'var(--color-error)' : 'var(--color-success)' }}>
                    {isOutOfStock ? 'Out of stock' : `In Stock (${product.stockQuantity} items available)`}
                  </span>
                </td>
              </tr>
              {!isOutOfStock && (
                <tr>
                  <td className="label" style={{ fontWeight: 600, paddingRight: '20px', paddingTop: '15px' }}><span>Quantity</span></td>
                  <td className="value" style={{ paddingTop: '15px' }}>
                    <div className="product-quantity" style={{ display: 'inline-flex', alignItems: 'center', border: '1px solid #ddd' }}>
                      <span 
                        className="qty-btn minus" 
                        onClick={handleDecrease}
                        style={{ cursor: quantity <= 1 ? 'not-allowed' : 'pointer', opacity: quantity <= 1 ? 0.4 : 1, padding: '5px 12px' }}
                      >
                        <i className="ti-minus"></i>
                      </span>
                      <input type="text" className="input-qty" value={quantity} readOnly style={{ width: '40px', textAlign: 'center', border: 'none', background: 'none' }} />
                      <span 
                        className="qty-btn plus" 
                        onClick={handleIncrease}
                        style={{ cursor: quantity >= product.stockQuantity ? 'not-allowed' : 'pointer', opacity: quantity >= product.stockQuantity ? 0.4 : 1, padding: '5px 12px' }}
                      >
                        <i className="ti-plus"></i>
                      </span>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Bought Together bundle deal */}
        {layout === 'bought-together' && (
          <div className="bought-together-block" style={{ border: '1px solid #eee', padding: '15px', borderRadius: '4px', margin: '25px 0', backgroundColor: '#fafafa' }}>
            <span style={{ fontWeight: 600, display: 'block', marginBottom: '10px', fontSize: '0.9rem' }}>Frequently Bought Together</span>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontSize: '0.9rem' }}>
                <input type="checkbox" checked={true} disabled />
                <span>This item: {product.name} - {formatPrice(product.price)}</span>
              </label>
              <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontSize: '0.9rem' }}>
                <input type="checkbox" checked={includeBundleAccessories} onChange={(e) => setIncludeBundleAccessories(e.target.checked)} />
                <span>Premium Gift Wrap Box - {formatPrice(5)}</span>
              </label>
            </div>
            <div style={{ marginTop: '12px', borderTop: '1px solid #eee', paddingTop: '10px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <span style={{ fontSize: '0.85rem', color: '#777' }}>Total Price: </span>
                <strong style={{ color: 'var(--color-primary)' }}>
                  {formatPrice(product.price + (includeBundleAccessories ? 5 : 0))}
                </strong>
              </div>
              <button 
                onClick={() => {
                  handleAddToCart();
                  if (includeBundleAccessories) {
                    addItem({ id: 9999, name: 'Premium Gift Wrap Box', price: 5, imageUrl: '/assets/images/product/cart-product-1.webp', stockQuantity: 10, categoryId: 4, description: 'Bundle wrap box' }, 1);
                  }
                  toast.success('Added bundle package to cart!');
                }}
                className="btn btn-dark btn-xs"
                style={{ padding: '5px 15px', fontSize: '0.8rem' }}
              >
                Add Bundle
              </button>
            </div>
          </div>
        )}

        <div className="product-buttons" style={{ display: 'flex', gap: '15px', marginTop: '25px', alignItems: 'center' }}>
          <a href="#" className="btn btn-icon btn-outline-body btn-hover-dark hintT-top" data-hint="Add to Wishlist" onClick={(e) => e.preventDefault()} style={{ width: '48px', height: '48px', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', border: '1px solid #ddd', borderRadius: '50%' }}>
            <i className="far fa-heart"></i>
          </a>
          <button 
            onClick={handleAddToCart}
            className={`btn ${isOutOfStock ? 'btn-light btn-disabled' : 'btn-dark btn-outline-hover-dark'}`}
            disabled={isOutOfStock}
            style={{ padding: '0 35px', height: '48px', lineHeight: '48px' }}
          >
            <i className="fas fa-shopping-cart" style={{ marginRight: '8px' }}></i> Add to Cart
          </button>
        </div>

        <div className="product-meta" style={{ marginTop: '30px', borderTop: '1px solid #eee', paddingTop: '15px' }}>
          <table>
            <tbody>
              <tr>
                <td className="label" style={{ color: '#999', paddingRight: '15px' }}>Category:</td>
                <td className="value">
                  <Link to={`/shop?category=${product.categoryId}`} style={{ color: '#111' }}>{product.categoryName}</Link>
                </td>
              </tr>
              <tr>
                <td className="label" style={{ color: '#999', paddingRight: '15px', paddingTop: '8px' }}>Tags:</td>
                <td className="value" style={{ paddingTop: '8px' }}>
                  <span style={{ fontSize: '0.85rem', color: '#777' }}>handmade, electronics, premium, learts</span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    );
  };

  const parsedId = productId ? parseInt(productId) : 0;

  // Fetch product detail data
  const { data: product, isLoading, error } = useQuery({
    queryKey: ['product', parsedId],
    queryFn: () => getProductDetail(parsedId),
    enabled: parsedId > 0,
  });

  // Fetch related products in the same category
  const { data: relatedProductsData } = useQuery({
    queryKey: ['relatedProducts', product?.categoryId],
    queryFn: () => getProducts({
      categoryId: product?.categoryId,
      limit: 4
    }),
    enabled: !!product?.categoryId,
  });

  const handleDecrease = () => {
    if (quantity > 1) {
      setQuantity((q) => q - 1);
    }
  };

  const handleIncrease = () => {
    if (product && quantity < product.stockQuantity) {
      setQuantity((q) => q + 1);
    } else {
      toast.error('Cannot select more than available stock.');
    }
  };

  const handleAddToCart = () => {
    if (!product) return;
    
    if (product.stockQuantity === 0) {
      toast.error('Sorry, this product is out of stock.');
      return;
    }

    const result = addItem(product, quantity);
    if (result.success) {
      toast.success(`Added ${quantity} ${quantity > 1 ? 'items' : 'item'} of ${product.name} to cart!`);
    } else {
      toast.error(result.message || 'Failed to add to cart.');
    }
  };

  const handleReviewSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const name = formData.get('name')?.toString().trim();
    const email = formData.get('email')?.toString().trim();
    const reviewText = formData.get('review')?.toString().trim();

    if (!name || !email || !reviewText) {
      toast.error('Please fill in all required fields.');
      return;
    }

    toast.success('Thank you! Your review has been submitted for moderation.');
    e.currentTarget.reset();
  };

  const formatPrice = (price: number) => {
    return '$' + price.toFixed(2);
  };

  if (isLoading) {
    return <LoadingSpinner />;
  }

  if (error || !product) {
    return (
      <div className="section section-padding">
        <div className="container text-center py-5">
          <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '2.5rem', marginBottom: '16px' }}>Product Not Found</h2>
          <p className="text-muted mb-4">
            We could not load details for this product. It may have been removed.
          </p>
          <Link to="/shop" className="btn btn-dark">
            Back to Shop
          </Link>
        </div>
      </div>
    );
  }

  const isOutOfStock = product.stockQuantity === 0;
  const filteredRelated = relatedProductsData?.products.filter(p => p.id !== product.id).slice(0, 4) || [];

  return (
    <div className="product-detail-template">
      {/* Page Title Section Start */}
      <div 
        className="page-title-section section" 
        style={{ 
          backgroundImage: 'url("/assets/images/slider/home1/slide-3.webp")',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          padding: '80px 0'
        }}
      >
        <div className="container">
          <div className="row">
            <div className="col">
              <div className="page-title">
                <h1 className="title" style={{ fontFamily: 'var(--font-serif)', color: '#111' }}>Product Details</h1>
                <ul className="breadcrumb">
                  <li className="breadcrumb-item"><a href="/">Home</a></li>
                  <li className="breadcrumb-item"><Link to="/shop">Shop</Link></li>
                  <li className="breadcrumb-item active">{product.name}</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* Page Title Section End */}

      {/* Single Product Section Start */}
      <div 
        className="section section-padding pb-0" 
        style={layout === 'background' ? { backgroundColor: '#F4F0EC', padding: '60px 0' } : {}}
      >
        <div className={layout === 'fullwidth' ? 'container-fluid' : 'container'} style={layout === 'fullwidth' ? { padding: '0 30px' } : {}}>
          
          {layout === 'sidebar' ? (
            /* Layout with Sidebar option */
            <div className="row g-4">
              <div className="col-lg-3 col-12 order-lg-1">
                <div className="widgets" style={{ marginRight: '15px' }}>
                  <div className="widget learts-mb-40">
                    <h3 className="widget-title" style={{ fontFamily: 'var(--font-serif)', fontSize: '1.25rem', borderBottom: '1px solid #ddd', paddingBottom: '8px' }}>Product Categories</h3>
                    <ul style={{ listStyle: 'none', padding: 0, marginTop: '15px' }}>
                      <li style={{ padding: '5px 0' }}><Link to="/shop" style={{ color: '#666' }}>Home Decor</Link></li>
                      <li style={{ padding: '5px 0' }}><Link to="/shop" style={{ color: '#666' }}>Toys</Link></li>
                      <li style={{ padding: '5px 0' }}><Link to="/shop" style={{ color: '#666' }}>Kitchen & Dining</Link></li>
                    </ul>
                  </div>
                </div>
              </div>
              <div className="col-lg-9 col-12 order-lg-2">
                <div className="row learts-mb-n40">
                  <div className="col-lg-6 col-12 learts-mb-40">
                    <div style={{ border: '1px solid #eee', padding: '20px', display: 'flex', justifyContent: 'center' }}>
                      <img src={product.imageUrl} alt={product.name} style={{ maxWidth: '100%', maxHeight: '420px', objectFit: 'contain' }} />
                    </div>
                  </div>
                  <div className="col-lg-6 col-12 learts-mb-40">
                    {renderSummaryContent()}
                  </div>
                </div>
              </div>
            </div>
          ) : (
            /* Grid layouts without page sidebar */
            <div className="row learts-mb-n40">
              {/* Product Images */}
              <div className="col-lg-6 col-12 learts-mb-40">
                {layout === '360' ? (
                  <div style={{ border: '1px solid #eee', padding: '30px', textAlign: 'center', backgroundColor: '#fafafa', position: 'relative' }}>
                    <div style={{ animation: 'spin 10s linear infinite', border: '2px dashed #ddd', borderRadius: '50%', padding: '15px', display: 'inline-block' }}>
                      <img src={product.imageUrl} alt={product.name} style={{ maxWidth: '100%', maxHeight: '350px', objectFit: 'contain' }} />
                    </div>
                    <span style={{ display: 'block', marginTop: '15px', fontWeight: 600, fontSize: '0.85rem', color: 'var(--color-primary)' }}>
                      <i className="fas fa-redo" style={{ marginRight: '8px' }}></i> 360° ROTATION PREVIEW ACTIVE
                    </span>
                  </div>
                ) : (
                  <div className="product-images" style={{ border: '1px solid #eee', padding: '20px', display: 'flex', justifyContent: 'center' }}>
                    <img src={product.imageUrl} alt={product.name} style={{ maxWidth: '100%', maxHeight: '500px', objectFit: 'contain' }} />
                  </div>
                )}
              </div>

              {/* Product Summary Column */}
              <div 
                className="col-lg-6 col-12 learts-mb-40"
                style={layout === 'sticky' ? { position: 'sticky', top: '100px' } : {}}
              >
                {renderSummaryContent()}
              </div>
            </div>
          )}

        </div>
      </div>

      {/* Tab Section Start */}
      <div className="section section-padding border-bottom mt-5">
        <div className="container">
          <ul className="nav product-info-tab-list" style={{ justifyContent: 'center', gap: '30px' }}>
            <li>
              <a 
                className={activeTab === 'description' ? 'active' : ''} 
                href="#"
                onClick={(e) => { e.preventDefault(); setActiveTab('description'); }}
              >
                Description
              </a>
            </li>
            <li>
              <a 
                className={activeTab === 'brand' ? 'active' : ''} 
                href="#"
                onClick={(e) => { e.preventDefault(); setActiveTab('brand'); }}
              >
                Brand
              </a>
            </li>
            <li>
              <a 
                className={activeTab === 'additional' ? 'active' : ''} 
                href="#"
                onClick={(e) => { e.preventDefault(); setActiveTab('additional'); }}
              >
                Additional information
              </a>
            </li>
            <li>
              <a 
                className={activeTab === 'reviews' ? 'active' : ''} 
                href="#"
                onClick={(e) => { e.preventDefault(); setActiveTab('reviews'); }}
              >
                Reviews (3)
              </a>
            </li>
            {layout === 'extra' && (
              <li>
                <a 
                  className={activeTab === 'extra' ? 'active' : ''} 
                  href="#"
                  onClick={(e) => { e.preventDefault(); setActiveTab('extra'); }}
                >
                  Extra Content
                </a>
              </li>
            )}
          </ul>

          <div className="tab-content product-infor-tab-content" style={{ marginTop: '30px' }}>
            {activeTab === 'description' && (
              <div className="tab-pane fade show active">
                <div className="row">
                  <div className="col-lg-10 col-12 mx-auto">
                    <p style={{ lineHeight: '1.8', color: '#555' }}>
                      {product.description}. Designed with precision and premium materials. High reliability and superb quality craftsmanship ensure a long-lasting and satisfying usage experience.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'brand' && (
              <div className="tab-pane fade show active">
                <div className="row learts-mb-n30">
                  <div className="col-12 learts-mb-30">
                    <div className="row learts-mb-n10 align-items-center">
                      <div className="col-lg-2 col-md-3 col-12 learts-mb-10">
                        <img src="/assets/images/brands/brand-3.webp" alt="Brand" style={{ maxWidth: '100px' }} />
                      </div>
                      <div className="col learts-mb-10">
                        <p style={{ color: '#555' }}>We’ve worked with numerous industries and famous fashion brands around the world. We connect every activity to set the trend and win customers’ trust. We make sure our customers are always happy with our products.</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'additional' && (
              <div className="tab-pane fade show active">
                <div className="row">
                  <div className="col-lg-8 col-md-10 col-12 mx-auto">
                    <div className="table-responsive">
                      <table className="table table-bordered">
                        <tbody>
                          <tr>
                            <td style={{ fontWeight: 600, width: '30%' }}>Dimensions</td>
                            <td>15 x 10 x 5 cm</td>
                          </tr>
                          <tr>
                            <td style={{ fontWeight: 600 }}>Weight</td>
                            <td>0.5 kg</td>
                          </tr>
                          <tr>
                            <td style={{ fontWeight: 600 }}>Materials</td>
                            <td>Premium Grade composite & metals</td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'reviews' && (
              <div className="tab-pane fade show active">
                <div className="product-review-wrapper" style={{ maxWidth: '800px', margin: '0 auto' }}>
                  <span className="title" style={{ fontWeight: 600, display: 'block', marginBottom: '20px' }}>3 reviews for {product.name}</span>
                  <ul className="product-review-list" style={{ listStyle: 'none', padding: 0 }}>
                    <li style={{ borderBottom: '1px solid #eee', paddingBottom: '20px', marginBottom: '20px' }}>
                      <div className="product-review" style={{ display: 'flex', gap: '20px' }}>
                        <div className="thumb">
                          <img src="/assets/images/review/review-1.webp" alt="Avatar" style={{ borderRadius: '50%', width: '60px', height: '60px' }} />
                        </div>
                        <div className="content">
                          <div className="ratings" style={{ color: '#f5c60d' }}>
                            <i className="fas fa-star"></i>
                            <i className="fas fa-star"></i>
                            <i className="fas fa-star"></i>
                            <i className="fas fa-star"></i>
                            <i className="fas fa-star"></i>
                          </div>
                          <div className="meta" style={{ margin: '8px 0' }}>
                            <h5 className="title" style={{ fontSize: '1rem', margin: 0 }}>Edna Watson</h5>
                            <span className="date" style={{ fontSize: '0.8rem', color: '#999' }}>November 27, 2020</span>
                          </div>
                          <p style={{ color: '#555' }}>Excellent product! Truly impressed with the detailed craftsmanship and build quality. Exceeded my expectations.</p>
                        </div>
                      </div>
                    </li>
                    <li style={{ borderBottom: '1px solid #eee', paddingBottom: '20px', marginBottom: '20px' }}>
                      <div className="product-review" style={{ display: 'flex', gap: '20px' }}>
                        <div className="thumb">
                          <img src="/assets/images/review/review-2.webp" alt="Avatar" style={{ borderRadius: '50%', width: '60px', height: '60px' }} />
                        </div>
                        <div className="content">
                          <div className="ratings" style={{ color: '#f5c60d' }}>
                            <i className="fas fa-star"></i>
                            <i className="fas fa-star"></i>
                            <i className="fas fa-star"></i>
                            <i className="fas fa-star"></i>
                            <i className="far fa-star"></i>
                          </div>
                          <div className="meta" style={{ margin: '8px 0' }}>
                            <h5 className="title" style={{ fontSize: '1rem', margin: 0 }}>Scott James</h5>
                            <span className="date" style={{ fontSize: '0.8rem', color: '#999' }}>November 27, 2020</span>
                          </div>
                          <p style={{ color: '#555' }}>Very good product. Delivery was fast and wrapping was great. Highly recommend to everyone looking for premium options.</p>
                        </div>
                      </div>
                    </li>
                  </ul>

                  {/* Add Review Form */}
                  <span className="title" style={{ fontWeight: 600, display: 'block', margin: '30px 0 15px' }}>Add a review</span>
                  <div className="review-form">
                    <p className="note" style={{ fontSize: '0.85rem', color: '#777', marginBottom: '20px' }}>Your email address will not be published. Required fields are marked *</p>
                    <form onSubmit={handleReviewSubmit}>
                      <div className="row learts-mb-n30">
                        <div className="col-md-6 col-12 learts-mb-30">
                          <input type="text" placeholder="Name *" name="name" required style={{ width: '100%', height: '45px', padding: '0 15px', border: '1px solid #ddd' }} />
                        </div>
                        <div className="col-md-6 col-12 learts-mb-30">
                          <input type="email" placeholder="Email *" name="email" required style={{ width: '100%', height: '45px', padding: '0 15px', border: '1px solid #ddd' }} />
                        </div>
                        <div className="col-12 learts-mb-30" style={{ marginTop: '20px' }}>
                          <textarea placeholder="Your Review *" name="review" required style={{ width: '100%', height: '120px', padding: '15px', border: '1px solid #ddd', resize: 'vertical' }}></textarea>
                        </div>
                        <div className="col-12 text-center learts-mb-30" style={{ marginTop: '20px' }}>
                          <button type="submit" className="btn btn-dark btn-outline-hover-dark" style={{ padding: '12px 30px' }}>Submit</button>
                        </div>
                      </div>
                    </form>
                  </div>
                </div>
              </div>
            )}

            {layout === 'extra' && activeTab === 'extra' && (
              <div className="tab-pane fade show active">
                <div className="row">
                  <div className="col-lg-10 col-12 mx-auto">
                    <h5 style={{ fontWeight: 600, marginBottom: '15px' }}>Care Instructions</h5>
                    <p style={{ color: '#555', lineHeight: '1.7', marginBottom: '20px' }}>Keep dry. Clean with a soft, dry cloth. Avoid contact with harsh chemicals or water logging. Store in a cool, dry place when not in use.</p>
                    <h5 style={{ fontWeight: 600, marginBottom: '15px' }}>Shipping Policy</h5>
                    <p style={{ color: '#555', lineHeight: '1.7' }}>All items ship within 1-3 business days. We offer global air shipping, tracking provided upon dispatch.</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
      {/* Tab Section End */}

      {/* Recommended Products Section Start */}
      {filteredRelated.length > 0 && (
        <div className="section section-padding">
          <div className="container">
            <div className="section-title2 text-center">
              <h2 className="title" style={{ fontFamily: 'var(--font-serif)' }}>You Might Also Like</h2>
            </div>
            <div className="products row row-cols-xl-4 row-cols-lg-3 row-cols-md-2 row-cols-sm-2 row-cols-1 g-4">
              {filteredRelated.map((relatedProd) => (
                <ProductCard key={relatedProd.id} product={relatedProd} />
              ))}
            </div>
          </div>
        </div>
      )}
      {/* Recommended Products Section End */}
    </div>
  );
};
export default ProductDetail;
