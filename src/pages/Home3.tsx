import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { getFeaturedProducts } from '../services/api';
import { ProductCard } from '../components/ProductCard';
import { ProductSkeleton } from '../components/LoadingSpinner';

export const Home3: React.FC = () => {
  const { data: featuredProducts, isLoading, error } = useQuery({
    queryKey: ['featuredProducts'],
    queryFn: getFeaturedProducts,
  });

  return (
    <div className="home3-page-template">
      {/* Home 3 Slider (Savvy Delight) */}
      <div className="home2-slider swiper-container" style={{ backgroundColor: '#EEE5DD', height: '550px', display: 'flex', alignItems: 'center', position: 'relative' }}>
        <div className="container">
          <div className="row align-items-center">
            <div className="col-lg-6 col-12">
              <div className="home2-slide-content">
                <h3 className="sub-title" style={{ fontFamily: 'var(--font-serif)', color: 'var(--color-primary)' }}>New Collection</h3>
                <h2 className="title" style={{ fontFamily: 'var(--font-serif)', fontSize: '3rem', margin: '15px 0', color: '#111' }}>Savvy Delight</h2>
                <p style={{ margin: '20px 0', color: '#555' }}>Handcrafted products made with love and care, selected especially for your luxury workspace.</p>
                <div className="link" style={{ marginTop: '20px' }}><Link to="/shop" className="btn btn-dark">Shop Now</Link></div>
              </div>
            </div>
            <div className="col-lg-6 col-12 text-center">
              <img src="/assets/images/slider/home2/slider-1-1.webp" alt="Slide" style={{ maxWidth: '100%', height: 'auto', maxHeight: '420px' }} />
            </div>
          </div>
        </div>
      </div>

      {/* About Us & Categories Grid (from index-3.html) */}
      <div className="section section-padding" style={{ backgroundImage: 'url("/assets/images/bg/home-2.webp")', backgroundSize: 'cover' }}>
        <div className="container">
          <div className="row learts-mb-n30">
            {/* About Us Intro Card */}
            <div className="col-lg-5 col-12 ms-auto align-self-center learts-mb-30">
              <div className="about-us" style={{ padding: '30px', backgroundColor: 'rgba(255, 255, 255, 0.9)' }}>
                <div className="inner">
                  <h2 className="title" style={{ fontFamily: 'var(--font-serif)' }}>Making & crafting</h2>
                  <span className="special-title" style={{ color: 'var(--color-primary)' }}>Handicraft shop</span>
                  <p style={{ marginTop: '15px' }}>Crafting beautiful stuff with our own hands and the help from useful tools is a wonderful process, where you can enjoy yourself while pulling out some ideas and busy perfecting your work.</p>
                  <Link to="/shop" className="link" style={{ fontWeight: 600, display: 'inline-block', marginTop: '15px' }}>Online Store</Link>
                </div>
              </div>
            </div>

            {/* Category Banner 2 Layout */}
            <div className="col-lg-5 col-md-6 col-12 ms-auto learts-mb-30">
              <div className="category-banner2">
                <Link to="/shop?category=4" className="inner">
                  <div className="image"><img src="/assets/images/banner/category/banner-s2-1.webp" alt="Toys" /></div>
                  <div className="content">
                    <h3 className="title">Accessories<span className="number">6 items</span></h3>
                  </div>
                </Link>
                <span className="banner-desc right">NEW COLLECTION</span>
              </div>
            </div>

            <div className="col-lg-5 col-md-6 col-12 learts-mb-30">
              <div className="category-banner2">
                <Link to="/shop?category=1" className="inner">
                  <div className="image"><img src="/assets/images/banner/category/banner-s2-2.webp" alt="Kniting" /></div>
                  <div className="content">
                    <h3 className="title">Smartphones<span className="number">4 items</span></h3>
                  </div>
                </Link>
                <span className="banner-desc right">SALE UP TO 40%</span>
              </div>
            </div>

            <div className="col-lg-5 col-md-6 col-12 ms-auto learts-mb-30">
              <div className="category-banner2">
                <Link to="/shop?category=5" className="inner">
                  <div className="image"><img src="/assets/images/banner/category/banner-s2-3.webp" alt="Gifts" /></div>
                  <div className="content">
                    <h3 className="title">Audio<span className="number">16 items</span></h3>
                  </div>
                </Link>
                <span className="banner-desc right">BEST SELLERS</span>
              </div>
            </div>

            <div className="col-lg-5 col-md-6 col-12 ms-auto learts-mb-30">
              <div className="category-banner2">
                <Link to="/shop?category=2" className="inner">
                  <div className="image"><img src="/assets/images/banner/category/banner-s2-4.webp" alt="Decor" /></div>
                  <div className="content">
                    <h3 className="title">Laptops<span className="number">16 items</span></h3>
                  </div>
                </Link>
                <span className="banner-desc left">BEST SELLERS</span>
              </div>
            </div>

            {/* Sale Banner 3 */}
            <div className="d-flex align-items-center col-lg-5 col-12 ms-auto learts-mb-30">
              <div className="sale-banner3" style={{ padding: '30px', border: '1px solid #ddd', width: '100%', backgroundColor: '#fff' }}>
                <span className="special-title" style={{ color: 'var(--color-primary)' }}>Spring sale</span>
                <h2 className="title" style={{ fontFamily: 'var(--font-serif)', margin: '10px 0' }}>Sale up to 10% all</h2>
                <Link to="/shop" className="link" style={{ fontWeight: 600 }}>ONLINE STORE</Link>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Featured Products Grid */}
      <div className="section section-padding pt-0">
        <div className="container">
          <div className="section-title text-center" style={{ marginTop: '50px' }}>
            <h3 className="sub-title" style={{ fontFamily: 'var(--font-serif)' }}>Shop now</h3>
            <h2 className="title title-icon-both" style={{ fontFamily: 'var(--font-serif)' }}>Featured Selection</h2>
          </div>

          {isLoading ? (
            <ProductSkeleton count={8} />
          ) : error ? (
            <div style={{ textAlign: 'center', color: 'var(--color-error)' }}>
              Error loading products. Make sure your server is running.
            </div>
          ) : (
            <div className="products row row-cols-xl-4 row-cols-lg-3 row-cols-md-2 row-cols-sm-2 row-cols-1 g-4">
              {featuredProducts?.slice(0, 8).map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
export default Home3;
