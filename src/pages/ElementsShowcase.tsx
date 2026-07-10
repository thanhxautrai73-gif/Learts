import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { getFeaturedProducts } from '../services/api';
import { ProductCard } from '../components/ProductCard';
import { ProductSkeleton } from '../components/LoadingSpinner';

export const ElementsShowcase: React.FC = () => {
  const { elementType } = useParams<{ elementType: string }>();

  const { data: featuredProducts, isLoading } = useQuery({
    queryKey: ['featuredProducts'],
    queryFn: getFeaturedProducts,
  });

  const getPageTitle = () => {
    switch (elementType) {
      case 'product-styles': return 'Product Styles';
      case 'products-tabs': return 'Product Tabs';
      case 'product-sale-banner': return 'Product & Sale Banner';
      case 'category-banner': return 'Category Banner';
      case 'team': return 'Team Members';
      case 'testimonials': return 'Testimonials';
      case 'instagram': return 'Instagram Feed';
      case 'map': return 'Google Map';
      case 'icon-box': return 'Icon Box';
      case 'buttons': return 'Buttons';
      case 'faq': return 'FAQs / Toggles';
      case 'brands': return 'Brands';
      default: return 'Element Showcase';
    }
  };

  const renderContent = () => {
    switch (elementType) {
      case 'product-styles':
        return (
          <div className="container">
            <h3 style={{ fontFamily: 'var(--font-serif)', marginBottom: '30px' }}>Product Card Designs</h3>
            {isLoading ? (
              <ProductSkeleton count={4} />
            ) : (
              <div className="row row-cols-xl-4 row-cols-lg-3 row-cols-md-2 row-cols-1 g-4">
                {featuredProducts?.slice(0, 4).map((p) => (
                  <ProductCard key={p.id} product={p} />
                ))}
              </div>
            )}
          </div>
        );

      case 'products-tabs':
        return (
          <div className="container">
            <h3 style={{ fontFamily: 'var(--font-serif)', marginBottom: '30px', textAlign: 'center' }}>Products Tab List</h3>
            <ul className="nav product-tab-list justify-content-center" style={{ gap: '20px', marginBottom: '30px' }}>
              <li><a className="active" href="#" onClick={(e) => e.preventDefault()}>New Arrivals</a></li>
              <li><a href="#" onClick={(e) => e.preventDefault()}>Sale Items</a></li>
              <li><a href="#" onClick={(e) => e.preventDefault()}>Best Sellers</a></li>
            </ul>
            {isLoading ? (
              <ProductSkeleton count={4} />
            ) : (
              <div className="row row-cols-xl-4 row-cols-lg-3 row-cols-md-2 row-cols-1 g-4">
                {featuredProducts?.slice(0, 4).map((p) => (
                  <ProductCard key={p.id} product={p} />
                ))}
              </div>
            )}
          </div>
        );

      case 'product-sale-banner':
        return (
          <div className="container">
            <div className="row g-4">
              <div className="col-md-6 col-12">
                <div className="sale-banner1" style={{ backgroundImage: 'url("/assets/images/banner/sale/sale-banner1-1.webp")', backgroundSize: 'cover', height: '350px', padding: '30px' }}>
                  <div className="inner">
                    <span className="title" style={{ color: '#111' }}>Spring Sale</span>
                    <h2 style={{ color: 'var(--color-primary)' }}>40% Off</h2>
                    <Link to="/shop" className="link">Shop Now</Link>
                  </div>
                </div>
              </div>
              <div className="col-md-6 col-12">
                <div className="sale-banner3-1" style={{ border: '1px solid #eee', padding: '30px', backgroundColor: '#fff', height: '350px', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                  <span className="special-title" style={{ color: 'var(--color-primary)' }}>Flash Sale</span>
                  <h2 style={{ fontFamily: 'var(--font-serif)', margin: '15px 0' }}>10% Off All Items</h2>
                  <Link to="/shop" className="link">Shop Now</Link>
                </div>
              </div>
            </div>
          </div>
        );

      case 'category-banner':
        return (
          <div className="container">
            <div className="row row-cols-md-3 row-cols-1 g-4">
              <div className="col">
                <div className="category-banner1">
                  <div className="inner">
                    <div className="image"><img src="/assets/images/banner/category/banner-s1-1.webp" alt="Cat 1" /></div>
                    <div className="content">
                      <h3 className="title">Accessories<span className="number">6 items</span></h3>
                    </div>
                  </div>
                </div>
              </div>
              <div className="col">
                <div className="category-banner1">
                  <div className="inner">
                    <div className="image"><img src="/assets/images/banner/category/banner-s1-2.webp" alt="Cat 2" /></div>
                    <div className="content">
                      <h3 className="title">Smartphones<span className="number">4 items</span></h3>
                    </div>
                  </div>
                </div>
              </div>
              <div className="col">
                <div className="category-banner1">
                  <div className="inner">
                    <div className="image"><img src="/assets/images/banner/category/banner-s1-3.webp" alt="Cat 3" /></div>
                    <div className="content">
                      <h3 className="title">Laptops<span className="number">12 items</span></h3>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );

      case 'team':
        return (
          <div className="container">
            <div className="row row-cols-md-3 row-cols-1 g-4">
              <div className="col text-center">
                <div className="team-member" style={{ padding: '20px', border: '1px solid #eee' }}>
                  <img src="/assets/images/about/about-5.webp" alt="Team 1" style={{ borderRadius: '50%', width: '120px', height: '120px', marginBottom: '15px' }} />
                  <h4 style={{ fontFamily: 'var(--font-serif)', margin: '10px 0 5px' }}>Charlotte Stone</h4>
                  <span style={{ fontSize: '0.85rem', color: '#999', textTransform: 'uppercase' }}>CEO / Founder</span>
                </div>
              </div>
              <div className="col text-center">
                <div className="team-member" style={{ padding: '20px', border: '1px solid #eee' }}>
                  <img src="/assets/images/about/about-6.webp" alt="Team 2" style={{ borderRadius: '50%', width: '120px', height: '120px', marginBottom: '15px' }} />
                  <h4 style={{ fontFamily: 'var(--font-serif)', margin: '10px 0 5px' }}>Lafayette Gray</h4>
                  <span style={{ fontSize: '0.85rem', color: '#999', textTransform: 'uppercase' }}>Creative Director</span>
                </div>
              </div>
              <div className="col text-center">
                <div className="team-member" style={{ padding: '20px', border: '1px solid #eee' }}>
                  <img src="/assets/images/about/about-7.webp" alt="Team 3" style={{ borderRadius: '50%', width: '120px', height: '120px', marginBottom: '15px' }} />
                  <h4 style={{ fontFamily: 'var(--font-serif)', margin: '10px 0 5px' }}>Ferdinand Stone</h4>
                  <span style={{ fontSize: '0.85rem', color: '#999', textTransform: 'uppercase' }}>Head Craftsman</span>
                </div>
              </div>
            </div>
          </div>
        );

      case 'testimonials':
        return (
          <div className="container">
            <div className="row g-4 justify-content-center">
              <div className="col-lg-8 col-12">
                <div className="testimonial text-center" style={{ padding: '40px', border: '1px solid #eee', backgroundColor: 'var(--color-cream)' }}>
                  <p style={{ fontStyle: 'italic', fontSize: '1.2rem', lineHeight: '1.8' }}>
                    "The products from Learts are absolutely phenomenal. The attention to detail in their handmade accessories is something you rarely find in shops these days."
                  </p>
                  <h5 style={{ fontFamily: 'var(--font-serif)', marginTop: '20px', marginBottom: '5px' }}>Donald Simpson</h5>
                  <span style={{ fontSize: '0.85rem', color: '#999' }}>Verified Buyer</span>
                </div>
              </div>
            </div>
          </div>
        );

      case 'instagram':
        return (
          <div className="container">
            <div className="row row-cols-md-4 row-cols-2 g-3">
              <div className="col">
                <div className="insta-item"><img src="/assets/images/instagram/instagram-1.webp" alt="Insta 1" style={{ width: '100%' }} /></div>
              </div>
              <div className="col">
                <div className="insta-item"><img src="/assets/images/instagram/instagram-2.webp" alt="Insta 2" style={{ width: '100%' }} /></div>
              </div>
              <div className="col">
                <div className="insta-item"><img src="/assets/images/instagram/instagram-3.webp" alt="Insta 3" style={{ width: '100%' }} /></div>
              </div>
              <div className="col">
                <div className="insta-item"><img src="/assets/images/instagram/instagram-4.webp" alt="Insta 4" style={{ width: '100%' }} /></div>
              </div>
            </div>
          </div>
        );

      case 'map':
        return (
          <div className="container">
            <div className="google-map" style={{ height: '400px', border: '1px solid #eee' }}>
              <iframe 
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3723.9244039868735!2d105.8190300760458!3d21.035710587541604!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1m0!2zMjHCsDAyJzA4LjYiTiAxMDXCsDQ5JzE3LjgiRQ!5e0!3m2!1sen!2s!4v1700000000000!5m2!1sen!2s" 
                width="100%" 
                height="100%" 
                style={{ border: 0 }} 
                allowFullScreen={true} 
                loading="lazy"
                title="Google Map"
              ></iframe>
            </div>
          </div>
        );

      case 'icon-box':
        return (
          <div className="container">
            <div className="row row-cols-md-3 row-cols-1 g-4 text-center">
              <div className="col">
                <div className="icon-box" style={{ padding: '30px', border: '1px solid #eee' }}>
                  <i className="ti-truck" style={{ fontSize: '2.5rem', color: 'var(--color-primary)', marginBottom: '15px', display: 'block' }}></i>
                  <h4 style={{ fontFamily: 'var(--font-serif)' }}>Free Delivery</h4>
                  <p style={{ fontSize: '0.9rem', color: '#666' }}>Free shipping on all orders over $100 within mainland US.</p>
                </div>
              </div>
              <div className="col">
                <div className="icon-box" style={{ padding: '30px', border: '1px solid #eee' }}>
                  <i className="ti-headphone-alt" style={{ fontSize: '2.5rem', color: 'var(--color-primary)', marginBottom: '15px', display: 'block' }}></i>
                  <h4 style={{ fontFamily: 'var(--font-serif)' }}>24/7 Support</h4>
                  <p style={{ fontSize: '0.9rem', color: '#666' }}>Always ready to support and assist our customers anytime.</p>
                </div>
              </div>
              <div className="col">
                <div className="icon-box" style={{ padding: '30px', border: '1px solid #eee' }}>
                  <i className="ti-reload" style={{ fontSize: '2.5rem', color: 'var(--color-primary)', marginBottom: '15px', display: 'block' }}></i>
                  <h4 style={{ fontFamily: 'var(--font-serif)' }}>30 Days Return</h4>
                  <p style={{ fontSize: '0.9rem', color: '#666' }}>Simply return the item within 30 days for a quick refund.</p>
                </div>
              </div>
            </div>
          </div>
        );

      case 'buttons':
        return (
          <div className="container text-center">
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '20px', justifyContent: 'center', alignItems: 'center' }}>
              <button className="btn btn-dark">Dark Button</button>
              <button className="btn btn-outline-dark">Outline Dark</button>
              <button className="btn btn-primary">Primary Button</button>
              <button className="btn btn-hover-dark btn-xs">Extra Small</button>
              <button className="btn btn-hover-dark btn-sm">Small Button</button>
              <button className="btn btn-hover-dark btn-lg">Large Button</button>
            </div>
          </div>
        );

      case 'faq':
        return (
          <div className="container" style={{ maxWidth: '800px' }}>
            <div className="accordion" id="faqAccordion">
              <div className="accordion-item" style={{ marginBottom: '15px', border: '1px solid #eee' }}>
                <h2 className="accordion-header" id="headingOne">
                  <button className="accordion-button" type="button" data-bs-toggle="collapse" data-bs-target="#collapseOne" aria-expanded="true" aria-controls="collapseOne" style={{ fontFamily: 'var(--font-serif)', fontSize: '1.1rem', backgroundColor: '#fff', color: '#111' }}>
                    What shipping options do you offer?
                  </button>
                </h2>
                <div id="collapseOne" className="accordion-collapse collapse show" aria-labelledby="headingOne" data-bs-parent="#faqAccordion">
                  <div className="accordion-body" style={{ color: '#666', lineHeight: '1.6' }}>
                    We offer standard shipping (3-5 business days), express shipping (1-2 business days), and international shipping. Standard shipping is free on orders over $100.
                  </div>
                </div>
              </div>
              <div className="accordion-item" style={{ marginBottom: '15px', border: '1px solid #eee' }}>
                <h2 className="accordion-header" id="headingTwo">
                  <button className="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#collapseTwo" aria-expanded="false" aria-controls="collapseTwo" style={{ fontFamily: 'var(--font-serif)', fontSize: '1.1rem', backgroundColor: '#fff', color: '#111' }}>
                    How can I return an item?
                  </button>
                </h2>
                <div id="collapseTwo" className="accordion-collapse collapse" aria-labelledby="headingTwo" data-bs-parent="#faqAccordion">
                  <div className="accordion-body" style={{ color: '#666', lineHeight: '1.6' }}>
                    You can return any unused item in its original packaging within 30 days of purchase. Simply visit our Returns Portal or contact support to start your return.
                  </div>
                </div>
              </div>
            </div>
          </div>
        );

      case 'brands':
        return (
          <div className="container">
            <div className="row row-cols-md-4 row-cols-2 g-4 text-center">
              <div className="col"><img src="/assets/images/brands/brand-1.webp" alt="Brand 1" style={{ opacity: 0.6, maxWidth: '120px' }} /></div>
              <div className="col"><img src="/assets/images/brands/brand-2.webp" alt="Brand 2" style={{ opacity: 0.6, maxWidth: '120px' }} /></div>
              <div className="col"><img src="/assets/images/brands/brand-3.webp" alt="Brand 3" style={{ opacity: 0.6, maxWidth: '120px' }} /></div>
              <div className="col"><img src="/assets/images/brands/brand-4.webp" alt="Brand 4" style={{ opacity: 0.6, maxWidth: '120px' }} /></div>
              <div className="col"><img src="/assets/images/brands/brand-5.webp" alt="Brand 5" style={{ opacity: 0.6, maxWidth: '120px' }} /></div>
              <div className="col"><img src="/assets/images/brands/brand-6.webp" alt="Brand 6" style={{ opacity: 0.6, maxWidth: '120px' }} /></div>
              <div className="col"><img src="/assets/images/brands/brand-7.webp" alt="Brand 7" style={{ opacity: 0.6, maxWidth: '120px' }} /></div>
              <div className="col"><img src="/assets/images/brands/brand-8.webp" alt="Brand 8" style={{ opacity: 0.6, maxWidth: '120px' }} /></div>
            </div>
          </div>
        );

      default:
        return (
          <div className="container text-center py-5">
            <h3>Invalid Element Showcase Option</h3>
          </div>
        );
    }
  };

  return (
    <div className="elements-showcase-page">
      {/* Page Title Section Start */}
      <div 
        className="page-title-section section" 
        style={{ 
          backgroundImage: 'url("/assets/images/slider/home1/slide-1.webp")',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          padding: '60px 0'
        }}
      >
        <div className="container">
          <div className="page-title">
            <h1 className="title" style={{ fontFamily: 'var(--font-serif)', color: '#111' }}>{getPageTitle()}</h1>
            <ul className="breadcrumb">
              <li className="breadcrumb-item"><a href="/">Home</a></li>
              <li className="breadcrumb-item active">Element</li>
              <li className="breadcrumb-item active">{getPageTitle()}</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Elements Grid Showcase */}
      <div className="section section-padding">
        {renderContent()}
      </div>
    </div>
  );
};
export default ElementsShowcase;
