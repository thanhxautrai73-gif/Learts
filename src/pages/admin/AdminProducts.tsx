import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import { 
  getProducts, 
  getCategories, 
  createProduct, 
  updateProduct, 
  deleteProduct 
} from '../../services/api';
import type { Product, Category } from '../../services/api';

export const AdminProducts: React.FC = () => {
  const navigate = useNavigate();
  
  // Data States
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Pagination States
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const limit = 8;

  // Modal / Form States
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  
  // Form fields
  const [name, setName] = useState('');
  const [categoryId, setCategoryId] = useState<number>(0);
  const [price, setPrice] = useState('');
  const [stockQuantity, setStockQuantity] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [description, setDescription] = useState('');
  const [originalPrice, setOriginalPrice] = useState('');
  const [tag, setTag] = useState('');

  // Fetch Categories & Products
  useEffect(() => {
    fetchCategories();
  }, []);

  useEffect(() => {
    fetchProducts(page);
  }, [page]);

  const fetchCategories = async () => {
    try {
      const data = await getCategories();
      setCategories(data);
      if (data.length > 0) {
        setCategoryId(data[0].id);
      }
    } catch (err: any) {
      toast.error('Failed to load categories.');
    }
  };

  const fetchProducts = async (pageNum: number) => {
    setLoading(true);
    try {
      const response = await getProducts({ page: pageNum, limit });
      setProducts(response.products);
      setTotalPages(response.totalPages);
      setTotalItems(response.totalItems);
    } catch (err: any) {
      toast.error('Failed to load products.');
    } finally {
      setLoading(false);
    }
  };

  const handleOpenAddModal = () => {
    setEditingProduct(null);
    setName('');
    if (categories.length > 0) {
      setCategoryId(categories[0].id);
    }
    setPrice('');
    setStockQuantity('');
    setImageUrl('');
    setDescription('');
    setOriginalPrice('');
    setTag('');
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (product: Product) => {
    setEditingProduct(product);
    setName(product.name);
    setCategoryId(product.categoryId);
    setPrice(product.price.toString());
    setStockQuantity(product.stockQuantity.toString());
    setImageUrl(product.imageUrl);
    setDescription(product.description);
    setOriginalPrice(product.originalPrice ? product.originalPrice.toString() : '');
    setTag(product.tag || '');
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingProduct(null);
  };

  const handleDeleteProduct = async (id: number) => {
    if (!window.confirm('Are you sure you want to delete this product?')) return;

    try {
      await deleteProduct(id);
      toast.success('Product deleted successfully.');
      fetchProducts(page); // Reload list
    } catch (err: any) {
      const errMsg = err.response?.data?.message || 'Failed to delete product.';
      toast.error(errMsg);
    }
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Field validations
    if (!name.trim() || !price || !stockQuantity || !imageUrl.trim() || !description.trim() || !categoryId) {
      toast.error('Please fill in all required fields.');
      return;
    }

    const productPayload = {
      categoryId,
      name,
      price: parseFloat(price),
      stockQuantity: parseInt(stockQuantity),
      imageUrl,
      description,
      originalPrice: originalPrice ? parseFloat(originalPrice) : undefined,
      tag: tag || undefined
    };

    try {
      if (editingProduct) {
        // Edit Product
        await updateProduct(editingProduct.id, productPayload);
        toast.success('Product updated successfully.');
      } else {
        // Add Product
        await createProduct(productPayload);
        toast.success('Product created successfully.');
      }
      handleCloseModal();
      fetchProducts(page);
    } catch (err: any) {
      const errMsg = err.response?.data?.message || 'Failed to save product.';
      toast.error(errMsg);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('admin_token');
    localStorage.removeItem('admin_user');
    toast.success('Logged out successfully.');
    navigate('/admin/login');
  };

  const getCategoryName = (catId: number) => {
    const category = categories.find(c => c.id === catId);
    return category ? category.name : 'Unknown';
  };

  return (
    <div className="admin-dashboard" style={{ backgroundColor: 'var(--color-light-bg)', minHeight: '100vh' }}>
      {/* Admin Navigation Bar */}
      <nav style={{
        backgroundColor: '#ffffff',
        borderBottom: '1px solid var(--color-border)',
        padding: '15px 40px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        position: 'sticky',
        top: 0,
        zIndex: 10
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '30px' }}>
          <h1 style={{ 
            fontFamily: 'var(--font-serif)', 
            fontSize: '1.6rem', 
            margin: 0, 
            letterSpacing: '0.05em',
            fontWeight: 600
          }}>
            Learts <span style={{ color: 'var(--color-primary)', fontSize: '1rem', verticalAlign: 'middle' }}>ADMIN</span>
          </h1>
          <div style={{ display: 'flex', gap: '20px', marginLeft: '20px' }}>
            <Link to="/admin/products" style={{ 
              fontWeight: 600, 
              color: 'var(--color-dark)',
              borderBottom: '2px solid var(--color-dark)',
              paddingBottom: '5px',
              fontSize: '0.95rem'
            }}>Products</Link>
            <Link to="/admin/orders" style={{ 
              fontWeight: 500, 
              color: 'var(--color-muted)',
              paddingBottom: '5px',
              fontSize: '0.95rem'
            }}>Orders</Link>
          </div>
        </div>
        <div>
          <button 
            onClick={handleLogout}
            style={{
              padding: '8px 18px',
              backgroundColor: 'transparent',
              border: '1px solid var(--color-border)',
              color: 'var(--color-dark)',
              cursor: 'pointer',
              fontSize: '0.85rem',
              fontWeight: 500,
              textTransform: 'uppercase',
              letterSpacing: '0.05em',
              transition: 'var(--transition-fast)'
            }}
          >
            Log Out
          </button>
        </div>
      </nav>

      {/* Main Content Area */}
      <div className="container" style={{ padding: '40px 24px' }}>
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '30px'
        }}>
          <div>
            <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '2rem', color: 'var(--color-dark)' }}>Products Management</h2>
            <p style={{ color: 'var(--color-muted)', fontSize: '0.9rem', marginTop: '5px' }}>
              Manage products catalog, updates stock values, and pricing. (Total: {totalItems})
            </p>
          </div>
          <button 
            onClick={handleOpenAddModal}
            style={{
              padding: '12px 24px',
              backgroundColor: 'var(--color-dark)',
              color: '#ffffff',
              border: 'none',
              cursor: 'pointer',
              fontWeight: 600,
              fontSize: '0.85rem',
              textTransform: 'uppercase',
              letterSpacing: '0.05em',
              transition: 'var(--transition-fast)'
            }}
          >
            Add New Product
          </button>
        </div>

        {/* Products Table */}
        {loading ? (
          <div style={{ display: 'flex', justifyContent: 'center', padding: '60px' }}>
            <p style={{ color: 'var(--color-muted)' }}>Loading products database...</p>
          </div>
        ) : products.length === 0 ? (
          <div style={{
            backgroundColor: '#ffffff',
            border: '1px solid var(--color-border)',
            padding: '60px',
            textAlign: 'center'
          }}>
            <p style={{ color: 'var(--color-muted)', marginBottom: '15px' }}>No products found in the catalog.</p>
            <button onClick={handleOpenAddModal} style={{ color: 'var(--color-primary)', fontWeight: 600 }}>Create First Product</button>
          </div>
        ) : (
          <div style={{ backgroundColor: '#ffffff', border: '1px solid var(--color-border)', overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', minWidth: '800px' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid var(--color-border)', backgroundColor: 'var(--color-cream)' }}>
                  <th style={{ padding: '15px 20px', fontWeight: 600, fontSize: '0.85rem', textTransform: 'uppercase', color: 'var(--color-dark)' }}>ID</th>
                  <th style={{ padding: '15px 20px', fontWeight: 600, fontSize: '0.85rem', textTransform: 'uppercase', color: 'var(--color-dark)' }}>Image</th>
                  <th style={{ padding: '15px 20px', fontWeight: 600, fontSize: '0.85rem', textTransform: 'uppercase', color: 'var(--color-dark)' }}>Name</th>
                  <th style={{ padding: '15px 20px', fontWeight: 600, fontSize: '0.85rem', textTransform: 'uppercase', color: 'var(--color-dark)' }}>Category</th>
                  <th style={{ padding: '15px 20px', fontWeight: 600, fontSize: '0.85rem', textTransform: 'uppercase', color: 'var(--color-dark)' }}>Price</th>
                  <th style={{ padding: '15px 20px', fontWeight: 600, fontSize: '0.85rem', textTransform: 'uppercase', color: 'var(--color-dark)' }}>Stock</th>
                  <th style={{ padding: '15px 20px', fontWeight: 600, fontSize: '0.85rem', textTransform: 'uppercase', color: 'var(--color-dark)' }}>Tag</th>
                  <th style={{ padding: '15px 20px', fontWeight: 600, fontSize: '0.85rem', textTransform: 'uppercase', color: 'var(--color-dark)', textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {products.map((product) => (
                  <tr key={product.id} style={{ borderBottom: '1px solid var(--color-border)', transition: 'var(--transition-fast)' }} className="table-row-hover">
                    <td style={{ padding: '15px 20px', fontSize: '0.9rem', color: 'var(--color-muted)' }}>#{product.id}</td>
                    <td style={{ padding: '10px 20px' }}>
                      <img 
                        src={product.imageUrl} 
                        alt={product.name} 
                        style={{ width: '50px', height: '50px', objectFit: 'cover', border: '1px solid var(--color-border)' }} 
                        onError={(e) => { (e.target as HTMLImageElement).src = 'https://placehold.co/50x50?text=No+Image'; }}
                      />
                    </td>
                    <td style={{ padding: '15px 20px', fontWeight: 500, fontSize: '0.95rem', color: 'var(--color-dark)' }}>{product.name}</td>
                    <td style={{ padding: '15px 20px', fontSize: '0.9rem' }}>{getCategoryName(product.categoryId)}</td>
                    <td style={{ padding: '15px 20px', fontWeight: 600, fontSize: '0.95rem' }}>
                      ${product.price.toFixed(2)}
                      {product.originalPrice && (
                        <span style={{ fontSize: '0.8rem', textDecoration: 'line-through', color: 'var(--color-muted)', marginLeft: '6px' }}>
                          ${product.originalPrice.toFixed(2)}
                        </span>
                      )}
                    </td>
                    <td style={{ padding: '15px 20px', fontSize: '0.9rem' }}>
                      <span style={{
                        padding: '3px 8px',
                        backgroundColor: product.stockQuantity > 10 ? 'rgba(95, 141, 78, 0.1)' : 'rgba(192, 57, 43, 0.1)',
                        color: product.stockQuantity > 10 ? 'var(--color-success)' : 'var(--color-error)',
                        fontWeight: 600,
                        fontSize: '0.8rem'
                      }}>
                        {product.stockQuantity} in stock
                      </span>
                    </td>
                    <td style={{ padding: '15px 20px', fontSize: '0.85rem', color: 'var(--color-primary)', fontWeight: 600 }}>
                      {product.tag ? product.tag.toUpperCase() : '-'}
                    </td>
                    <td style={{ padding: '15px 20px', textAlign: 'right' }}>
                      <button 
                        onClick={() => handleOpenEditModal(product)}
                        style={{ 
                          marginRight: '12px', 
                          color: 'var(--color-primary)', 
                          background: 'none', 
                          border: 'none', 
                          cursor: 'pointer',
                          fontWeight: 600,
                          fontSize: '0.85rem'
                        }}
                      >
                        Edit
                      </button>
                      <button 
                        onClick={() => handleDeleteProduct(product.id)}
                        style={{ 
                          color: 'var(--color-error)', 
                          background: 'none', 
                          border: 'none', 
                          cursor: 'pointer',
                          fontWeight: 600,
                          fontSize: '0.85rem'
                        }}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination Section */}
        {totalPages > 1 && (
          <div style={{ display: 'flex', justifyContent: 'center', gap: '10px', marginTop: '30px' }}>
            <button
              onClick={() => setPage(p => Math.max(p - 1, 1))}
              disabled={page === 1}
              style={{
                padding: '8px 15px',
                border: '1px solid var(--color-border)',
                backgroundColor: page === 1 ? '#eee' : '#fff',
                cursor: page === 1 ? 'not-allowed' : 'pointer'
              }}
            >
              Prev
            </button>
            <span style={{ alignSelf: 'center', fontSize: '0.9rem', color: 'var(--color-muted)' }}>
              Page {page} of {totalPages}
            </span>
            <button
              onClick={() => setPage(p => Math.min(p + 1, totalPages))}
              disabled={page === totalPages}
              style={{
                padding: '8px 15px',
                border: '1px solid var(--color-border)',
                backgroundColor: page === totalPages ? '#eee' : '#fff',
                cursor: page === totalPages ? 'not-allowed' : 'pointer'
              }}
            >
              Next
            </button>
          </div>
        )}
      </div>

      {/* Add / Edit Product Modal */}
      {isModalOpen && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          backgroundColor: 'rgba(31, 31, 31, 0.4)',
          backdropFilter: 'blur(4px)',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          zIndex: 100,
          padding: '20px'
        }}>
          <div style={{
            backgroundColor: '#ffffff',
            border: '1px solid var(--color-border)',
            width: '100%',
            maxWidth: '650px',
            maxHeight: '90vh',
            overflowY: 'auto',
            padding: '40px',
            boxShadow: 'var(--shadow-lg)'
          }}>
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '30px',
              borderBottom: '1px solid var(--color-border)',
              paddingBottom: '15px'
            }}>
              <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.6rem', color: 'var(--color-dark)' }}>
                {editingProduct ? `Edit Product #${editingProduct.id}` : 'Add New Product'}
              </h3>
              <button 
                onClick={handleCloseModal}
                style={{
                  background: 'none',
                  border: 'none',
                  fontSize: '1.5rem',
                  cursor: 'pointer',
                  color: 'var(--color-muted)'
                }}
              >
                &times;
              </button>
            </div>

            <form onSubmit={handleFormSubmit}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '20px' }}>
                <div>
                  <label className="form-label" style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, textTransform: 'uppercase', marginBottom: '6px' }}>Product Name *</label>
                  <input 
                    type="text" 
                    value={name} 
                    onChange={e => setName(e.target.value)} 
                    style={{ width: '100%', padding: '10px', border: '1px solid var(--color-border)' }}
                    required 
                  />
                </div>
                <div>
                  <label className="form-label" style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, textTransform: 'uppercase', marginBottom: '6px' }}>Category *</label>
                  <select 
                    value={categoryId} 
                    onChange={e => setCategoryId(parseInt(e.target.value))} 
                    style={{ width: '100%', padding: '10px', border: '1px solid var(--color-border)', backgroundColor: '#fff' }}
                    required
                  >
                    {categories.map(c => (
                      <option key={c.id} value={c.id}>{c.name}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '20px' }}>
                <div>
                  <label className="form-label" style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, textTransform: 'uppercase', marginBottom: '6px' }}>Price ($) *</label>
                  <input 
                    type="number" 
                    step="0.01" 
                    value={price} 
                    onChange={e => setPrice(e.target.value)} 
                    style={{ width: '100%', padding: '10px', border: '1px solid var(--color-border)' }}
                    required 
                  />
                </div>
                <div>
                  <label className="form-label" style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, textTransform: 'uppercase', marginBottom: '6px' }}>Stock Quantity *</label>
                  <input 
                    type="number" 
                    value={stockQuantity} 
                    onChange={e => setStockQuantity(e.target.value)} 
                    style={{ width: '100%', padding: '10px', border: '1px solid var(--color-border)' }}
                    required 
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '20px' }}>
                <div>
                  <label className="form-label" style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, textTransform: 'uppercase', marginBottom: '6px' }}>Original Price ($)</label>
                  <input 
                    type="number" 
                    step="0.01" 
                    value={originalPrice} 
                    onChange={e => setOriginalPrice(e.target.value)} 
                    style={{ width: '100%', padding: '10px', border: '1px solid var(--color-border)' }}
                    placeholder="Leave blank if no sale"
                  />
                </div>
                <div>
                  <label className="form-label" style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, textTransform: 'uppercase', marginBottom: '6px' }}>Tag (e.g. sale, hot)</label>
                  <input 
                    type="text" 
                    value={tag} 
                    onChange={e => setTag(e.target.value)} 
                    style={{ width: '100%', padding: '10px', border: '1px solid var(--color-border)' }}
                    placeholder="e.g. hot, sale"
                  />
                </div>
              </div>

              <div style={{ marginBottom: '20px' }}>
                <label className="form-label" style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, textTransform: 'uppercase', marginBottom: '6px' }}>Image URL *</label>
                <input 
                  type="text" 
                  value={imageUrl} 
                  onChange={e => setImageUrl(e.target.value)} 
                  style={{ width: '100%', padding: '10px', border: '1px solid var(--color-border)' }}
                  placeholder="/assets/images/product/s328/product-X.webp"
                  required 
                />
              </div>

              <div style={{ marginBottom: '30px' }}>
                <label className="form-label" style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, textTransform: 'uppercase', marginBottom: '6px' }}>Description *</label>
                <textarea 
                  value={description} 
                  onChange={e => setDescription(e.target.value)} 
                  rows={4}
                  style={{ width: '100%', padding: '10px', border: '1px solid var(--color-border)', fontFamily: 'var(--font-sans)', resize: 'vertical' }}
                  required 
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '15px' }}>
                <button 
                  type="button" 
                  onClick={handleCloseModal}
                  style={{
                    padding: '10px 20px',
                    border: '1px solid var(--color-border)',
                    backgroundColor: 'transparent',
                    cursor: 'pointer',
                    fontSize: '0.85rem',
                    textTransform: 'uppercase',
                    letterSpacing: '0.05em'
                  }}
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  style={{
                    padding: '10px 25px',
                    border: 'none',
                    backgroundColor: 'var(--color-dark)',
                    color: '#fff',
                    cursor: 'pointer',
                    fontSize: '0.85rem',
                    fontWeight: 600,
                    textTransform: 'uppercase',
                    letterSpacing: '0.05em'
                  }}
                >
                  {editingProduct ? 'Save Changes' : 'Create Product'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminProducts;
