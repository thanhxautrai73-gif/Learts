import React, { useEffect, useState, useRef } from 'react';
import {
  Plus, Search, Edit2, Trash2, Filter, ChevronDown,
  Package, Tag, DollarSign, Box, X, Check, Image as ImageIcon,
  ChevronLeft, ChevronRight, AlertCircle, RefreshCw
} from 'lucide-react';
import toast from 'react-hot-toast';
import {
  getProducts,
  getCategories,
  createProduct,
  updateProduct,
  deleteProduct,
  Product,
  Category
} from '../../services/api';

const PAGE_SIZE = 10;

const EMPTY_FORM = {
  name: '',
  categoryId: 1,
  price: '',
  originalPrice: '',
  stockQuantity: '',
  imageUrl: '',
  description: '',
  tag: ''
};

export const AdminProducts: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<number | null>(null);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterCategory, setFilterCategory] = useState<number | ''>('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [sortBy, setSortBy] = useState('');
  const searchTimeout = useRef<ReturnType<typeof setTimeout>>();

  const fetchProducts = async (page = 1, q = searchQuery, catId = filterCategory, sort = sortBy) => {
    setLoading(true);
    try {
      const params: any = { page, limit: PAGE_SIZE };
      if (q) params.q = q;
      if (catId) params.categoryId = catId;
      if (sort) params.sort = sort;
      const data = await getProducts(params);
      setProducts(data.products);
      setTotalItems(data.totalItems);
      setTotalPages(data.totalPages);
      setCurrentPage(data.currentPage);
    } catch {
      toast.error('Không thể tải sản phẩm');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getCategories().then(setCategories);
    fetchProducts();
  }, []);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setSearchQuery(val);
    clearTimeout(searchTimeout.current);
    searchTimeout.current = setTimeout(() => {
      setCurrentPage(1);
      fetchProducts(1, val, filterCategory, sortBy);
    }, 400);
  };

  const handleFilterChange = (catId: number | '') => {
    setFilterCategory(catId);
    setCurrentPage(1);
    fetchProducts(1, searchQuery, catId, sortBy);
  };

  const handleSortChange = (sort: string) => {
    setSortBy(sort);
    fetchProducts(currentPage, searchQuery, filterCategory, sort);
  };

  const openAddModal = () => {
    setEditingProduct(null);
    setForm({ ...EMPTY_FORM, categoryId: categories[0]?.id ?? 1 });
    setShowModal(true);
  };

  const openEditModal = (product: Product) => {
    setEditingProduct(product);
    setForm({
      name: product.name,
      categoryId: product.categoryId,
      price: String(product.price),
      originalPrice: product.originalPrice ? String(product.originalPrice) : '',
      stockQuantity: String(product.stockQuantity),
      imageUrl: product.imageUrl,
      description: product.description,
      tag: product.tag || ''
    });
    setShowModal(true);
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const payload: any = {
        name: form.name.trim(),
        categoryId: Number(form.categoryId),
        price: parseFloat(form.price),
        stockQuantity: parseInt(form.stockQuantity),
        imageUrl: form.imageUrl.trim(),
        description: form.description.trim(),
        tag: form.tag.trim() || undefined,
        originalPrice: form.originalPrice ? parseFloat(form.originalPrice) : undefined
      };

      if (editingProduct) {
        await updateProduct(editingProduct.id, payload);
        toast.success('Cập nhật sản phẩm thành công!');
      } else {
        await createProduct(payload);
        toast.success('Thêm sản phẩm thành công!');
      }
      setShowModal(false);
      fetchProducts(currentPage);
    } catch (err: any) {
      toast.error(err?.response?.data?.message || 'Có lỗi xảy ra, thử lại');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: number) => {
    try {
      await deleteProduct(id);
      toast.success('Xóa sản phẩm thành công!');
      setShowDeleteConfirm(null);
      fetchProducts(currentPage);
    } catch {
      toast.error('Xóa thất bại, thử lại');
    }
  };

  const getCategoryName = (catId: number) =>
    categories.find(c => c.id === catId)?.name || '—';

  const inputStyle: React.CSSProperties = {
    width: '100%', padding: '10px 14px',
    border: '1.5px solid #e5e7eb', borderRadius: '10px',
    fontSize: '0.88rem', color: '#1a1a1a', outline: 'none',
    transition: 'border-color 0.2s, box-shadow 0.2s',
    fontFamily: 'var(--font-sans)', background: '#fff'
  };

  const labelStyle: React.CSSProperties = {
    display: 'block', fontSize: '0.75rem', fontWeight: 700,
    textTransform: 'uppercase', letterSpacing: '0.06em',
    color: '#555', marginBottom: '6px'
  };

  return (
    <div style={{ fontFamily: 'var(--font-sans)' }}>
      <style>{`
        @keyframes modalIn {
          from { opacity: 0; transform: scale(0.95) translateY(10px); }
          to { opacity: 1; transform: scale(1) translateY(0); }
        }
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        .product-row { transition: background 0.15s; }
        .product-row:hover { background: rgba(184,144,120,0.04) !important; }
        .action-btn {
          width: 34px; height: 34px; border-radius: 8px;
          border: 1px solid #e5e7eb; background: #fff;
          display: inline-flex; align-items: center; justify-content: center;
          cursor: pointer; transition: all 0.15s;
          color: #666;
        }
        .action-btn:hover { transform: scale(1.05); }
        .action-btn.edit:hover { background: #eff6ff; border-color: #3b82f6; color: #3b82f6; }
        .action-btn.delete:hover { background: #fef2f2; border-color: #ef4444; color: #ef4444; }
        .form-input:focus { border-color: var(--color-primary) !important; box-shadow: 0 0 0 3px rgba(184,144,120,0.12) !important; }
        .pagination-btn {
          width: 34px; height: 34px; border-radius: 8px; border: 1px solid #e5e7eb;
          background: #fff; cursor: pointer; display: inline-flex;
          align-items: center; justify-content: center; font-size: 0.85rem;
          font-weight: 600; transition: all 0.15s; color: #555;
        }
        .pagination-btn:hover { border-color: var(--color-primary); color: var(--color-primary); }
        .pagination-btn.active { background: var(--color-primary); border-color: var(--color-primary); color: #fff; }
        .pagination-btn:disabled { opacity: 0.4; cursor: not-allowed; }
        .filter-btn {
          padding: 9px 16px; border-radius: 8px; border: 1.5px solid #e5e7eb;
          background: #fff; cursor: pointer; font-size: 0.82rem; font-weight: 600;
          color: #555; transition: all 0.15s; display: flex; align-items: center; gap: 6px;
          font-family: var(--font-sans);
        }
        .filter-btn:hover { border-color: var(--color-primary); color: var(--color-primary); }
        .filter-btn.active { background: var(--color-primary); border-color: var(--color-primary); color: #fff; }
      `}</style>

      {/* Page Header */}
      <div style={{ marginBottom: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '12px' }}>
        <div>
          <h1 style={{ fontSize: '1.6rem', fontWeight: 700, color: '#1a1a1a', margin: 0 }}>Quản Lý Sản Phẩm</h1>
          <p style={{ color: '#888', marginTop: '4px', fontSize: '0.88rem' }}>
            ${totalItems} sản phẩm trong danh mục
          </p>
        </div>
        <button onClick={openAddModal} style={{
          display: 'flex', alignItems: 'center', gap: '8px',
          background: 'linear-gradient(135deg, var(--color-primary) 0%, var(--color-primary-dark) 100%)',
          color: '#fff', border: 'none', padding: '11px 20px',
          borderRadius: '10px', fontWeight: 600, fontSize: '0.88rem',
          cursor: 'pointer', boxShadow: '0 4px 14px rgba(184,144,120,0.4)',
          transition: 'all 0.2s', fontFamily: 'var(--font-sans)'
        }}>
          <Plus size={18} /> Thêm Sản Phẩm
        </button>
      </div>

      {/* Toolbar */}
      <div style={{ background: '#fff', borderRadius: '14px', padding: '16px 20px', marginBottom: '20px', boxShadow: '0 2px 10px rgba(0,0,0,0.05)', display: 'flex', flexWrap: 'wrap', gap: '12px', alignItems: 'center' }}>
        {/* Search */}
        <div style={{ position: 'relative', flex: '1', minWidth: '200px', maxWidth: '320px' }}>
          <Search size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#aaa' }} />
          <input
            type="text"
            placeholder="Tìm kiếm sản phẩm..."
            value={searchQuery}
            onChange={handleSearchChange}
            style={{ ...inputStyle, paddingLeft: '38px', width: '100%' }}
            className="form-input"
          />
        </div>

        {/* Category Filter */}
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', alignItems: 'center' }}>
          <Filter size={14} style={{ color: '#aaa' }} />
          <button className={`filter-btn ${filterCategory === '' ? 'active' : ''}`} onClick={() => handleFilterChange('')}>Tất cả</button>
          {categories.map(cat => (
            <button key={cat.id} className={`filter-btn ${filterCategory === cat.id ? 'active' : ''}`} onClick={() => handleFilterChange(cat.id)}>
              {cat.name}
            </button>
          ))}
        </div>

        {/* Sort */}
        <div style={{ marginLeft: 'auto', display: 'flex', gap: '8px' }}>
          <select
            value={sortBy}
            onChange={e => handleSortChange(e.target.value)}
            style={{ ...inputStyle, width: 'auto', paddingRight: '32px', cursor: 'pointer' }}
            className="form-input"
          >
            <option value="">Sắp xếp mặc định</option>
            <option value="price_asc">Giá: Thấp → Cao</option>
            <option value="price_desc">Giá: Cao → Thấp</option>
            <option value="name_asc">Tên A → Z</option>
            <option value="name_desc">Tên Z → A</option>
          </select>
          <button onClick={() => fetchProducts(currentPage)} style={{ ...inputStyle, width: '38px', padding: '0', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }} className="form-input">
            <RefreshCw size={16} color="#888" />
          </button>
        </div>
      </div>

      {/* Products Table */}
      <div style={{ background: '#fff', borderRadius: '14px', boxShadow: '0 2px 10px rgba(0,0,0,0.05)', overflow: 'hidden' }}>
        {loading ? (
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '80px', flexDirection: 'column', gap: '14px' }}>
            <div style={{ width: '40px', height: '40px', border: '3px solid #f3f4f6', borderTop: '3px solid var(--color-primary)', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
            <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
            <p style={{ color: '#aaa', fontSize: '0.88rem' }}>Đang tải sản phẩm...</p>
          </div>
        ) : products.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '80px 20px', color: '#aaa' }}>
            <Package size={48} style={{ marginBottom: '16px', opacity: 0.3 }} />
            <h3 style={{ color: '#ccc', marginBottom: '8px' }}>Không tìm thấy sản phẩm</h3>
            <p style={{ fontSize: '0.88rem' }}>Thử thay đổi bộ lọc hoặc từ khóa tìm kiếm</p>
          </div>
        ) : (
          <>
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: '800px' }}>
                <thead>
                  <tr style={{ background: '#fafafa' }}>
                    {['#', 'Sản Phẩm', 'Danh Mục', 'Giá', 'Tồn Kho', 'Tag', 'Thao Tác'].map((h, i) => (
                      <th key={i} style={{
                        padding: '13px 16px', fontSize: '0.72rem', fontWeight: 700,
                        textTransform: 'uppercase', letterSpacing: '0.07em', color: '#888',
                        borderBottom: '1px solid #f0f0f0', textAlign: i >= 5 ? 'center' : 'left', whiteSpace: 'nowrap'
                      }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {products.map((product) => (
                    <tr key={product.id} className="product-row" style={{ borderBottom: '1px solid #f5f5f5' }}>
                      <td style={{ padding: '14px 16px', color: '#aaa', fontSize: '0.82rem', fontFamily: 'monospace' }}>#${product.id}</td>
                      <td style={{ padding: '14px 16px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                          {product.imageUrl ? (
                            <img src={product.imageUrl} alt={product.name} style={{ width: '48px', height: '48px', borderRadius: '10px', objectFit: 'cover', border: '1px solid #f0f0f0', flexShrink: 0 }} />
                          ) : (
                            <div style={{ width: '48px', height: '48px', borderRadius: '10px', background: '#f5f5f5', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                              <ImageIcon size={20} color="#ccc" />
                            </div>
                          )}
                          <div style={{ minWidth: 0 }}>
                            <div style={{ fontWeight: 600, fontSize: '0.9rem', color: '#1a1a1a', marginBottom: '2px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: '200px' }}>{product.name}</div>
                            <div style={{ fontSize: '0.76rem', color: '#aaa', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: '200px' }}>{product.description}</div>
                          </div>
                        </div>
                      </td>
                      <td style={{ padding: '14px 16px' }}>
                        <span style={{ background: '#f5f5f5', color: '#555', padding: '4px 10px', borderRadius: '6px', fontSize: '0.78rem', fontWeight: 600 }}>
                          {getCategoryName(product.categoryId)}
                        </span>
                      </td>
                      <td style={{ padding: '14px 16px' }}>
                        <div style={{ fontWeight: 700, color: '#1a1a1a', fontSize: '0.9rem' }}>$${product.price.toFixed(2)}</div>
                        {product.originalPrice && (
                          <div style={{ fontSize: '0.76rem', color: '#aaa', textDecoration: 'line-through' }}>$${product.originalPrice.toFixed(2)}</div>
                        )}
                      </td>
                      <td style={{ padding: '14px 16px' }}>
                        <span style={{
                          padding: '4px 10px', borderRadius: '20px', fontSize: '0.78rem', fontWeight: 700,
                          background: product.stockQuantity === 0 ? '#fef2f2' : product.stockQuantity <= 5 ? '#fff7ed' : '#f0fdf4',
                          color: product.stockQuantity === 0 ? '#ef4444' : product.stockQuantity <= 5 ? '#f59e0b' : '#10b981',
                          border: `1px solid ${product.stockQuantity === 0 ? 'rgba(239,68,68,0.2)' : product.stockQuantity <= 5 ? 'rgba(245,158,11,0.2)' : 'rgba(16,185,129,0.2)'}`
                        }}>
                          {product.stockQuantity === 0 ? 'Hết hàng' : `${product.stockQuantity} cái`}
                        </span>
                      </td>
                      <td style={{ padding: '14px 16px', textAlign: 'center' }}>
                        {product.tag ? (
                          <span style={{
                            display: 'inline-flex', alignItems: 'center', gap: '4px',
                            background: 'rgba(184,144,120,0.12)', color: 'var(--color-primary)',
                            padding: '3px 10px', borderRadius: '20px', fontSize: '0.75rem', fontWeight: 600,
                            border: '1px solid rgba(184,144,120,0.3)'
                          }}>
                            <Tag size={10} />{product.tag}
                          </span>
                        ) : <span style={{ color: '#ddd', fontSize: '0.8rem' }}>—</span>}
                      </td>
                      <td style={{ padding: '14px 16px', textAlign: 'center' }}>
                        <div style={{ display: 'flex', gap: '8px', justifyContent: 'center' }}>
                          <button className="action-btn edit" onClick={() => openEditModal(product)} title="Chỉnh sửa">
                            <Edit2 size={15} />
                          </button>
                          <button className="action-btn delete" onClick={() => setShowDeleteConfirm(product.id)} title="Xóa">
                            <Trash2 size={15} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            <div style={{ padding: '16px 20px', borderTop: '1px solid #f0f0f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
              <span style={{ fontSize: '0.82rem', color: '#888' }}>
                Hiển thị ${(currentPage - 1) * PAGE_SIZE + 1}–${Math.min(currentPage * PAGE_SIZE, totalItems)} trong tổng số ${totalItems} sản phẩm
              </span>
              <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
                <button className="pagination-btn" disabled={currentPage === 1} onClick={() => { fetchProducts(currentPage - 1); }}>
                  <ChevronLeft size={16} />
                </button>
                {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
                  const page = i + 1;
                  return (
                    <button key={page} className={`pagination-btn ${page === currentPage ? 'active' : ''}`} onClick={() => fetchProducts(page)}>
                      {page}
                    </button>
                  );
                })}
                {totalPages > 5 && <span style={{ color: '#aaa', fontSize: '0.8rem' }}>...</span>}
                <button className="pagination-btn" disabled={currentPage === totalPages} onClick={() => { fetchProducts(currentPage + 1); }}>
                  <ChevronRight size={16} />
                </button>
              </div>
            </div>
          </>
        )}
      </div>

      {/* Add/Edit Modal */}
      {showModal && (
        <div style={{
          position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(4px)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: '20px',
          animation: 'fadeIn 0.2s ease'
        }}>
          <div style={{
            background: '#fff', borderRadius: '20px', width: '100%', maxWidth: '680px',
            maxHeight: '90vh', overflowY: 'auto', boxShadow: '0 24px 60px rgba(0,0,0,0.2)',
            animation: 'modalIn 0.25s ease'
          }}>
            {/* Modal Header */}
            <div style={{ padding: '24px 28px', borderBottom: '1px solid #f0f0f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center', position: 'sticky', top: 0, background: '#fff', zIndex: 1 }}>
              <div>
                <h2 style={{ margin: 0, fontSize: '1.25rem', fontWeight: 700, color: '#1a1a1a' }}>
                  {editingProduct ? '✏️ Chỉnh Sửa Sản Phẩm' : '➕ Thêm Sản Phẩm Mới'}
                </h2>
                <p style={{ margin: '4px 0 0', fontSize: '0.8rem', color: '#aaa' }}>
                  {editingProduct ? `Đang chỉnh sửa: ${editingProduct.name}` : 'Điền đầy đủ thông tin để tạo sản phẩm mới'}
                </p>
              </div>
              <button onClick={() => setShowModal(false)} style={{ width: '36px', height: '36px', borderRadius: '10px', border: '1px solid #e5e7eb', background: '#f9f9f9', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#888', transition: 'all 0.15s' }}>
                <X size={18} />
              </button>
            </div>

            {/* Modal Body */}
            <form onSubmit={handleFormSubmit} style={{ padding: '28px' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '20px' }}>
                <div style={{ gridColumn: '1 / -1' }}>
                  <label style={labelStyle}>Tên Sản Phẩm *</label>
                  <input className="form-input" type="text" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} style={inputStyle} placeholder="Nhập tên sản phẩm..." required />
                </div>
                <div>
                  <label style={labelStyle}>Danh Mục *</label>
                  <select className="form-input" value={form.categoryId} onChange={e => setForm(f => ({ ...f, categoryId: parseInt(e.target.value) }))} style={inputStyle} required>
                    {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                  </select>
                </div>
                <div>
                  <label style={labelStyle}>Tag (hot, sale, new...)</label>
                  <input className="form-input" type="text" value={form.tag} onChange={e => setForm(f => ({ ...f, tag: e.target.value }))} style={inputStyle} placeholder="Ví dụ: hot, sale, new" />
                </div>
                <div>
                  <label style={labelStyle}>Giá Bán ($) *</label>
                  <div style={{ position: 'relative' }}>
                    <DollarSign size={14} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#aaa' }} />
                    <input className="form-input" type="number" step="0.01" min="0" value={form.price} onChange={e => setForm(f => ({ ...f, price: e.target.value }))} style={{ ...inputStyle, paddingLeft: '32px' }} placeholder="0.00" required />
                  </div>
                </div>
                <div>
                  <label style={labelStyle}>Giá Gốc ($) <span style={{ color: '#aaa', fontWeight: 400 }}>(nếu có khuyến mãi)</span></label>
                  <div style={{ position: 'relative' }}>
                    <DollarSign size={14} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#aaa' }} />
                    <input className="form-input" type="number" step="0.01" min="0" value={form.originalPrice} onChange={e => setForm(f => ({ ...f, originalPrice: e.target.value }))} style={{ ...inputStyle, paddingLeft: '32px' }} placeholder="0.00" />
                  </div>
                </div>
                <div>
                  <label style={labelStyle}>Số Lượng Tồn Kho *</label>
                  <div style={{ position: 'relative' }}>
                    <Box size={14} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#aaa' }} />
                    <input className="form-input" type="number" min="0" value={form.stockQuantity} onChange={e => setForm(f => ({ ...f, stockQuantity: e.target.value }))} style={{ ...inputStyle, paddingLeft: '32px' }} placeholder="0" required />
                  </div>
                </div>
              </div>

              <div style={{ marginBottom: '20px' }}>
                <label style={labelStyle}>URL Hình Ảnh *</label>
                <div style={{ position: 'relative' }}>
                  <ImageIcon size={14} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#aaa' }} />
                  <input className="form-input" type="text" value={form.imageUrl} onChange={e => setForm(f => ({ ...f, imageUrl: e.target.value }))} style={{ ...inputStyle, paddingLeft: '32px' }} placeholder="/assets/images/product/..." required />
                </div>
                {form.imageUrl && (
                  <div style={{ marginTop: '10px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <img src={form.imageUrl} alt="preview" style={{ width: '56px', height: '56px', borderRadius: '10px', objectFit: 'cover', border: '1px solid #e5e7eb' }} onError={e => (e.currentTarget.style.display = 'none')} />
                    <span style={{ fontSize: '0.78rem', color: '#aaa' }}>Xem trước hình ảnh</span>
                  </div>
                )}
              </div>

              <div style={{ marginBottom: '28px' }}>
                <label style={labelStyle}>Mô Tả Sản Phẩm *</label>
                <textarea className="form-input" value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} rows={4} style={{ ...inputStyle, resize: 'vertical', lineHeight: '1.6' }} placeholder="Nhập mô tả chi tiết về sản phẩm..." required />
              </div>

              {/* Modal Footer */}
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', paddingTop: '4px' }}>
                <button type="button" onClick={() => setShowModal(false)} style={{
                  padding: '11px 22px', borderRadius: '10px', border: '1.5px solid #e5e7eb',
                  background: '#fff', cursor: 'pointer', fontWeight: 600, fontSize: '0.88rem',
                  color: '#555', fontFamily: 'var(--font-sans)', transition: 'all 0.15s'
                }}>
                  Hủy
                </button>
                <button type="submit" disabled={saving} style={{
                  padding: '11px 26px', borderRadius: '10px', border: 'none',
                  background: saving ? '#ccc' : 'linear-gradient(135deg, var(--color-primary) 0%, var(--color-primary-dark) 100%)',
                  color: '#fff', cursor: saving ? 'not-allowed' : 'pointer',
                  fontWeight: 600, fontSize: '0.88rem', fontFamily: 'var(--font-sans)',
                  display: 'flex', alignItems: 'center', gap: '8px',
                  boxShadow: saving ? 'none' : '0 4px 14px rgba(184,144,120,0.4)'
                }}>
                  {saving ? <><RefreshCw size={16} style={{ animation: 'spin 0.8s linear infinite' }} /> Đang lưu...</> : <><Check size={16} /> {editingProduct ? 'Lưu Thay Đổi' : 'Tạo Sản Phẩm'}</>}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirm Dialog */}
      {showDeleteConfirm !== null && (
        <div style={{
          position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(4px)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1001,
          animation: 'fadeIn 0.2s ease'
        }}>
          <div style={{
            background: '#fff', borderRadius: '18px', width: '100%', maxWidth: '400px',
            padding: '32px', textAlign: 'center', boxShadow: '0 24px 60px rgba(0,0,0,0.2)',
            animation: 'modalIn 0.25s ease'
          }}>
            <div style={{ width: '60px', height: '60px', borderRadius: '50%', background: '#fef2f2', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px' }}>
              <AlertCircle size={28} color="#ef4444" />
            </div>
            <h3 style={{ margin: '0 0 10px', fontSize: '1.15rem', fontWeight: 700, color: '#1a1a1a' }}>Xác nhận xóa?</h3>
            <p style={{ color: '#888', fontSize: '0.88rem', marginBottom: '24px' }}>
              Sản phẩm này sẽ bị xóa vĩnh viễn và không thể khôi phục.
            </p>
            <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
              <button onClick={() => setShowDeleteConfirm(null)} style={{
                flex: 1, padding: '11px', borderRadius: '10px', border: '1.5px solid #e5e7eb',
                background: '#fff', cursor: 'pointer', fontWeight: 600, fontSize: '0.88rem',
                color: '#555', fontFamily: 'var(--font-sans)'
              }}>Hủy</button>
              <button onClick={() => handleDelete(showDeleteConfirm!)} style={{
                flex: 1, padding: '11px', borderRadius: '10px', border: 'none',
                background: '#ef4444', color: '#fff', cursor: 'pointer',
                fontWeight: 600, fontSize: '0.88rem', fontFamily: 'var(--font-sans)',
                boxShadow: '0 4px 14px rgba(239,68,68,0.3)'
              }}>Xóa Ngay</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminProducts;