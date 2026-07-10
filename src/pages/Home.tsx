import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { useNavigate, Link } from 'react-router-dom';
import { getCategories, getFeaturedProducts } from '../services/api';
import { HeroBanner } from '../components/HeroBanner';
import { ProductCard } from '../components/ProductCard';
import { ProductSkeleton } from '../components/LoadingSpinner';

export const Home: React.FC = () => {
  const navigate = useNavigate();

  // Fetch categories
  const { data: categories } = useQuery({
    queryKey: ['categories'],
    queryFn: getCategories,
  });

  // Fetch featured products
  const { data: featuredProducts, isLoading: isProductsLoading, error } = useQuery({
    queryKey: ['featuredProducts'],
    queryFn: getFeaturedProducts,
  });

  const handleCategoryClick = (categoryId: number) => {
    navigate(`/shop?category=${categoryId}`);
  };

  // Map category to premium demo images
  const getCategoryImage = (id: number) => {
    switch (id) {
      case 1: return '/assets/images/banner/category/banner-s1-1.webp'; // Smartphones
      case 2: return '/assets/images/banner/category/banner-s1-2.webp'; // Laptops
      case 3: return '/assets/images/banner/category/banner-s1-3.webp'; // Tablets
      case 4: return '/assets/images/banner/category/banner-s1-4.webp'; // Accessories
      case 5: return '/assets/images/banner/category/banner-s1-5.webp'; // Audio
      default: return '';
    }
  };

  return (
    <div className="home-page-template">
      {/* 1. Hero Banner Slider */}
      <HeroBanner />

      {/* 2. Sale Banner Section (Making & Crafting) */}
      <div className="section section-padding">
        <div className="container">
          <div className="section-title text-center">
            <h3 className="sub-title" style={{ fontFamily: 'var(--font-serif)' }}>Just for you</h3>
            <h2 className="title title-icon-both" style={{ fontFamily: 'var(--font-serif)' }}>Making & crafting</h2>
          </div>

          <div className="row learts-mb-n40">
            <div className="col-lg-5 col-md-6 col-12 me-auto learts-mb-40">
              <div 
                className="sale-banner1" 
                style={{ 
                  backgroundImage: 'url("/assets/images/banner/sale/sale-banner1-1.webp")',
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                  height: '400px'
                }}
              >
                <div className="inner">
                  <span className="title" style={{ color: '#111' }}>Spring sale</span>
                  <h2 className="sale-percent" style={{ color: 'var(--color-primary)' }}>
                    <span className="number">40</span> % <br /> off
                  </h2>
                  <Link to="/shop" className="link">shop now</Link>
                </div>
              </div>
            </div>

            <div className="col-lg-6 col-md-6 col-12 learts-mb-40">
              <div className="sale-banner2" style={{ height: '400px', display: 'flex', alignItems: 'center' }}>
                <div className="inner" style={{ display: 'flex', width: '100%', gap: '20px' }}>
                  <div className="image" style={{ width: '50%' }}>
                    <img 
                      src="/assets/images/banner/sale/sale-banner2-1.webp" 
                      alt="Sale" 
                      style={{ width: '100%', height: '320px', objectFit: 'cover' }}
                    />
                  </div>
                  <div className="content" style={{ width: '50%', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                    <h2 className="sale-percent" style={{ fontSize: '2.5rem', margin: 0 }}>10% off</h2>
                    <span className="text" style={{ letterSpacing: '0.1em', display: 'block', margin: '10px 0' }}>YOUR NEXT PURCHASE</span>
                    <Link className="btn btn-hover-dark" to="/shop" style={{ alignSelf: 'flex-start', marginTop: '16px' }}>SHOP NOW</Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 3. Category Banner Section */}
      <div className="section section-fluid section-padding pt-0">
        <div className="container">
          <div className="row row-cols-xl-5 row-cols-lg-3 row-cols-md-2 row-cols-1 g-4">
            {categories?.map((cat) => (
              <div className="col" key={cat.id}>
                <div className="category-banner1" onClick={() => handleCategoryClick(cat.id)} style={{ cursor: 'pointer' }}>
                  <div className="inner">
                    <div className="image">
                      <img 
                        src={getCategoryImage(cat.id)} 
                        alt={cat.name} 
                        style={{ width: '100%', height: '220px', objectFit: 'cover' }} 
                      />
                    </div>
                    <div className="content">
                      <h3 className="title">
                        <span>{cat.name}</span>
                        <span className="number">5</span>
                      </h3>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 4. Product Section (Shop our best-sellers) */}
      <div className="section section-fluid section-padding pt-0">
        <div className="container">
          <div className="section-title text-center">
            <h3 className="sub-title" style={{ fontFamily: 'var(--font-serif)' }}>Shop now</h3>
            <h2 className="title title-icon-both" style={{ fontFamily: 'var(--font-serif)' }}>Shop our best-sellers</h2>
          </div>

          {isProductsLoading ? (
            <ProductSkeleton count={8} />
          ) : error ? (
            <div style={{ textAlign: 'center', color: 'var(--color-error)', margin: '40px 0' }}>
              Error loading products. Make sure your server is running.
            </div>
          ) : (
            <div className="products row row-cols-xl-4 row-cols-lg-3 row-cols-md-2 row-cols-sm-2 row-cols-1 g-4">
              {featuredProducts?.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
export default Home;
