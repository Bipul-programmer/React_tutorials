import { Link, useLocation } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { ShoppingCart, ShieldCheck, Store, CreditCard } from "lucide-react";

function Navbar() {
  const { totalItemCount, grandTotal } = useCart();
  const location = useLocation();

  return (
    <header className="navbar-wrapper">
      <div className="navbar-container">
        <Link to="/" className="navbar-brand">
          <div className="brand-logo">
            <CreditCard size={22} color="#ffffff" />
          </div>
          <div className="brand-text">
            <span className="brand-title">PayGuard</span>
            <span className="brand-subtitle">Gateway Store</span>
          </div>
        </Link>

        <nav className="navbar-links">
          <Link
            to="/"
            className={`nav-item ${location.pathname === "/" ? "active" : ""}`}
          >
            <Store size={18} />
            <span>Store</span>
          </Link>

          <Link
            to="/cart"
            className={`nav-item cart-nav-item ${
              location.pathname === "/cart" ? "active" : ""
            }`}
          >
            <div className="cart-icon-wrapper">
              <ShoppingCart size={18} />
              {totalItemCount > 0 && (
                <span className="cart-badge">{totalItemCount}</span>
              )}
            </div>
            <span>Cart</span>
            {grandTotal > 0 && (
              <span className="nav-subtotal">₹{grandTotal.toLocaleString("en-IN")}</span>
            )}
          </Link>

          <div className="security-pill">
            <ShieldCheck size={16} color="#10b981" />
            <span>256-Bit SSL</span>
          </div>
        </nav>
      </div>
    </header>
  );
}

export default Navbar;
