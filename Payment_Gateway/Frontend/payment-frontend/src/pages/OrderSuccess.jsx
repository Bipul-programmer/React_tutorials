import { useLocation, Link, useNavigate } from "react";
import { useEffect } from "react";
import { CheckCircle, Printer, ShoppingBag, ArrowRight, ShieldCheck } from "lucide-react";

function OrderSuccess() {
  const location = useLocation();
  const navigate = useNavigate();
  const order = location.state?.order;

  useEffect(() => {
    if (!order) {
      navigate("/");
    }
  }, [order, navigate]);

  if (!order) return null;

  const handlePrint = () => {
    window.print();
  };

  const formattedDate = new Date(order.timestamp || Date.now()).toLocaleString("en-IN", {
    dateStyle: "medium",
    timeStyle: "short",
  });

  return (
    <div className="order-success-container">
      <div className="receipt-card">
        {/* Header Status */}
        <div className="receipt-header">
          <div className="success-badge-icon">
            <CheckCircle size={48} color="#10b981" />
          </div>
          <h2>Payment Successful!</h2>
          <p className="success-subtext">
            Thank you for your order. Your payment has been processed and confirmed.
          </p>

          <div className="transaction-status-pill">
            <ShieldCheck size={14} /> STATUS: <strong>{order.status || "SUCCESSFUL"}</strong>
          </div>
        </div>

        {/* Transaction Summary Table */}
        <div className="transaction-meta-grid">
          <div className="meta-item">
            <span className="meta-label">Transaction ID</span>
            <span className="meta-value code-font">{order.transactionId}</span>
          </div>

          <div className="meta-item">
            <span className="meta-label">Order Number</span>
            <span className="meta-value code-font">{order.orderId}</span>
          </div>

          <div className="meta-item">
            <span className="meta-label">Date & Time</span>
            <span className="meta-value">{formattedDate}</span>
          </div>

          <div className="meta-item">
            <span className="meta-label">Payment Method</span>
            <span className="meta-value capitalize">
              {order.paymentMethod?.toUpperCase()} {order.isMock ? "(Demo Gateway)" : ""}
            </span>
          </div>
        </div>

        <div className="receipt-divider"></div>

        {/* Customer & Delivery Information */}
        {order.customer && (
          <div className="customer-info-box">
            <h4>Billed & Shipped To:</h4>
            <p className="customer-name">{order.customer.name}</p>
            <p className="customer-detail">{order.customer.address}, {order.customer.city} - {order.customer.pincode}</p>
            <p className="customer-detail">Email: {order.customer.email} | Phone: {order.customer.phone}</p>
          </div>
        )}

        <div className="receipt-divider"></div>

        {/* Itemized Table */}
        <div className="receipt-items-section">
          <h4>Order Items</h4>
          <table className="receipt-table">
            <thead>
              <tr>
                <th>Item Description</th>
                <th className="text-center">Qty</th>
                <th className="text-right">Price</th>
                <th className="text-right">Total</th>
              </tr>
            </thead>
            <tbody>
              {order.items?.map((item) => (
                <tr key={item.id}>
                  <td>
                    <span className="item-emoji">{item.image}</span> {item.name}
                  </td>
                  <td className="text-center">{item.quantity}</td>
                  <td className="text-right">₹{item.price.toLocaleString("en-IN")}</td>
                  <td className="text-right">
                    ₹{(item.price * item.quantity).toLocaleString("en-IN")}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="receipt-divider"></div>

        {/* Total Summary */}
        <div className="receipt-total-section">
          <div className="total-row grand-total">
            <span>Total Paid</span>
            <span className="paid-amount">
              ₹{order.amount?.toLocaleString("en-IN")}
            </span>
          </div>
        </div>

        {/* Receipt Actions */}
        <div className="receipt-actions no-print">
          <button className="btn-secondary" onClick={handlePrint}>
            <Printer size={16} /> Print Receipt
          </button>

          <Link to="/" className="btn-primary">
            <ShoppingBag size={16} /> Continue Shopping <ArrowRight size={16} />
          </Link>
        </div>
      </div>
    </div>
  );
}

export default OrderSuccess;
