import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useCartStore } from '../store/useCartStore';
import { useWishlistStore } from '../store/useWishlistStore';
import { useQuery } from '@tanstack/react-query';
import { getProducts } from '../services/api';

export const Header: React.FC = () => {
  const location = useLocation();
  if (location.pathname.startsWith('/admin')) {
    return null;
  }

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const cartItemsCount = useCartStore((state) => state.getTotalItemsCount());
  const wishlistCount = useWishlistStore((state) => state.items.length);

  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const { data: productsData } = useQuery({
    queryKey: ['headerProducts'],
    queryFn: () => getProducts({ limit: 100 }),
  });

  const filteredProducts = searchQuery.trim()
    ? productsData?.products.filter((p) =>
        p.name.toLowerCase().includes(searchQuery.toLowerCase())
      ) || []
    : [];

  return (
    <>
      {/* Topbar Section Start */}
      <div className="topbar-section section bg-primary2">
        <div className="container">
          <div className="row justify-content-between align-items-center">
            <div className="col-md-auto col-12">
              <p className="text-white text-center text-md-left my-2">Free shipping for orders over 1.000.000₫ !</p>
            </div>
            <div className="col-auto d-none d-md-block">
              <div className="topbar-menu">
                <ul>
                  <li><a href="#" className="text-white"><i className="fa fa-map-marker-alt"></i> Store Location</a></li>
                  <li><a href="#" className="text-white"><i className="fa fa-truck"></i> Order Status</a></li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* Topbar Section End */}

      {/* Header Section Start */}
      <div className="header-section section bg-white d-none d-xl-block">
        <div className="container">
          <div className="row row-cols-lg-3 align-items-center">
            {/* Header Language & Currency Start */}
            <div className="col">
              <ul className="header-lan-curr">
                <li><a href="#">English</a>
                  <ul className="curr-lan-sub-menu">
                    <li><a href="#">Français</a></li>
                    <li><a href="#">Deutsch</a></li>
                  </ul>
                </li>
                <li><a href="#">USD</a>
                  <ul className="curr-lan-sub-menu">
                    <li><a href="#">EUR</a></li>
                    <li><a href="#">GBP</a></li>
                  </ul>
                </li>
              </ul>
            </div>
            {/* Header Language & Currency End */}

            {/* Header Logo Start */}
            <div className="col">
              <div className="header-logo justify-content-center">
                <Link to="/">
                  <img src="/assets/images/logo/logo.webp" alt="Learts Logo" />
                </Link>
              </div>
            </div>
            {/* Header Logo End */}

            {/* Header Tools Start */}
            <div className="col">
              <div className="header-tools justify-content-end">
                <div className="header-login">
                  <Link to="/my-account"><i className="far fa-user"></i></Link>
                </div>
                <div className="header-search">
                  <a href="#" onClick={(e) => { e.preventDefault(); setIsSearchOpen(true); }}><i className="fas fa-search"></i></a>
                </div>
                <div className="header-wishlist">
                  <Link to="/wishlist">
                    <span className="wishlist-count">{wishlistCount}</span>
                    <i className="far fa-heart"></i>
                  </Link>
                </div>
                <div className="header-cart">
                  <Link to="/cart">
                    <span className="cart-count">{cartItemsCount}</span>
                    <i className="fas fa-shopping-cart"></i>
                  </Link>
                </div>
              </div>
            </div>
            {/* Header Tools End */}
          </div>
        </div>

        {/* Site Menu Section Start */}
        <div className="site-menu-section section">
          <div className="container">
            <nav className="site-main-menu justify-content-center">
              <ul>
                <li className="has-children">
                  <Link to="/"><span className="menu-text">Home</span></Link>
                  <ul className="sub-menu mega-menu">
                    <li>
                      <a href="#" className="mega-menu-title" onClick={(e) => e.preventDefault()}><span className="menu-text">HOME GROUP</span></a>
                      <ul>
                        <li><img className="mmh_img" src="/assets/images/demo/menu/home-01.webp" alt="home-01" /> <Link to="/home-1"><span className="menu-text">Arts Propelled</span></Link></li>
                        <li><img className="mmh_img" src="/assets/images/demo/menu/home-02.webp" alt="home-02" /> <Link to="/home-2"><span className="menu-text">Decor Thriving</span></Link></li>
                        <li><img className="mmh_img" src="/assets/images/demo/menu/home-03.webp" alt="home-03" /> <Link to="/home-3"><span className="menu-text">Savvy Delight</span></Link></li>
                        <li><img className="mmh_img" src="/assets/images/demo/menu/home-04.webp" alt="home-04" /> <Link to="/home-4"><span className="menu-text">Perfect Escapes</span></Link></li>
                      </ul>
                    </li>
                    <li>
                      <a href="#" className="mega-menu-title" onClick={(e) => e.preventDefault()}><span className="menu-text">HOME GROUP</span></a>
                      <ul>
                        <li><img className="mmh_img" src="/assets/images/demo/menu/home-05.webp" alt="home-05" /> <Link to="/"><span className="menu-text">Kitchen Cozy</span></Link></li>
                        <li><img className="mmh_img" src="/assets/images/demo/menu/home-06.webp" alt="home-06" /> <Link to="/"><span className="menu-text">Dreamy Designs</span></Link></li>
                        <li><img className="mmh_img" src="/assets/images/demo/menu/home-07.webp" alt="home-07" /> <Link to="/"><span className="menu-text">Crispy Recipes</span></Link></li>
                        <li><img className="mmh_img" src="/assets/images/demo/menu/home-08.webp" alt="home-08" /> <Link to="/"><span className="menu-text">Decoholic Chic</span></Link></li>
                      </ul>
                    </li>
                    <li>
                      <a href="#" className="mega-menu-title" onClick={(e) => e.preventDefault()}><span className="menu-text">HOME GROUP</span></a>
                      <ul>
                        <li><img className="mmh_img" src="/assets/images/demo/menu/home-9.webp" alt="home-9" /> <Link to="/"><span className="menu-text">Reblended Dish</span></Link></li>
                        <li><img className="mmh_img" src="/assets/images/demo/menu/home-10.webp" alt="home-10" /> <Link to="/"><span className="menu-text">Craftin House</span></Link></li>
                        <li><img className="mmh_img" src="/assets/images/demo/menu/home-11.webp" alt="home-11" /> <Link to="/"><span className="menu-text">Craftswork Biz</span></Link></li>
                      </ul>
                    </li>
                    <li>
                      <a href="#" className="menu-banner" onClick={(e) => e.preventDefault()}><img src="/assets/images/banner/menu-banner-1.webp" alt="Home Menu Banner" /></a>
                    </li>
                  </ul>
                </li>
                <li className="has-children">
                  <Link to="/shop"><span className="menu-text">Shop</span></Link>
                  <ul className="sub-menu mega-menu">
                    <li>
                      <a href="#" className="mega-menu-title" onClick={(e) => e.preventDefault()}><span className="menu-text">SHOP PAGES</span></a>
                      <ul>
                        <li><Link to="/shop"><span className="menu-text">Shop No Sidebar</span></Link></li>
                        <li><Link to="/shop-left-sidebar"><span className="menu-text">Shop Left Sidebar</span></Link></li>
                        <li><Link to="/shop-right-sidebar"><span className="menu-text">Shop Right Sidebar</span></Link></li>
                        <li><Link to="/shop-fullwidth"><span className="menu-text">Shop Fullwidth No Space</span></Link></li>
                        <li><Link to="/shop-fullwidth"><span className="menu-text">Shop Fullwidth No Sidebar</span></Link></li>
                        <li><Link to="/shop-left-sidebar"><span className="menu-text">Shop Fullwidth Left Sidebar</span></Link></li>
                        <li><Link to="/shop-right-sidebar"><span className="menu-text">Shop Fullwidth Right Sidebar</span></Link></li>
                      </ul>
                    </li>
                    <li>
                      <a href="#" className="mega-menu-title" onClick={(e) => e.preventDefault()}><span className="menu-text">PRODUCT PAGES</span></a>
                      <ul>
                        <li><Link to="/product/1?layout=basic"><span className="menu-text">Basic</span></Link></li>
                        <li><Link to="/product/2?layout=fullwidth"><span className="menu-text">Fullwidth</span></Link></li>
                        <li><Link to="/product/3?layout=sticky"><span className="menu-text">Sticky Details</span></Link></li>
                        <li><Link to="/product/4?layout=sidebar"><span className="menu-text">Width Sidebar</span></Link></li>
                        <li><Link to="/product/5?layout=extra"><span className="menu-text">Extra Content</span></Link></li>
                        <li><Link to="/product/6?layout=variations"><span className="menu-text">Variations Images</span></Link></li>
                        <li><Link to="/product/7?layout=bought-together"><span className="menu-text">Bought Together</span></Link></li>
                        <li><Link to="/product/8?layout=360"><span className="menu-text">Product 360</span></Link></li>
                      </ul>
                    </li>
                    <li>
                      <a href="#" className="mega-menu-title" onClick={(e) => e.preventDefault()}><span className="menu-text">PRODUCT & Other PAGES</span></a>
                      <ul>
                        <li><Link to="/product/1?layout=background"><span className="menu-text">Product with Background</span></Link></li>
                        <li><Link to="/cart"><span className="menu-text">Shopping Cart</span></Link></li>
                        <li><Link to="/checkout"><span className="menu-text">Checkout</span></Link></li>
                        <li><Link to="/order-tracking"><span className="menu-text">Order Tracking</span></Link></li>
                        <li><Link to="/wishlist"><span className="menu-text">Wishlist</span></Link></li>
                        <li><Link to="/login"><span className="menu-text">Customer Login</span></Link></li>
                        <li><Link to="/my-account"><span className="menu-text">My Account</span></Link></li>
                        <li><Link to="/lost-password"><span className="menu-text">Lost Password</span></Link></li>
                      </ul>
                    </li>
                    <li className="align-self-center">
                      <a href="#" className="menu-banner" onClick={(e) => e.preventDefault()}><img src="/assets/images/banner/menu-banner-2.webp" alt="Shop Menu Banner" /></a>
                    </li>
                  </ul>
                </li>
                <li className="has-children">
                  <a href="#" onClick={(e) => e.preventDefault()}><span className="menu-text">Project</span></a>
                  <ul className="sub-menu">
                    <li><Link to="/portfolio-3-columns"><span className="menu-text">Portfolio 3 Columns</span></Link></li>
                    <li><Link to="/portfolio-4-columns"><span className="menu-text">Portfolio 4 Columns</span></Link></li>
                    <li><Link to="/portfolio-5-columns"><span className="menu-text">Portfolio 5 Columns</span></Link></li>
                    <li><Link to="/portfolio-details/2"><span className="menu-text">Portfolio Details</span></Link></li>
                  </ul>
                </li>
                <li className="has-children">
                  <a href="#" onClick={(e) => e.preventDefault()}><span className="menu-text">Elements</span></a>
                  <ul className="sub-menu mega-menu">
                    <li>
                      <a href="#" className="mega-menu-title" onClick={(e) => e.preventDefault()}><span className="menu-text">Column One</span></a>
                      <ul>
                        <li><Link to="/elements/product-styles"><span className="menu-text">Product Styles</span></Link></li>
                        <li><Link to="/elements/products-tabs"><span className="menu-text">Product Tabs</span></Link></li>
                        <li><Link to="/elements/product-sale-banner"><span className="menu-text">Product & Sale Banner</span></Link></li>
                      </ul>
                    </li>
                    <li>
                      <a href="#" className="mega-menu-title" onClick={(e) => e.preventDefault()}><span className="menu-text">Column Two</span></a>
                      <ul>
                        <li><Link to="/elements/category-banner"><span className="menu-text">Category Banner</span></Link></li>
                        <li><Link to="/elements/team"><span className="menu-text">Team Member</span></Link></li>
                        <li><Link to="/elements/testimonials"><span className="menu-text">Testimonials</span></Link></li>
                      </ul>
                    </li>
                    <li>
                      <a href="#" className="mega-menu-title" onClick={(e) => e.preventDefault()}><span className="menu-text">Column Three</span></a>
                      <ul>
                        <li><Link to="/elements/instagram"><span className="menu-text">Instagram</span></Link></li>
                        <li><Link to="/elements/map"><span className="menu-text">Google Map</span></Link></li>
                        <li><Link to="/elements/icon-box"><span className="menu-text">Icon Box</span></Link></li>
                      </ul>
                    </li>
                    <li>
                      <a href="#" className="mega-menu-title" onClick={(e) => e.preventDefault()}><span className="menu-text">Column Four</span></a>
                      <ul>
                        <li><Link to="/elements/buttons"><span className="menu-text">Buttons</span></Link></li>
                        <li><Link to="/elements/faq"><span className="menu-text">FAQs / Toggles</span></Link></li>
                        <li><Link to="/elements/brands"><span className="menu-text">Brands</span></Link></li>
                      </ul>
                    </li>
                  </ul>
                </li>
                <li className="has-children">
                  <a href="#" onClick={(e) => e.preventDefault()}><span className="menu-text">Blog</span></a>
                  <ul className="sub-menu">
                    <li className="has-children">
                      <Link to="/blog"><span className="menu-text">Standard Layout</span></Link>
                      <ul className="sub-menu">
                        <li><Link to="/blog"><span className="menu-text">Right Sidebar</span></Link></li>
                        <li><Link to="/blog"><span className="menu-text">Left Sidebar</span></Link></li>
                        <li><Link to="/blog"><span className="menu-text">Full Width</span></Link></li>
                      </ul>
                    </li>
                    <li className="has-children">
                      <Link to="/blog-grid-right-sidebar"><span className="menu-text">Grid Layout</span></Link>
                      <ul className="sub-menu">
                        <li><Link to="/blog-grid-right-sidebar"><span className="menu-text">Right Sidebar</span></Link></li>
                        <li><Link to="/blog-grid-left-sidebar"><span className="menu-text">Left Sidebar</span></Link></li>
                        <li><Link to="/blog-grid-fullwidth"><span className="menu-text">Full Width</span></Link></li>
                      </ul>
                    </li>
                  </ul>
                </li>
                <li className="has-children">
                  <a href="#" onClick={(e) => e.preventDefault()}><span className="menu-text">Pages</span></a>
                  <ul className="sub-menu">
                    <li><Link to="/about"><span className="menu-text">About us</span></Link></li>
                    <li><Link to="/about-2"><span className="menu-text">About us 02</span></Link></li>
                    <li><Link to="/contact"><span className="menu-text">Contact us</span></Link></li>
                    <li><Link to="/coming-soon"><span className="menu-text">Coming Soon</span></Link></li>
                    <li><Link to="/page-404"><span className="menu-text">Page 404</span></Link></li>
                  </ul>
                </li>
                <li>
                  <Link to="/admin"><span className="menu-text" style={{ color: 'var(--color-primary)', fontWeight: 'bold' }}>Admin</span></Link>
                </li>
              </ul>
            </nav>
          </div>
        </div>
        {/* Site Menu Section End */}
      </div>
      {/* Header Section End */}

      {/* Mobile Header Section Start */}
      <div className="mobile-header bg-white section d-xl-none">
        <div className="container">
          <div className="row align-items-center">
            {/* Header Logo Start */}
            <div className="col">
              <div className="header-logo">
                <Link to="/">
                  <img src="/assets/images/logo/logo-2.webp" alt="Learts Logo" />
                </Link>
              </div>
            </div>
            {/* Header Logo End */}

            {/* Header Tools Start */}
            <div className="col-auto">
              <div className="header-tools justify-content-end">
                <div className="header-login d-none d-sm-block">
                  <Link to="/my-account"><i className="far fa-user"></i></Link>
                </div>
                <div className="header-search">
                  <a href="#" onClick={(e) => { e.preventDefault(); setIsSearchOpen(true); }}><i className="fas fa-search"></i></a>
                </div>
                <div className="header-wishlist d-none d-sm-block">
                  <Link to="/wishlist">
                    <span className="wishlist-count">{wishlistCount}</span>
                    <i className="far fa-heart"></i>
                  </Link>
                </div>
                <div className="header-cart">
                  <Link to="/cart">
                    <span className="cart-count">{cartItemsCount}</span>
                    <i className="fas fa-shopping-cart"></i>
                  </Link>
                </div>
                <div className="mobile-menu-toggle" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
                  <button className="offcanvas-toggle" style={{ background: 'none', border: 'none', cursor: 'pointer' }}>
                    <i className={isMobileMenuOpen ? 'fas fa-times' : 'fas fa-bars'} style={{ fontSize: '20px' }}></i>
                  </button>
                </div>
              </div>
            </div>
            {/* Header Tools End */}
          </div>
        </div>

        {/* Mobile menu content */}
        {isMobileMenuOpen && (
          <div className="mobile-menu-dropdown" style={{ borderTop: '1px solid #eee', padding: '15px 24px', backgroundColor: '#fff' }}>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
              <li style={{ padding: '8px 0' }}><Link to="/" onClick={() => setIsMobileMenuOpen(false)}>Home</Link></li>
              <li style={{ padding: '8px 0' }}><Link to="/shop" onClick={() => setIsMobileMenuOpen(false)}>Shop</Link></li>
              <li style={{ padding: '8px 0' }}><Link to="/cart" onClick={() => setIsMobileMenuOpen(false)}>Cart</Link></li>
              <li style={{ padding: '8px 0', borderTop: '1px dashed #eee', marginTop: '5px' }}><Link to="/admin" onClick={() => setIsMobileMenuOpen(false)} style={{ color: 'var(--color-primary)', fontWeight: 'bold' }}>Admin</Link></li>
            </ul>
          </div>
        )}
      </div>
      {/* Mobile Header Section End */}

      {isSearchOpen && (
        <div 
          className="search-overlay" 
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            backgroundColor: 'rgba(0,0,0,0.92)',
            zIndex: 9999,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '20px',
            backdropFilter: 'blur(8px)',
          }}
        >
          {/* Close button */}
          <button 
            onClick={() => { setIsSearchOpen(false); setSearchQuery(''); }}
            style={{
              position: 'absolute',
              top: '30px',
              right: '30px',
              background: 'none',
              border: 'none',
              color: '#fff',
              fontSize: '2rem',
              cursor: 'pointer',
              opacity: 0.8
            }}
          >
            <i className="ti-close"></i>
          </button>

          {/* Search container */}
          <div style={{ width: '100%', maxWidth: '600px', textAlign: 'center' }}>
            <h2 style={{ color: '#fff', fontFamily: 'var(--font-serif)', marginBottom: '30px' }}>Search products</h2>
            <div style={{ position: 'relative', borderBottom: '2px solid #fff', display: 'flex', alignItems: 'center' }}>
              <input 
                type="text" 
                placeholder="Search Products..." 
                autoFocus
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={{
                  width: '100%',
                  height: '60px',
                  background: 'none',
                  border: 'none',
                  color: '#fff',
                  fontSize: '1.5rem',
                  outline: 'none',
                  paddingRight: '40px'
                }}
              />
              <i className="fas fa-search" style={{ color: '#fff', fontSize: '1.25rem', position: 'absolute', right: '10px' }}></i>
            </div>

            {/* Results listing */}
            {searchQuery.trim() && (
              <div 
                style={{
                  marginTop: '30px',
                  backgroundColor: 'rgba(255,255,255,0.1)',
                  borderRadius: '4px',
                  maxHeight: '300px',
                  overflowY: 'auto',
                  textAlign: 'left'
                }}
              >
                {filteredProducts.length === 0 ? (
                  <div style={{ padding: '20px', color: '#ccc', textAlign: 'center' }}>No products found.</div>
                ) : (
                  <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                    {filteredProducts.map((prod) => (
                      <li key={prod.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                        <Link 
                          to={`/product/${prod.id}`}
                          onClick={() => { setIsSearchOpen(false); setSearchQuery(''); }}
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '15px',
                            padding: '12px 20px',
                            color: '#fff',
                            textDecoration: 'none'
                          }}
                        >
                          <img src={prod.imageUrl} alt={prod.name} style={{ width: '40px', height: '40px', objectFit: 'contain', backgroundColor: '#fff', borderRadius: '2px' }} />
                          <div>
                            <span style={{ fontWeight: 600, display: 'block' }}>{prod.name}</span>
                            <span style={{ fontSize: '0.85rem', color: '#ccc' }}>{(prod.price).toLocaleString('vi-VN')} ₫</span>
                          </div>
                        </Link>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
};
export default Header;
