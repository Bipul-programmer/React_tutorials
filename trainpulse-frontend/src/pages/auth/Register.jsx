import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

function Register() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    phone: "",
    role: "PASSENGER"
  });
  const [errorMsg, setErrorMsg] = useState("");
  const [loading, setLoading] = useState(false);

  const { register } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg("");

    if (!formData.name || !formData.email || !formData.password) {
      setErrorMsg("Please fill in all required fields.");
      return;
    }

    setLoading(true);
    const result = await register(formData);
    setLoading(false);

    if (result.success) {
      navigate("/dashboard");
    } else {
      setErrorMsg(result.message || "Registration failed.");
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-header">
        <h1>Create Account</h1>
        <p>Join the TrainPulse Operations & Tracking Network</p>
      </div>

      {errorMsg && <div className="alert-box alert-error">{errorMsg}</div>}

      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Full Name *</label>
          <input
            type="text"
            name="name"
            className="input-control"
            placeholder="e.g. Ramesh Kumar"
            value={formData.name}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label>Email Address *</label>
          <input
            type="email"
            name="email"
            className="input-control"
            placeholder="e.g. user@trainpulse.com"
            value={formData.email}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label>Phone Number</label>
          <input
            type="tel"
            name="phone"
            className="input-control"
            placeholder="+91 98765 43210"
            value={formData.phone}
            onChange={handleChange}
          />
        </div>

        <div className="form-group">
          <label>Account Role</label>
          <select
            name="role"
            className="select-control"
            value={formData.role}
            onChange={handleChange}
          >
            <option value="PASSENGER">Passenger User</option>
            <option value="ADMIN">Railway Controller / Admin</option>
          </select>
        </div>

        <div className="form-group">
          <label>Password *</label>
          <input
            type="password"
            name="password"
            className="input-control"
            placeholder="Create password"
            value={formData.password}
            onChange={handleChange}
            required
          />
        </div>

        <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: '8px', padding: '10px' }} disabled={loading}>
          {loading ? "Creating Account..." : "Register Account"}
        </button>
      </form>

      <p style={{ textAlign: 'center', marginTop: '20px', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
        Already have an account? <Link to="/login" style={{ color: 'var(--accent-blue)', fontWeight: 600 }}>Sign In Here</Link>
      </p>
    </div>
  );
}

export default Register;