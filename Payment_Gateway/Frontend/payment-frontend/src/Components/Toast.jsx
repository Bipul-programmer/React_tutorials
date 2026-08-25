import { useEffect } from "react";
import { useCart } from "../context/CartContext";
import { CheckCircle2, AlertCircle, Info, X } from "lucide-react";

function Toast() {
  const { toast, clearToast } = useCart();

  useEffect(() => {
    if (toast) {
      const timer = setTimeout(() => {
        clearToast();
      }, 3500);
      return () => clearTimeout(timer);
    }
  }, [toast, clearToast]);

  if (!toast) return null;

  const getIcon = () => {
    switch (toast.type) {
      case "success":
        return <CheckCircle2 className="toast-icon success" size={20} />;
      case "error":
      case "warning":
        return <AlertCircle className="toast-icon warning" size={20} />;
      default:
        return <Info className="toast-icon info" size={20} />;
    }
  };

  return (
    <div className={`toast-container toast-${toast.type}`}>
      {getIcon()}
      <span className="toast-message">{toast.message}</span>
      <button className="toast-close" onClick={clearToast} aria-label="Close notification">
        <X size={16} />
      </button>
    </div>
  );
}

export default Toast;
