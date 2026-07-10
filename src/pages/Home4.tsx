import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { getFeaturedProducts } from '../services/api';
import { ProductCard } from '../components/ProductCard';
import { ProductSkeleton } from '../components/LoadingSpinner';

export const Home4: React.FC = () => {
  const { data: featuredProducts, isLoading, error } = useQuery({
    queryKey: ['featuredProducts'],
    queryFn: getFeaturedProducts,
  });

  return (
    <div className="home4-page-template">
      {/* Home 4 Slider (Perfect Escapes) */}
      <div className="home3-slider swiper-container" style={{ backgroundImage: 'url("/assets/images/slider/home1/slide-3.webp")', backgroundSize: 'cover', backgroundPosition: 'center', height: '550px', display: 'flex', alignItems: 'center' }}>
        <div className="container">
          <div className="home3-slide-item">
            <h2 className="title" style={{ fontFamily: 'var(--font-serif)', fontSize: '3.5rem', color: '#111' }}>Affectious gifts</h2>
            <h3 className="sub-title" style={{ fontFamily: 'var(--font-serif)', color: '#555', margin: '15px 0' }}>For friends & family</h3>
            <div className="link"><Link to="/shop" className="btn btn-dark">shop now</Link></div>
          </div>
        </div>
      </div>

      {/* Blockquote and Category Banners Grid (index-4.html) */}
      <div className="section section-fluid learts-pt-30 bg-white section-padding">
        <div className="container">
          <div className="row learts-mb-n30">
            {/* Blockquote */}
            <div className="col-xxl-6 col-xl-8 col-12 learts-mb-30">
              <div className="learts-blockquote" style={{ padding: '40px', borderLeft: '3px solid var(--color-primary)', backgroundColor: 'var(--color-cream)' }}>
                <div className="inner">
                  <h2 className="title" style={{ fontFamily: 'var(--font-serif)', fontSize: '2rem', lineHeight: '1.4' }}>Learts is an online shop for handicrafts and arts’ works based in the US.</h2>
                  <div className="desc" style={{ marginTop: '15px' }}>
                    <p>Crafting beautiful stuff with our own hands and the help from useful tools is a wonderful process, where you can enjoy yourself while pulling out some ideas and busy perfecting your work. We provide high-end unique vases, wall arts, home accessories, and furniture pieces.</p>
                  </div>
                  <Link to="/about" className="link" style={{ fontWeight: 600, display: 'inline-block', marginTop: '15px' }}>ABOUT US</Link>
                </div>
              </div>
            </div>

            {/* Sale Banner 3-1 */}
            <div className="col-xxl-3 col-xl-4 col-md-6 col-12 learts-mb-30">
              <div className="sale-banner3-1" style={{ border: '1px solid #eee', padding: '20px', height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'center', backgroundColor: '#fff' }}>
                <div className="content">
                  <span className="special-title" style={{ color: 'var(--color-primary)' }}>Spring sale</span>
                  <h2 className="title" style={{ fontFamily: 'var(--font-serif)', margin: '10px 0' }}>Sale up to 10% all</h2>
                  <Link to="/shop" className="link" style={{ fontWeight: 600 }}>SHOP NOW</Link>
                </div>
              </div>
            </div>

            {/* Category Banner 3 */}
            <div className="col-xxl-3 col-xl-4 col-md-6 col-12 learts-mb-30">
              <div className="category-banner3">
                <Link to="/shop?category=2" className="inner">
                  <div className="image"><img src="/assets/images/banner/category/banner-s2-7.webp" alt="Laptops" /></div>
                  <div className="content">
                    <h3 className="title">Laptops<span className="number">16 items</span></h3>
                  </div>
                </Link>
              </div>
            </div>

            <div className="col-xxl-3 col-xl-4 col-md-6 col-12 learts-mb-30">
              <div className="category-banner3">
                <Link to="/shop?category=4" className="inner">
                  <div className="image"><img src="/assets/images/banner/category/banner-s2-8.webp" alt="Accessories" /></div>
                  <div className="content">
                    <h3 className="title">Accessories<span className="number">16 items</span></h3>
                  </div>
                </Link>
              </div>
            </div>

            {/* Instagram Banner */}
            <div className="col-xxl-3 col-xl-4 col-md-6 col-12 order-xxl-6 learts-mb-30">
              <div className="instagram-banner1" style={{ border: '1px solid #eee', padding: '20px', backgroundColor: '#fff' }}>
                <div className="inner">
                  <span className="sub-title" style={{ color: '#999', fontSize: '0.8rem' }}>Follow us on instagram</span>
                  <h3 className="title" style={{ fontFamily: 'var(--font-serif)', marginTop: '8px' }}>
                    <a href="https://instagram.com" target="_blank" rel="noopener noreferrer">@learts_store</a>
                  </h3>
                </div>
              </div>
            </div>

            <div className="col-xxl-6 col-xl-8 col-12 learts-mb-30">
              <div className="category-banner3">
                <Link to="/shop?category=3" className="inner">
                  <div className="image"><img src="/assets/images/banner/category/banner-s2-9.webp" alt="Tablets" style={{ width: '100%', height: '240px', objectFit: 'cover' }} /></div>
                  <div className="content">
                    <h3 className="title">Tablets<span className="number">6 items</span></h3>
                  </div>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Featured Products */}
      <div className="section section-fluid section-padding bg-white pt-0">
        <div className="container">
          <div className="section-title text-center">
            <h3 className="sub-title" style={{ fontFamily: 'var(--font-serif)' }}>Shop now</h3>
            <h2 className="title title-icon-both" style={{ fontFamily: 'var(--font-serif)' }}>New Arrivals</h2>
          </div>

          {isLoading ? (
            <ProductSkeleton count={8} />
          ) : error ? (
            <div style={{ textAlign: 'center', color: 'var(--color-error)' }}>
              Error loading products. Make sure your server is running.
            </div>
          ) : (
            <div className="products row row-cols-xl-4 row-cols-lg-3 row-cols-md-2 row-cols-sm-2 row-cols-1 g-4">
              {featuredProducts?.slice(4, 12).map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
export default Home4;
