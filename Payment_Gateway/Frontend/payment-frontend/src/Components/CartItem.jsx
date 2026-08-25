import { useCart } from "../context/CartContext";
import { Plus, Minus, Trash2 } from "lucide-react";

function CartItem({ item }) {
  const { updateQuantity, removeFromCart } = useCart();

  const itemTotal = item.price * item.quantity;

  return (
    <div className="cart-item-card">
      <div className="cart-item-image">
        <span>{item.image || "🛍️"}</span>
      </div>

      <div className="cart-item-info">
        <h4 className="cart-item-title">{item.name}</h4>
        <span className="cart-item-unit-price">
          ₹{item.price.toLocaleString("en-IN")} each
        </span>
      </div>

      <div className="cart-item-quantity-controls">
        <button
          className="qty-btn"
          onClick={() => updateQuantity(item.id, item.quantity - 1)}
          aria-label="Decrease quantity"
        >
          <Minus size={14} />
        </button>

        <span className="qty-value">{item.quantity}</span>

        <button
          className="qty-btn"
          onClick={() => updateQuantity(item.id, item.quantity + 1)}
          aria-label="Increase quantity"
        >
          <Plus size={14} />
        </button>
      </div>

      <div className="cart-item-price-col">
        <span className="cart-item-total-price">
          ₹{itemTotal.toLocaleString("en-IN")}
        </span>
      </div>

      <button
        className="remove-item-btn"
        onClick={() => removeFromCart(item.id)}
        aria-label="Remove item"
        title="Remove item"
      >
        <Trash2 size={18} />
      </button>
    </div>
  );
}

export default CartItem;
