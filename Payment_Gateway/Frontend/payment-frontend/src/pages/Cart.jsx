import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import CartItem from "../Components/CartItem";
import { ArrowRight, ShoppingBag, Trash2, Tag, ShieldCheck, CheckCircle, X } from "lucide-react";

function Cart() {
  const {
    cart,
    clearCart,
    subtotal,
    tax,
    shipping,
    discountAmount,
    grandTotal,
    appliedCoupon,
    applyCoupon,
    removeCoupon,
  } = useCart();

  const [couponInput, setCouponInput] = useState("");
  const navigate = useNavigate();

  const handleApplyCoupon = (e) => {
    e.preventDefault();
    if (applyCoupon(couponInput)) {
      setCouponInput("");
    }
  };

  return (
    <div className="cart-page-container">
      <div className="cart-header-section">
        <h1>Your Shopping Cart</h1>
        <p>Review items in your cart before proceeding to the Payment Gateway.</p>
      </div>

      {cart.length === 0 ? (
        <div className="empty-cart-card">
          <div className="empty-cart-icon">🛒</div>
          <h2>Your cart is empty</h2>
          <p>Explore our catalog to add products to your cart!</p>
          <Link to="/" className="btn-primary">
            <ShoppingBag size={18} /> Continue Shopping
          </Link>
        </div>
      ) : (
        <div className="cart-layout-grid">
          {/* Left Column: Cart Items */}
          <div className="cart-items-column">
            <div className="cart-items-header">
              <span>Items ({cart.length})</span>
              <button className="clear-cart-btn" onClick={clearCart}>
                <Trash2 size={15} /> Clear All
              </button>
            </div>

            <div className="cart-items-list">
              {cart.map((item) => (
                <CartItem key={item.id} item={item} />
              ))}
            </div>

            <div className="cart-actions-row">
              <Link to="/" className="btn-outline">
                ← Continue Shopping
              </Link>
            </div>
          </div>

          {/* Right Column: Order Summary & Checkout CTA */}
          <div className="cart-summary-column">
            <div className="summary-card">
              <h3>Order Summary</h3>

              {/* Coupon Box */}
              <div className="coupon-box">
                <label className="coupon-label">
                  <Tag size={15} /> Have a coupon code?
                </label>
                {appliedCoupon ? (
                  <div className="applied-coupon-pill">
                    <div className="coupon-info">
                      <CheckCircle size={15} color="#10b981" />
                      <span>
                        <strong>{appliedCoupon.code}</strong> ({appliedCoupon.description})
                      </span>
                    </div>
                    <button className="remove-coupon-btn" onClick={removeCoupon}>
                      <X size={15} />
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleApplyCoupon} className="coupon-form">
                    <input
                      type="text"
                      placeholder="e.g. SAVE10, WELCOME20"
                      value={couponInput}
                      onChange={(e) => setCouponInput(e.target.value)}
                    />
                    <button type="submit" className="apply-btn">
                      Apply
                    </button>
                  </form>
                )}
                <div className="coupon-hint">
                  Available coupons: <code>SAVE10</code> (10% off), <code>WELCOME20</code> (20% off), <code>FLAT500</code> (₹500 off)
                </div>
              </div>

              <div className="summary-divider"></div>

              {/* Price Breakdown */}
              <div className="summary-row">
                <span>Subtotal</span>
                <span>₹{subtotal.toLocaleString("en-IN")}</span>
              </div>

              <div className="summary-row">
                <span>Estimated GST (18%)</span>
                <span>₹{tax.toLocaleString("en-IN")}</span>
              </div>

              <div className="summary-row">
                <span>Shipping Fee</span>
                <span>
                  {shipping === 0 ? (
                    <span className="free-shipping-tag">FREE</span>
                  ) : (
                    `₹${shipping}`
                  )}
                </span>
              </div>

              {discountAmount > 0 && (
                <div className="summary-row discount-row">
                  <span>Discount ({appliedCoupon?.code})</span>
                  <span>-₹{discountAmount.toLocaleString("en-IN")}</span>
                </div>
              )}

              <div className="summary-divider"></div>

              <div className="summary-row grand-total-row">
                <span>Total Payable</span>
                <span className="grand-total-price">
                  ₹{grandTotal.toLocaleString("en-IN")}
                </span>
              </div>

              <button
                className="checkout-proceed-btn"
                onClick={() => navigate("/checkout")}
              >
                <span>Proceed to Checkout</span>
                <ArrowRight size={18} />
              </button>

              <div className="checkout-trust-badge">
                <ShieldCheck size={16} /> 100% Encrypted & Safe Payment Gateway
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Cart;
