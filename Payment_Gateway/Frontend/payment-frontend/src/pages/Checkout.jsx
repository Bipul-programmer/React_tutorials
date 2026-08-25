import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { processPayment } from "../services/PaymentService";
import {
  CreditCard,
  QrCode,
  Building2,
  Wallet,
  ShieldCheck,
  Lock,
  CheckCircle2,
  ArrowLeft,
  Smartphone,
  AlertCircle,
  Clock,
  Sparkles,
} from "lucide-react";

function Checkout() {
  const { cart, grandTotal, subtotal, tax, shipping, discountAmount, clearCart, showToast } =
    useCart();
  const navigate = useNavigate();

  // Redirect to cart if empty
  useEffect(() => {
    if (cart.length === 0) {
      navigate("/cart");
    }
  }, [cart, navigate]);

  // Form states
  const [customer, setCustomer] = useState({
    name: "Aarav Sharma",
    email: "aarav.sharma@example.com",
    phone: "9876543210",
    address: "42, Tech Park Avenue, HSR Layout",
    city: "Bengaluru",
    pincode: "560102",
  });

  const [paymentMethod, setPaymentMethod] = useState("card"); // 'card' | 'upi' | 'netbanking' | 'wallet'
  const [upiMode, setUpiMode] = useState("qr"); // 'qr' | 'id'

  // Card details
  const [card, setCard] = useState({
    number: "4532 8921 7843 9012",
    holder: "AARAV SHARMA",
    expiry: "12/28",
    cvv: "888",
  });

  // UPI details
  const [upiId, setUpiId] = useState("aarav@okhdfcbank");
  const [upiVerified, setUpiVerified] = useState(true);

  // Netbanking details
  const [selectedBank, setSelectedBank] = useState("HDFC");

  // Wallet details
  const [selectedWallet, setSelectedWallet] = useState("Paytm");

  // Processing Modal state
  const [isProcessing, setIsProcessing] = useState(false);
  const [processingStep, setProcessingStep] = useState(0);

  // QR Timer countdown simulation
  const [qrTimer, setQrTimer] = useState(300); // 5 mins
  useEffect(() => {
    if (paymentMethod === "upi" && upiMode === "qr") {
      const interval = setInterval(() => {
        setQrTimer((prev) => (prev > 0 ? prev - 1 : 300));
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [paymentMethod, upiMode]);

  const formatTimer = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  const handleCustomerChange = (e) => {
    const { name, value } = e.target;
    setCustomer((prev) => ({ ...prev, [name]: value }));
  };

  const handleCardChange = (e) => {
    const { name, value } = e.target;
    if (name === "number") {
      // Format number with spaces every 4 digits
      const cleaned = value.replace(/\D/g, "").slice(0, 16);
      const formatted = cleaned.match(/.{1,4}/g)?.join(" ") || cleaned;
      setCard((prev) => ({ ...prev, number: formatted }));
    } else if (name === "expiry") {
      const cleaned = value.replace(/\D/g, "").slice(0, 4);
      let formatted = cleaned;
      if (cleaned.length >= 3) {
        formatted = `${cleaned.slice(0, 2)}/${cleaned.slice(2)}`;
      }
      setCard((prev) => ({ ...prev, expiry: formatted }));
    } else if (name === "cvv") {
      const cleaned = value.replace(/\D/g, "").slice(0, 4);
      setCard((prev) => ({ ...prev, cvv: cleaned }));
    } else {
      setCard((prev) => ({ ...prev, [name]: value.toUpperCase() }));
    }
  };

  const getCardBrand = (num) => {
    const clean = num.replace(/\s/g, "");
    if (clean.startsWith("4")) return "VISA";
    if (clean.startsWith("5")) return "MASTERCARD";
    if (clean.startsWith("3")) return "AMEX";
    if (clean.startsWith("6")) return "RUPAY";
    return "CARD";
  };

  const handleVerifyUpi = () => {
    if (upiId.includes("@")) {
      setUpiVerified(true);
      showToast("UPI ID verified successfully!", "success");
    } else {
      setUpiVerified(false);
      showToast("Please enter a valid UPI ID (e.g. name@bank)", "error");
    }
  };

  const handleSubmitPayment = async (e) => {
    e.preventDefault();

    // Basic Validation
    if (!customer.name || !customer.email || !customer.phone || !customer.address) {
      showToast("Please complete all shipping details", "warning");
      return;
    }

    if (paymentMethod === "card") {
      const cleanNum = card.number.replace(/\s/g, "");
      if (cleanNum.length < 15 || !card.expiry || card.cvv.length < 3) {
        showToast("Please check card details", "warning");
        return;
      }
    }

    if (paymentMethod === "upi" && upiMode === "id" && !upiId.includes("@")) {
      showToast("Please enter a valid UPI ID", "warning");
      return;
    }

    // Start payment processing steps simulation
    setIsProcessing(true);
    setProcessingStep(1); // Connecting to gateway

    setTimeout(() => {
      setProcessingStep(2); // Authorizing payment with bank
    }, 1200);

    setTimeout(() => {
      setProcessingStep(3); // Verification complete
    }, 2400);

    setTimeout(async () => {
      const paymentPayload = {
        amount: grandTotal,
        method: paymentMethod,
        customer,
        items: cart,
        details:
          paymentMethod === "card"
            ? { last4: card.number.slice(-4), brand: getCardBrand(card.number) }
            : paymentMethod === "upi"
            ? { upiId: upiMode === "id" ? upiId : "QR Scan Payment" }
            : paymentMethod === "netbanking"
            ? { bank: selectedBank }
            : { wallet: selectedWallet },
      };

      const result = await processPayment(paymentPayload);

      setIsProcessing(false);
      clearCart();

      navigate("/order-success", {
        state: { order: result },
      });
    }, 3200);
  };

  const popularBanks = [
    { id: "HDFC", name: "HDFC Bank", logo: "🏦" },
    { id: "ICICI", name: "ICICI Bank", logo: "🏦" },
    { id: "SBI", name: "State Bank of India", logo: "🏦" },
    { id: "AXIS", name: "Axis Bank", logo: "🏦" },
    { id: "KOTAK", name: "Kotak Mahindra", logo: "🏦" },
    { id: "PNB", name: "Punjab National", logo: "🏦" },
  ];

  const popularWallets = [
    { id: "Paytm", name: "Paytm Wallet", icon: "👛" },
    { id: "PhonePe", name: "PhonePe / BHIM", icon: "📱" },
    { id: "AmazonPay", name: "Amazon Pay", icon: "📦" },
    { id: "MobiKwik", name: "MobiKwik", icon: "⚡" },
  ];

  return (
    <div className="checkout-page-container">
      <div className="checkout-nav-bar">
        <Link to="/cart" className="back-link">
          <ArrowLeft size={18} /> Return to Cart
        </Link>
        <div className="checkout-title-pill">
          <Lock size={14} /> Secure Checkout
        </div>
      </div>

      <div className="checkout-grid">
        {/* Left Column: Details & Payment Methods */}
        <div className="checkout-main-col">
          {/* Shipping Form */}
          <div className="checkout-card">
            <h3 className="card-heading">1. Shipping & Customer Information</h3>
            <div className="form-grid">
              <div className="form-group col-full">
                <label>Full Name</label>
                <input
                  type="text"
                  name="name"
                  value={customer.name}
                  onChange={handleCustomerChange}
                  placeholder="John Doe"
                  required
                />
              </div>

              <div className="form-group col-half">
                <label>Email Address</label>
                <input
                  type="email"
                  name="email"
                  value={customer.email}
                  onChange={handleCustomerChange}
                  placeholder="john@example.com"
                  required
                />
              </div>

              <div className="form-group col-half">
                <label>Phone Number</label>
                <input
                  type="tel"
                  name="phone"
                  value={customer.phone}
                  onChange={handleCustomerChange}
                  placeholder="+91 9876543210"
                  required
                />
              </div>

              <div className="form-group col-full">
                <label>Delivery Address</label>
                <input
                  type="text"
                  name="address"
                  value={customer.address}
                  onChange={handleCustomerChange}
                  placeholder="Flat/House No, Street, Area"
                  required
                />
              </div>

              <div className="form-group col-half">
                <label>City</label>
                <input
                  type="text"
                  name="city"
                  value={customer.city}
                  onChange={handleCustomerChange}
                  placeholder="City"
                  required
                />
              </div>

              <div className="form-group col-half">
                <label>Pincode / Postal Code</label>
                <input
                  type="text"
                  name="pincode"
                  value={customer.pincode}
                  onChange={handleCustomerChange}
                  placeholder="560100"
                  required
                />
              </div>
            </div>
          </div>

          {/* Payment Methods Selection */}
          <div className="checkout-card">
            <h3 className="card-heading">2. Select Payment Gateway Method</h3>

            {/* Payment Method Selector Tabs */}
            <div className="payment-tabs">
              <button
                type="button"
                className={`tab-btn ${paymentMethod === "card" ? "active" : ""}`}
                onClick={() => setPaymentMethod("card")}
              >
                <CreditCard size={18} />
                <span>Card</span>
              </button>

              <button
                type="button"
                className={`tab-btn ${paymentMethod === "upi" ? "active" : ""}`}
                onClick={() => setPaymentMethod("upi")}
              >
                <QrCode size={18} />
                <span>UPI / QR</span>
              </button>

              <button
                type="button"
                className={`tab-btn ${paymentMethod === "netbanking" ? "active" : ""}`}
                onClick={() => setPaymentMethod("netbanking")}
              >
                <Building2 size={18} />
                <span>NetBanking</span>
              </button>

              <button
                type="button"
                className={`tab-btn ${paymentMethod === "wallet" ? "active" : ""}`}
                onClick={() => setPaymentMethod("wallet")}
              >
                <Wallet size={18} />
                <span>Wallets</span>
              </button>
            </div>

            {/* Tab Contents */}
            <div className="tab-content-container">
              {/* CARD METHOD */}
              {paymentMethod === "card" && (
                <div className="card-payment-form">
                  <div className="card-preview">
                    <div className="card-preview-top">
                      <span className="card-chip">💳</span>
                      <span className="card-brand-badge">{getCardBrand(card.number)}</span>
                    </div>
                    <div className="card-preview-number">
                      {card.number || "•••• •••• •••• ••••"}
                    </div>
                    <div className="card-preview-bottom">
                      <div>
                        <span className="card-preview-label">CARD HOLDER</span>
                        <span className="card-preview-value">{card.holder || "YOUR NAME"}</span>
                      </div>
                      <div>
                        <span className="card-preview-label">EXPIRES</span>
                        <span className="card-preview-value">{card.expiry || "MM/YY"}</span>
                      </div>
                    </div>
                  </div>

                  <div className="form-grid mt-4">
                    <div className="form-group col-full">
                      <label>Card Number</label>
                      <input
                        type="text"
                        name="number"
                        value={card.number}
                        onChange={handleCardChange}
                        placeholder="4532 0000 0000 0000"
                        maxLength={19}
                        required
                      />
                    </div>

                    <div className="form-group col-full">
                      <label>Cardholder Name</label>
                      <input
                        type="text"
                        name="holder"
                        value={card.holder}
                        onChange={handleCardChange}
                        placeholder="NAME ON CARD"
                        required
                      />
                    </div>

                    <div className="form-group col-half">
                      <label>Expiry Date</label>
                      <input
                        type="text"
                        name="expiry"
                        value={card.expiry}
                        onChange={handleCardChange}
                        placeholder="MM/YY"
                        maxLength={5}
                        required
                      />
                    </div>

                    <div className="form-group col-half">
                      <label>CVV / CVC</label>
                      <input
                        type="password"
                        name="cvv"
                        value={card.cvv}
                        onChange={handleCardChange}
                        placeholder="123"
                        maxLength={4}
                        required
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* UPI METHOD */}
              {paymentMethod === "upi" && (
                <div className="upi-payment-section">
                  <div className="sub-tabs">
                    <button
                      type="button"
                      className={`sub-tab ${upiMode === "qr" ? "active" : ""}`}
                      onClick={() => setUpiMode("qr")}
                    >
                      <QrCode size={16} /> Scan QR Code
                    </button>
                    <button
                      type="button"
                      className={`sub-tab ${upiMode === "id" ? "active" : ""}`}
                      onClick={() => setUpiMode("id")}
                    >
                      <Smartphone size={16} /> UPI VPA ID
                    </button>
                  </div>

                  {upiMode === "qr" ? (
                    <div className="qr-container">
                      <div className="qr-box">
                        <div className="qr-code-placeholder">
                          {/* SVG QR Code Simulation */}
                          <svg viewBox="0 0 100 100" width="160" height="160">
                            <rect width="100" height="100" fill="white" />
                            {/* Corner Position Detection Patterns */}
                            <rect x="5" y="5" width="30" height="30" fill="#1e1b4b" />
                            <rect x="10" y="10" width="20" height="20" fill="white" />
                            <rect x="15" y="15" width="10" height="10" fill="#6366f1" />

                            <rect x="65" y="5" width="30" height="30" fill="#1e1b4b" />
                            <rect x="70" y="10" width="20" height="20" fill="white" />
                            <rect x="75" y="15" width="10" height="10" fill="#6366f1" />

                            <rect x="5" y="65" width="30" height="30" fill="#1e1b4b" />
                            <rect x="10" y="70" width="20" height="20" fill="white" />
                            <rect x="15" y="75" width="10" height="10" fill="#6366f1" />

                            {/* Data modules */}
                            <rect x="42" y="10" width="8" height="8" fill="#4f46e5" />
                            <rect x="52" y="20" width="8" height="8" fill="#1e1b4b" />
                            <rect x="42" y="30" width="18" height="8" fill="#4f46e5" />
                            <rect x="10" y="42" width="8" height="18" fill="#1e1b4b" />
                            <rect x="42" y="50" width="12" height="12" fill="#6366f1" />
                            <rect x="65" y="45" width="28" height="8" fill="#1e1b4b" />
                            <rect x="65" y="60" width="12" height="28" fill="#4f46e5" />
                            <rect x="82" y="75" width="12" height="12" fill="#6366f1" />
                          </svg>
                        </div>
                        <div className="qr-timer">
                          <Clock size={14} /> Expires in:{" "}
                          <strong>{formatTimer(qrTimer)}</strong>
                        </div>
                      </div>

                      <div className="qr-instructions">
                        <p>
                          Scan with any UPI App: <strong>GPay, PhonePe, Paytm, BHIM</strong>
                        </p>
                        <span className="pay-amount-highlight">
                          Pay ₹{grandTotal.toLocaleString("en-IN")}
                        </span>
                      </div>
                    </div>
                  ) : (
                    <div className="upi-id-box">
                      <label>Enter Virtual Payment Address (UPI ID)</label>
                      <div className="input-with-button">
                        <input
                          type="text"
                          placeholder="e.g. mobilenumber@upi or name@okhdfcbank"
                          value={upiId}
                          onChange={(e) => {
                            setUpiId(e.target.value);
                            setUpiVerified(false);
                          }}
                        />
                        <button
                          type="button"
                          className="verify-upi-btn"
                          onClick={handleVerifyUpi}
                        >
                          Verify
                        </button>
                      </div>
                      {upiVerified && (
                        <div className="upi-verified-badge">
                          <CheckCircle2 size={14} /> Verified VPA Account
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )}

              {/* NETBANKING METHOD */}
              {paymentMethod === "netbanking" && (
                <div className="netbanking-section">
                  <label className="section-subtitle">Select Popular Bank</label>
                  <div className="banks-grid">
                    {popularBanks.map((bank) => (
                      <button
                        type="button"
                        key={bank.id}
                        className={`bank-card ${selectedBank === bank.id ? "selected" : ""}`}
                        onClick={() => setSelectedBank(bank.id)}
                      >
                        <span className="bank-icon">{bank.logo}</span>
                        <span className="bank-name">{bank.name}</span>
                      </button>
                    ))}
                  </div>

                  <div className="other-banks-select mt-3">
                    <label>Or select from all banks:</label>
                    <select
                      value={selectedBank}
                      onChange={(e) => setSelectedBank(e.target.value)}
                    >
                      <option value="HDFC">HDFC Bank</option>
                      <option value="ICICI">ICICI Bank</option>
                      <option value="SBI">State Bank of India</option>
                      <option value="AXIS">Axis Bank</option>
                      <option value="KOTAK">Kotak Mahindra Bank</option>
                      <option value="YES">Yes Bank</option>
                      <option value="BOB">Bank of Baroda</option>
                      <option value="IDFC">IDFC FIRST Bank</option>
                    </select>
                  </div>
                </div>
              )}

              {/* WALLET METHOD */}
              {paymentMethod === "wallet" && (
                <div className="wallet-section">
                  <label className="section-subtitle">Select Digital Wallet</label>
                  <div className="wallets-list">
                    {popularWallets.map((wallet) => (
                      <label
                        key={wallet.id}
                        className={`wallet-item ${
                          selectedWallet === wallet.id ? "selected" : ""
                        }`}
                      >
                        <input
                          type="radio"
                          name="wallet"
                          checked={selectedWallet === wallet.id}
                          onChange={() => setSelectedWallet(wallet.id)}
                        />
                        <span className="wallet-icon">{wallet.icon}</span>
                        <span className="wallet-name">{wallet.name}</span>
                      </label>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right Column: Checkout Summary & Pay Action */}
        <div className="checkout-sidebar-col">
          <div className="checkout-summary-card">
            <h3>Payment Summary</h3>

            <div className="checkout-items-preview">
              {cart.map((item) => (
                <div key={item.id} className="preview-item">
                  <span className="preview-emoji">{item.image}</span>
                  <div className="preview-details">
                    <span className="preview-title">{item.name}</span>
                    <span className="preview-qty">Qty: {item.quantity}</span>
                  </div>
                  <span className="preview-price">
                    ₹{(item.price * item.quantity).toLocaleString("en-IN")}
                  </span>
                </div>
              ))}
            </div>

            <div className="summary-divider"></div>

            <div className="summary-row">
              <span>Subtotal</span>
              <span>₹{subtotal.toLocaleString("en-IN")}</span>
            </div>

            <div className="summary-row">
              <span>GST (18%)</span>
              <span>₹{tax.toLocaleString("en-IN")}</span>
            </div>

            <div className="summary-row">
              <span>Shipping</span>
              <span>{shipping === 0 ? "FREE" : `₹${shipping}`}</span>
            </div>

            {discountAmount > 0 && (
              <div className="summary-row discount-row">
                <span>Discount</span>
                <span>-₹{discountAmount.toLocaleString("en-IN")}</span>
              </div>
            )}

            <div className="summary-divider"></div>

            <div className="summary-row grand-total-row">
              <span>Amount to Pay</span>
              <span className="total-highlight">
                ₹{grandTotal.toLocaleString("en-IN")}
              </span>
            </div>

            <button
              type="button"
              className="pay-now-btn"
              onClick={handleSubmitPayment}
            >
              <Lock size={18} />
              <span>Pay ₹{grandTotal.toLocaleString("en-IN")}</span>
            </button>

            <div className="guarantee-box">
              <ShieldCheck size={18} color="#10b981" />
              <div>
                <strong>Guaranteed Safe Checkout</strong>
                <p>256-bit encryption. Instant response & order invoice.</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Processing Modal Overlay */}
      {isProcessing && (
        <div className="processing-modal-overlay">
          <div className="processing-card">
            <div className="payment-processing-spinner">
              <div className="spinner-ring"></div>
              <Sparkles size={24} className="processing-sparkle" />
            </div>

            <h3>Processing Your Payment</h3>
            <p>Please do not refresh or close this window...</p>

            <div className="processing-steps-list">
              <div className={`step-item ${processingStep >= 1 ? "completed" : ""}`}>
                <CheckCircle2 size={16} /> Contacting Payment Gateway
              </div>
              <div className={`step-item ${processingStep >= 2 ? "completed" : ""}`}>
                <CheckCircle2 size={16} /> Verifying Credentials & Authorizing
              </div>
              <div className={`step-item ${processingStep >= 3 ? "completed" : ""}`}>
                <CheckCircle2 size={16} /> Generating Transaction Receipt
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Checkout;
