import React, { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { getProducts } from '../services/api';
import { ProductCard } from '../components/ProductCard';
import { ProductSkeleton } from '../components/LoadingSpinner';

export const ShopFullwidth: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [activeFilter, setActiveFilter] = useState<'all' | 'hot' | 'new' | 'sales'>('all');

  const categoryIdParam = searchParams.get('category');
  const sortParam = searchParams.get('sort') || '';
  const pageParam = parseInt(searchParams.get('page') || '1');
  const searchParam = searchParams.get('q') || '';
  const limit = 10; // 5 columns, 10 per page is perfect

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

  return (
    <div className="shop-page-template">
      {/* Page Title */}
      <div 
        className="page-title-section section" 
        style={{ 
          backgroundImage: 'url("/assets/images/slider/home1/slide-1.webp")',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          padding: '60px 0'
        }}
      >
        <div className="container-fluid" style={{ padding: '0 30px' }}>
          <div className="page-title">
            <h1 className="title" style={{ fontFamily: 'var(--font-serif)', color: '#111' }}>Shop Fullwidth</h1>
            <ul className="breadcrumb">
              <li className="breadcrumb-item"><a href="/">Home</a></li>
              <li className="breadcrumb-item active">Shop Fullwidth</li>
            </ul>
          </div>
        </div>
      </div>

      <div className="section section-padding">
        {/* Category list bar */}
        <div className="container-fluid" style={{ padding: '0 30px', marginBottom: '30px' }}>
          <div className="row align-items-center justify-content-between">
            <div className="col-auto">
              <div className="isotope-filter shop-product-filter" style={{ margin: 0 }}>
                <button 
                  className={activeFilter === 'all' ? 'active' : ''}
                  onClick={() => setActiveFilter('all')}
                >
                  All
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
            <div className="col-auto">
              <form onSubmit={handleSearchSubmit} style={{ display: 'flex', gap: '8px' }}>
                <input 
                  type="text" 
                  name="search"
                  defaultValue={searchParam}
                  placeholder="Search..." 
                  style={{ height: '40px', padding: '0 12px', border: '1px solid #ddd', fontSize: '0.85rem' }}
                />
                <button type="submit" className="btn btn-dark btn-xs" style={{ height: '40px', padding: '0 15px' }}>
                  <i className="fas fa-search"></i>
                </button>
              </form>
            </div>
          </div>
        </div>

        <div className="container-fluid" style={{ padding: '0 30px' }}>
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
              {/* Products 5 Columns Grid */}
              <div className="products row row-cols-xl-5 row-cols-lg-4 row-cols-md-3 row-cols-sm-2 row-cols-1 g-4">
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
  );
};
export default ShopFullwidth;
