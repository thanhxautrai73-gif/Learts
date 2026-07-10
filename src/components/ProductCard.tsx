import React from 'react';
import { Link } from 'react-router-dom';
import type { Product } from '../services/api';
import { useCartStore } from '../store/useCartStore';
import { useWishlistStore } from '../store/useWishlistStore';
import toast from 'react-hot-toast';

interface ProductCardProps {
  product: Product;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const addItem = useCartStore((state) => state.addItem);
  
  // Wishlist actions
  const addToWishlist = useWishlistStore((state) => state.addItem);
  const removeFromWishlist = useWishlistStore((state) => state.removeItem);
  const isInWishlist = useWishlistStore((state) => state.isInWishlist(product.id));

  const isOutOfStock = product.stockQuantity === 0;

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    if (isOutOfStock) {
      toast.error('This product is out of stock.');
      return;
    }
    const result = addItem(product, 1);
    if (result.success) {
      toast.success(`Added ${product.name} to cart!`);
    } else {
      toast.error(result.message || 'Failed to add to cart.');
    }
  };

  const handleWishlistToggle = (e: React.MouseEvent) => {
    e.preventDefault();
    if (isInWishlist) {
      removeFromWishlist(product.id);
      toast.success(`Removed ${product.name} from wishlist.`);
    } else {
      addToWishlist({
        id: product.id,
        name: product.name,
        price: product.price,
        imageUrl: product.imageUrl,
        stockQuantity: product.stockQuantity,
        categoryName: 'Product',
      });
      toast.success(`Added ${product.name} to wishlist!`);
    }
  };

  const formatPrice = (price: number) => {
    return '$' + price.toFixed(2);
  };

  return (
    <div className="col">
      <div className="product">
        <div className="product-thumb">
          <Link to={`/product/${product.id}`} className="image">
            <img src={product.imageUrl} alt={product.name} style={{ width: '100%', height: '300px', objectFit: 'cover' }} />
          </Link>
          <a 
            href="#" 
            className="add-to-wishlist hintT-left" 
            data-hint={isInWishlist ? "Remove from wishlist" : "Add to wishlist"}
            onClick={handleWishlistToggle}
          >
            <i className={isInWishlist ? "fas fa-heart" : "far fa-heart"} style={isInWishlist ? { color: '#ff6b6b' } : {}}></i>
          </a>
          {product.tag && (
            <span className="badge" style={{ backgroundColor: '#ff6b6b', color: 'white', position: 'absolute', top: '15px', left: '15px', textTransform: 'uppercase', fontSize: '0.75rem', fontWeight: 600, padding: '4px 8px', borderRadius: '2px' }}>
              {product.tag}
            </span>
          )}
          {product.originalPrice && (
            <span className="badge" style={{ backgroundColor: '#e67e22', color: 'white', position: 'absolute', top: '15px', left: product.tag ? '60px' : '15px', fontSize: '0.75rem', fontWeight: 600, padding: '4px 8px', borderRadius: '2px' }}>
              -{Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}%
            </span>
          )}
          {isOutOfStock && (
            <span className="badge" style={{ backgroundColor: '#7f8c8d', color: 'white', position: 'absolute', top: '15px', left: (product.tag || product.originalPrice) ? '120px' : '15px', fontSize: '0.75rem', fontWeight: 600, padding: '4px 8px', borderRadius: '2px' }}>
              Sold Out
            </span>
          )}
        </div>
        <div className="product-info">
          <h6 className="title">
            <Link to={`/product/${product.id}`}>{product.name}</Link>
          </h6>
          <span className="price" style={{ fontSize: '0.95rem' }}>
            {product.name === 'Abstract Folded Pots' ? (
              <span>$50.00 – $55.00</span>
            ) : product.name === 'Cleaning Dustpan & Brush' ? (
              <span>$38.00 – $50.00</span>
            ) : product.originalPrice ? (
              <>
                <span style={{ textDecoration: 'line-through', color: '#999', marginRight: '8px' }}>{formatPrice(product.originalPrice)}</span>
                <span style={{ color: 'var(--color-primary)', fontWeight: 600 }}>{formatPrice(product.price)}</span>
              </>
            ) : (
              <span>{formatPrice(product.price)}</span>
            )}
          </span>
          <div className="product-buttons">
            <Link to={`/product/${product.id}`} className="product-button hintT-top" data-hint="View Details">
              <i className="fas fa-search"></i>
            </Link>
            <a 
              href="#"
              onClick={handleAddToCart}
              className="product-button hintT-top" 
              data-hint="Add to Cart"
              style={{ cursor: isOutOfStock ? 'not-allowed' : 'pointer' }}
            >
              <i className="fas fa-shopping-cart"></i>
            </a>
            <a 
              href="#" 
              onClick={(e) => { e.preventDefault(); toast.success(`${product.name} added to comparison list!`); }} 
              className="product-button hintT-top" 
              data-hint="Compare"
            >
              <i className="fas fa-random"></i>
            </a>
            <span style={{ fontSize: '0.75rem', color: '#999', alignSelf: 'center', marginLeft: 'auto' }}>
              Stock: {product.stockQuantity}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
export default ProductCard;
