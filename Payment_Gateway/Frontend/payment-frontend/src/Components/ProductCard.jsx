import { useCart } from "../context/CartContext";
import { Star, ShoppingBag, Check } from "lucide-react";
import { useState } from "react";

function ProductCard({ product }) {
  const { addToCart } = useCart();
  const [added, setAdded] = useState(false);

  const handleAddToCart = () => {
    addToCart(product);
    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
  };

  return (
    <div className="product-card">
      {product.badge && <span className="product-badge">{product.badge}</span>}

      <div className="product-image-container">
        <span className="product-emoji-icon">{product.image || "🛍️"}</span>
        <span className="product-category-tag">{product.category}</span>
      </div>

      <div className="product-content">
        <h3 className="product-title">{product.name}</h3>

        <div className="product-rating">
          <Star size={14} className="star-icon" fill="#f59e0b" color="#f59e0b" />
          <span className="rating-score">{product.rating}</span>
          <span className="rating-count">({product.reviewsCount} reviews)</span>
        </div>

        <p className="product-description">{product.description}</p>

        <div className="product-footer">
          <div className="product-price-wrapper">
            <span className="currency-symbol">₹</span>
            <span className="product-price">{product.price.toLocaleString("en-IN")}</span>
          </div>

          <button
            className={`add-to-cart-btn ${added ? "added" : ""}`}
            onClick={handleAddToCart}
          >
            {added ? (
              <>
                <Check size={16} /> Added
              </>
            ) : (
              <>
                <ShoppingBag size={16} /> Add to Cart
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

export default ProductCard;