import React, { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { getProducts, getCategories } from '../services/api';
import { ProductCard } from '../components/ProductCard';
import { ProductSkeleton } from '../components/LoadingSpinner';

export const ShopLeftSidebar: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [activeFilter, setActiveFilter] = useState<'all' | 'hot' | 'new' | 'sales'>('all');

  const categoryIdParam = searchParams.get('category');
  const sortParam = searchParams.get('sort') || '';
  const pageParam = parseInt(searchParams.get('page') || '1');
  const searchParam = searchParams.get('q') || '';
  const limit = 6; // 3 columns, 6 per page is perfect

  const { data: categories } = useQuery({
    queryKey: ['categories'],
    queryFn: getCategories,
  });

  const { data: productsData, isLoading, error } = useQuery({
    queryKey: ['products', categoryIdParam, sortParam, pageParam, searchParam],
    queryFn: () => getProducts({
      categoryId: categoryIdParam ? parseInt(categoryIdParam) : undefined,
      sort: sortParam || undefined,
      page: pageParam,
      limit,
      q: searchParam || undefined
    }),
  });

  const handleCategorySelect = (id: number | null) => {
    const newParams = new URLSearchParams(searchParams);
    if (id === null) {
      newParams.delete('category');
    } else {
      newParams.set('category', id.toString());
    }
    newParams.set('page', '1');
    setSearchParams(newParams);
  };

  const handleSearchSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const query = formData.get('search')?.toString().trim() || '';
    const newParams = new URLSearchParams(searchParams);
    if (!query) {
      newParams.delete('q');
    } else {
      newParams.set('q', query);
    }
    newParams.set('page', '1');
    setSearchParams(newParams);
  };

  const handlePageChange = (newPage: number) => {
    const newParams = new URLSearchParams(searchParams);
    newParams.set('page', newPage.toString());
    setSearchParams(newParams);
  };

  // Filter products locally based on toolbar selection
  const getFilteredProducts = () => {
    if (!productsData) return [];
    const prods = productsData.products;
    switch (activeFilter) {
      case 'hot':
        return prods.filter(p => p.price > 20000000);
      case 'new':
        return prods.filter(p => p.stockQuantity > 40);
      case 'sales':
        return prods.filter(p => p.id % 3 === 0);
      case 'all':
      default:
        return prods;
    }
  };

  const filteredProducts = getFilteredProducts();

  return (
    <div className="shop-page-template">
      {/* Page Title */}
      <div 
        className="page-title-section section" 
        style={{ 
          backgroundImage: 'url("/assets/images/slider/home1/slide-2.webp")',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          padding: '60px 0'
        }}
      >
        <div className="container">
          <div className="page-title">
            <h1 className="title" style={{ fontFamily: 'var(--font-serif)', color: '#111' }}>Shop Left Sidebar</h1>
            <ul className="breadcrumb">
              <li className="breadcrumb-item"><a href="/">Home</a></li>
              <li className="breadcrumb-item active">Shop Left Sidebar</li>
            </ul>
          </div>
        </div>
      </div>

      <div className="section section-padding">
        {/* Shop Toolbar Start */}
        <div className="shop-toolbar border-bottom mb-5">
          <div className="container">
            <div className="row learts-mb-n20 align-items-center">
              <div className="col-md col-12 align-self-center learts-mb-20">
                <div className="isotope-filter shop-product-filter" style={{ margin: 0 }}>
                  <button 
                    className={activeFilter === 'all' ? 'active' : ''}
                    onClick={() => setActiveFilter('all')}
                  >
                    all
                  </button>
                  <button 
                    className={activeFilter === 'hot' ? 'active' : ''}
                    onClick={() => setActiveFilter('hot')}
                  >
                    Hot Products
                  </button>
                  <button 
                    className={activeFilter === 'new' ? 'active' : ''}
                    onClick={() => setActiveFilter('new')}
                  >
                    New Products
                  </button>
                  <button 
                    className={activeFilter === 'sales' ? 'active' : ''}
                    onClick={() => setActiveFilter('sales')}
                  >
                    Sales Products
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
        {/* Shop Toolbar End */}

        <div className="container">
          <div className="row g-4">
            {/* Sidebar Left Column */}
            <div className="col-lg-3 col-12 order-lg-1">
              <div className="widgets" style={{ marginRight: '15px' }}>
                {/* Search Widget */}
                <div className="widget learts-mb-40">
                  <form onSubmit={handleSearchSubmit} className="widget-search">
                    <input 
                      type="text" 
                      name="search"
                      defaultValue={searchParam}
                      placeholder="Search products..." 
                      style={{ width: '100%', height: '45px', padding: '0 15px', border: '1px solid #ddd' }}
                    />
                    <button type="submit" style={{ position: 'absolute', right: '15px', top: '12px', background: 'none', border: 'none' }}>
                      <i className="fas fa-search" style={{ color: '#777' }}></i>
                    </button>
                  </form>
                </div>

                {/* Categories Widget */}
                <div className="widget learts-mb-40">
                  <h3 className="widget-title product-filter-widget-title" style={{ fontWeight: 600, fontSize: '1.2rem', marginBottom: '15px' }}>Product categories</h3>
                  <ul className="widget-list" style={{ listStyle: 'none', padding: 0 }}>
                    <li style={{ padding: '8px 0', borderBottom: '1px solid #f5f5f5' }}>
                      <a 
                        href="#" 
                        onClick={(e) => { e.preventDefault(); handleCategorySelect(null); }}
                        style={{ color: !categoryIdParam ? 'var(--color-primary)' : '#666', fontWeight: !categoryIdParam ? 600 : 400 }}
                      >
                        All Categories
                      </a>
                    </li>
                    {categories?.map((cat) => (
                      <li key={cat.id} style={{ padding: '8px 0', borderBottom: '1px solid #f5f5f5' }}>
                        <a 
                          href="#" 
                          onClick={(e) => { e.preventDefault(); handleCategorySelect(cat.id); }}
                          style={{ color: categoryIdParam === cat.id.toString() ? 'var(--color-primary)' : '#666', fontWeight: categoryIdParam === cat.id.toString() ? 600 : 400 }}
                        >
                          {cat.name}
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>

            {/* Products Column */}
            <div className="col-lg-9 col-12 order-lg-2">
              {isLoading ? (
                <ProductSkeleton count={limit} />
              ) : error ? (
                <div className="text-center py-5 text-danger">Error loading products.</div>
              ) : !productsData || filteredProducts.length === 0 ? (
                <div className="text-center py-5">
                  <h3 style={{ fontFamily: 'var(--font-serif)' }}>No products found</h3>
                </div>
              ) : (
                <>
                  {/* Products Grid */}
                  <div className="products row row-cols-xl-3 row-cols-md-2 row-cols-1 g-4">
                    {filteredProducts.map((product) => (
                      <ProductCard key={product.id} product={product} />
                    ))}
                  </div>

                  {/* Pagination */}
                  {productsData.totalPages > 1 && (
                    <div className="row learts-mt-50">
                      <div className="col text-center">
                        <ul className="page-pagination justify-content-center" style={{ listStyle: 'none', padding: 0, margin: '30px 0', display: 'flex', gap: '8px' }}>
                          {Array.from({ length: productsData.totalPages }).map((_, i) => {
                            const pageNum = i + 1;
                            return (
                              <li key={pageNum}>
                                <button 
                                  className={pageParam === pageNum ? 'active' : ''}
                                  onClick={() => handlePageChange(pageNum)}
                                  style={{ 
                                    border: 'none', 
                                    background: pageParam === pageNum ? 'var(--color-primary)' : 'none', 
                                    color: pageParam === pageNum ? '#fff' : '#111',
                                    width: '40px',
                                    height: '40px',
                                    borderRadius: '50%',
                                    cursor: 'pointer'
                                  }}
                                >
                                  {pageNum}
                                </button>
                              </li>
                            );
                          })}
                        </ul>
                      </div>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default ShopLeftSidebar;
