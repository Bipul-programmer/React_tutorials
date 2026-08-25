import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg("");

    if (!email || !password) {
      setErrorMsg("Please enter both email and password.");
      return;
    }

    setLoading(true);
    const result = await login({ email, password });
    setLoading(false);

    if (result.success) {
      navigate("/dashboard");
    } else {
      setErrorMsg(result.message || "Invalid credentials.");
    }
  };

  const handleDemoFill = (role) => {
    if (role === "admin") {
      setEmail("admin@trainpulse.gov.in");
      setPassword("admin123");
    } else {
      setEmail("passenger@trainpulse.com");
      setPassword("pass123");
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-header">
        <h1>TrainPulse Sign In</h1>
        <p>Enterprise Railway Management Portal</p>
      </div>

      {errorMsg && <div className="alert-box alert-error">{errorMsg}</div>}

      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Email Address</label>
          <input
            type="email"
            className="input-control"
            placeholder="e.g. officer@trainpulse.gov.in"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>

        <div className="form-group">
          <label>Password</label>
          <input
            type="password"
            className="input-control"
            placeholder="Enter password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>

        <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: '8px', padding: '10px' }} disabled={loading}>
          {loading ? "Signing In..." : "Sign In"}
        </button>
      </form>

      {/* Demo Credentials Helper */}
      <div style={{ marginTop: '24px', paddingTop: '16px', borderTop: '1px solid var(--border-color)', fontSize: '0.8rem', textAlign: 'center' }}>
        <p style={{ color: 'var(--text-muted)', marginBottom: '8px' }}>Demo Quick Login Fill:</p>
        <div style={{ display: 'flex', gap: '8px', justifyContent: 'center' }}>
          <button type="button" onClick={() => handleDemoFill("admin")} className="btn btn-secondary" style={{ fontSize: '0.75rem', padding: '4px 8px' }}>
            Admin User
          </button>
          <button type="button" onClick={() => handleDemoFill("passenger")} className="btn btn-secondary" style={{ fontSize: '0.75rem', padding: '4px 8px' }}>
            Passenger User
          </button>
        </div>
      </div>

      <p style={{ textAlign: 'center', marginTop: '20px', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
        Don't have an account? <Link to="/register" style={{ color: 'var(--accent-blue)', fontWeight: 600 }}>Register Here</Link>
      </p>
    </div>
  );
}

export default Login;