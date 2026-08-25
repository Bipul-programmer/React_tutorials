package com.example.payment.config;

import com.example.payment.model.Product;
import com.example.payment.repository.ProductRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.util.Arrays;
import java.util.List;

@Component
public class DataInitializer implements CommandLineRunner {

    private final ProductRepository productRepository;

    public DataInitializer(ProductRepository productRepository) {
        this.productRepository = productRepository;
    }

    @Override
    public void run(String... args) {
        if (productRepository.count() == 0) {
            List<Product> sampleProducts = Arrays.asList(
                new Product(
                    "Wireless Noise-Canceling Headphones",
                    "Premium spatial audio with active noise cancellation and 30-hour battery life.",
                    4999.0,
                    "Audio",
                    4.8,
                    142,
                    "🎧",
                    "Bestseller",
                    true
                ),
                new Product(
                    "Smart Watch Ultra Edition",
                    "Titanium case, precision GPS, health monitoring & 100m water resistance.",
                    8999.0,
                    "Wearables",
                    4.9,
                    89,
                    "⌚",
                    "Trending",
                    true
                ),
                new Product(
                    "Mechanical Gaming Keyboard",
                    "Custom hot-swappable RGB mechanical keyboard with tactile switches.",
                    3499.0,
                    "Electronics",
                    4.7,
                    64,
                    "⌨️",
                    "Popular",
                    true
                ),
                new Product(
                    "Ergonomic Wireless Mouse",
                    "Precision optical tracking, dual bluetooth/2.4Ghz & multi-device pairing.",
                    1899.0,
                    "Accessories",
                    4.6,
                    110,
                    "🖱️",
                    "",
                    true
                ),
                new Product(
                    "Ultra-Fast 65W GaN Charger",
                    "Compact dual USB-C & USB-A fast charging adapter for laptops & phones.",
                    1299.0,
                    "Accessories",
                    4.9,
                    230,
                    "🔌",
                    "Essential",
                    true
                ),
                new Product(
                    "Portable Bluetooth Speaker",
                    "360-degree immersive sound, IPX7 waterproof rating with 18h playback.",
                    2799.0,
                    "Audio",
                    4.7,
                    95,
                    "🔊",
                    "",
                    true
                )
            );

            productRepository.saveAll(sampleProducts);
            System.out.println(">>> Seeded " + sampleProducts.size() + " sample products into the database.");
        }
    }
}
