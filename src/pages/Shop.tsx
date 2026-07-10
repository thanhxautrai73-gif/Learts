import React, { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { getProducts } from '../services/api';
import { ProductCard } from '../components/ProductCard';
import { ProductSkeleton } from '../components/LoadingSpinner';

export const Shop: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [activeFilter, setActiveFilter] = useState<'all' | 'hot' | 'new' | 'sales'>('all');

  // Read URL params
  const categoryIdParam = searchParams.get('category');
  const sortParam = searchParams.get('sort') || '';
  const pageParam = parseInt(searchParams.get('page') || '1');
  const searchParam = searchParams.get('q') || '';
  const limit = 8;

  // Fetch products
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

  const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    const newParams = new URLSearchParams(searchParams);
    if (!value) {
      newParams.delete('sort');
    } else {
      newParams.set('sort', value);
    }
    newParams.set('page', '1');
    setSearchParams(newParams);
  };

  const handlePageChange = (newPage: number) => {
    const newParams = new URLSearchParams(searchParams);
    newParams.set('page', newPage.toString());
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

  // Filter products locally based on toolbar selection
  const getFilteredProducts = () => {
    if (!productsData) return [];
    const prods = productsData.products;
    switch (activeFilter) {
      case 'hot':
        return prods.filter(p => p.price > 20000000); // Premium items
      case 'new':
        return prods.filter(p => p.stockQuantity > 40); // New arrivals
      case 'sales':
        return prods.filter(p => p.id % 3 === 0); // Disocunt/sales items
      case 'all':
      default:
        return prods;
    }
  };

  const filteredProducts = getFilteredProducts();

  return (
    <div className="shop-page-template">
      {/* Page Title Section Start */}
      <div 
        className="page-title-section section" 
        style={{ 
          backgroundImage: 'url("https://images.unsplash.com/photo-1618424181497-157f25b6ddd5?w=1600&auto=format&fit=crop&q=80")',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          padding: '80px 0'
        }}
      >
        <div className="container">
          <div className="row">
            <div className="col">
              <div className="page-title">
                <h1 className="title" style={{ fontFamily: 'var(--font-serif)', color: '#111' }}>Products</h1>
                <ul className="breadcrumb">
                  <li className="breadcrumb-item"><a href="/">Home</a></li>
                  <li className="breadcrumb-item active">Products</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* Page Title Section End */}

      {/* Shop Products Section Start */}
      <div className="section section-padding pt-0">
        {/* Shop Toolbar Start */}
        <div className="shop-toolbar border-bottom mb-5">
          <div className="container">
            <div className="row learts-mb-n20 align-items-center">
              {/* Filter tabs matching index.html shop section exactly */}
              <div className="col-md col-12 align-self-center learts-mb-20">
                <div className="isotope-filter shop-product-filter">
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

              {/* Sorting and search controls */}
              <div className="col-md-auto col-12 learts-mb-20">
                <ul className="shop-toolbar-controls" style={{ listStyle: 'none', margin: 0, padding: 0, display: 'flex', gap: '20px', alignItems: 'center' }}>
                  <li>
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
                  </li>
                  <li>
                    <div className="product-sorting">
                      <select 
                        value={sortParam} 
                        onChange={handleSortChange} 
                        className="form-select"
                        style={{ height: '40px', padding: '0 30px 0 15px', border: '1px solid #ddd', fontSize: '0.85rem', cursor: 'pointer' }}
                      >
                        <option value="">Default sorting</option>
                        <option value="priceAsc">Sort by price: low to high</option>
                        <option value="priceDesc">Sort by price: high to low</option>
                      </select>
                    </div>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
        {/* Shop Toolbar End */}

        <div className="container">
          {isLoading ? (
            <ProductSkeleton count={limit} />
          ) : error ? (
            <div style={{ textAlign: 'center', color: 'var(--color-error)', margin: '40px 0' }}>
              Error fetching products. Make sure your server is running.
            </div>
          ) : !productsData || filteredProducts.length === 0 ? (
            <div className="text-center py-5">
              <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '2rem' }}>No products found</h3>
              <p className="text-muted">Try adjusting filters or searching again.</p>
            </div>
          ) : (
            <>
              {/* Products list grid */}
              <div className="products row row-cols-xl-4 row-cols-lg-3 row-cols-md-2 row-cols-sm-2 row-cols-1 g-4">
                {filteredProducts.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>

              {/* Pagination Panel */}
              {productsData.totalPages > 1 && (
                <div className="row learts-mt-50">
                  <div className="col text-center">
                    <ul className="page-pagination justify-content-center" style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', gap: '8px' }}>
                      <li>
                        <button 
                          onClick={() => handlePageChange(pageParam - 1)}
                          disabled={pageParam === 1}
                          style={{ border: 'none', background: 'none', cursor: pageParam === 1 ? 'not-allowed' : 'pointer' }}
                        >
                          <i className="fa fa-angle-left"></i>
                        </button>
                      </li>
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
                      <li>
                        <button 
                          onClick={() => handlePageChange(pageParam + 1)}
                          disabled={pageParam === productsData.totalPages}
                          style={{ border: 'none', background: 'none', cursor: pageParam === productsData.totalPages ? 'not-allowed' : 'pointer' }}
                        >
                          <i className="fa fa-angle-right"></i>
                        </button>
                      </li>
                    </ul>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>
      {/* Shop Products Section End */}
    </div>
  );
};
export default Shop;
