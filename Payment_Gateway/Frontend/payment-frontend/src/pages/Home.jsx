import { useState, useEffect } from "react";
import { getProducts } from "../services/ProductService";
import ProductCard from "../Components/ProductCard";
import { Search, Filter, Sparkles, Server, ShieldCheck, Zap } from "lucide-react";

function Home() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [isMock, setIsMock] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("featured");

  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    setLoading(true);
    try {
      const { data, isMock: mockStatus } = await getProducts();
      setProducts(data);
      setIsMock(mockStatus);
    } catch (err) {
      console.error(err);
      setError("Unable to load products. Please check server connection.");
    } finally {
      setLoading(false);
    }
  };

  const categories = ["All", "Audio", "Wearables", "Electronics", "Accessories"];

  const filteredProducts = products
    .filter((product) => {
      const matchesCategory =
        selectedCategory === "All" || product.category === selectedCategory;
      const matchesSearch =
        product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.description.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    })
    .sort((a, b) => {
      if (sortBy === "price-low") return a.price - b.price;
      if (sortBy === "price-high") return b.price - a.price;
      if (sortBy === "rating") return b.rating - a.rating;
      return a.id - b.id; // default featured
    });

  return (
    <div className="home-container">
      {/* Hero Banner */}
      <section className="hero-banner">
        <div className="hero-badge">
          <Sparkles size={14} />
          <span>Next-Gen Checkout Demo</span>
        </div>
        <h1 className="hero-title">Experience Seamless Online Payments</h1>
        <p className="hero-subtitle">
          Explore our store, add tech items to your cart, and test our instant multi-method Payment Gateway.
        </p>

        <div className="hero-features">
          <div className="feature-item">
            <Zap size={16} /> Instant UPI & Cards
          </div>
          <div className="feature-item">
            <ShieldCheck size={16} /> PCI-DSS & 256-Bit SSL
          </div>
          <div className="feature-item">
            <Server size={16} /> {isMock ? "Mock Gateway Mode" : "Live Backend Active"}
          </div>
        </div>
      </section>

      {/* Search & Filter Bar */}
      <div className="controls-bar">
        <div className="search-box">
          <Search size={18} className="search-icon" />
          <input
            type="text"
            placeholder="Search products by name or category..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          {searchQuery && (
            <button className="clear-search" onClick={() => setSearchQuery("")}>
              ✕
            </button>
          )}
        </div>

        <div className="filter-group">
          <div className="category-pills">
            {categories.map((cat) => (
              <button
                key={cat}
                className={`category-pill ${selectedCategory === cat ? "active" : ""}`}
                onClick={() => setSelectedCategory(cat)}
              >
                {cat}
              </button>
            ))}
          </div>

          <div className="sort-dropdown-wrapper">
            <Filter size={16} />
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="sort-select"
            >
              <option value="featured">Featured</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
              <option value="rating">Top Rated</option>
            </select>
          </div>
        </div>
      </div>

      {/* Main Content Grid */}
      {loading ? (
        <div className="loading-state">
          <div className="spinner"></div>
          <p>Loading catalog products...</p>
        </div>
      ) : error ? (
        <div className="error-state">
          <p>{error}</p>
          <button onClick={loadProducts} className="retry-btn">
            Retry Connection
          </button>
        </div>
      ) : filteredProducts.length === 0 ? (
        <div className="empty-state">
          <span className="empty-icon">🔍</span>
          <h3>No products found</h3>
          <p>Try searching for something else or reset your filter criteria.</p>
          <button
            className="secondary-btn"
            onClick={() => {
              setSelectedCategory("All");
              setSearchQuery("");
            }}
          >
            Clear Filters
          </button>
        </div>
      ) : (
        <div className="products-grid">
          {filteredProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
}

export default Home;