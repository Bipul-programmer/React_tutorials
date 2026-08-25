const API_URL = "http://localhost:8080/api/products";

const MOCK_PRODUCTS = [
  {
    id: 1,
    name: "Wireless Noise-Canceling Headphones",
    description: "Premium spatial audio with active noise cancellation and 30-hour battery life.",
    price: 4999,
    category: "Audio",
    rating: 4.8,
    reviewsCount: 142,
    image: "🎧",
    badge: "Bestseller",
    inStock: true
  },
  {
    id: 2,
    name: "Smart Watch Ultra Edition",
    description: "Titanium case, precision GPS, health monitoring & 100m water resistance.",
    price: 8999,
    category: "Wearables",
    rating: 4.9,
    reviewsCount: 89,
    image: "⌚",
    badge: "Trending",
    inStock: true
  },
  {
    id: 3,
    name: "Mechanical Gaming Keyboard",
    description: "Custom hot-swappable RGB mechanical keyboard with tactile switches.",
    price: 3499,
    category: "Electronics",
    rating: 4.7,
    reviewsCount: 64,
    image: "⌨️",
    badge: "Popular",
    inStock: true
  },
  {
    id: 4,
    name: "Ergonomic Wireless Mouse",
    description: "Precision optical tracking, dual bluetooth/2.4Ghz & multi-device pairing.",
    price: 1899,
    category: "Accessories",
    rating: 4.6,
    reviewsCount: 110,
    image: "🖱️",
    badge: "",
    inStock: true
  },
  {
    id: 5,
    name: "Ultra-Fast 65W GaN Charger",
    description: "Compact dual USB-C & USB-A fast charging adapter for laptops & phones.",
    price: 1299,
    category: "Accessories",
    rating: 4.9,
    reviewsCount: 230,
    image: "🔌",
    badge: "Essential",
    inStock: true
  },
  {
    id: 6,
    name: "Portable Bluetooth Speaker",
    description: "360-degree immersive sound, IPX7 waterproof rating with 18h playback.",
    price: 2799,
    category: "Audio",
    rating: 4.7,
    reviewsCount: 95,
    image: "🔊",
    badge: "",
    inStock: true
  }
];

export const getProducts = async () => {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 2000);

    const response = await fetch(API_URL, { signal: controller.signal });
    clearTimeout(timeoutId);

    if (!response.ok) {
      throw new Error(`HTTP error status: ${response.status}`);
    }
    const data = await response.json();
    return { data, isMock: false };
  } catch (error) {
    console.warn("Backend API not reachable, falling back to mock products:", error.message);
    return { data: MOCK_PRODUCTS, isMock: true };
  }
};

export default getProducts;
