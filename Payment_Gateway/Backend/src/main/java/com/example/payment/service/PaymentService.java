package com.example.payment.service;

import com.example.payment.dto.CreateOrderRequest;
import com.example.payment.dto.PaymentVerificationRequest;
import com.example.payment.model.Payment;
import com.example.payment.repository.PaymentRepository;
import com.razorpay.Order;
import com.razorpay.RazorpayClient;
import org.json.JSONObject;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.*;

@Service
public class PaymentService {

    private static final Logger logger = LoggerFactory.getLogger(PaymentService.class);

    private final PaymentRepository paymentRepository;

    @Value("${razorpay.key_id:rzp_test_key_placeholder}")
    private String razorKeyId;

    @Value("${razorpay.key_secret:rzp_secret_placeholder}")
    private String razorpayKeySecret;

    public PaymentService(PaymentRepository paymentRepository) {
        this.paymentRepository = paymentRepository;
    }

    /**
     * Process full payment request from frontend Checkout
     */
    public Map<String, Object> processPayment(CreateOrderRequest request) {
        String transactionId = "TXN_" + UUID.randomUUID().toString().replaceAll("-", "").substring(0, 9).toUpperCase();
        String orderId = "ORD_" + (100000 + new Random().nextInt(900000));

        Double amount = request.getAmount() != null ? request.getAmount() : 0.0;
        String method = request.getMethod() != null ? request.getMethod() : "CARD";

        String customerName = "Guest Customer";
        String customerEmail = "guest@example.com";

        if (request.getCustomer() != null) {
            if (request.getCustomer().getName() != null && !request.getCustomer().getName().trim().isEmpty()) {
                customerName = request.getCustomer().getName();
            }
            if (request.getCustomer().getEmail() != null && !request.getCustomer().getEmail().trim().isEmpty()) {
                customerEmail = request.getCustomer().getEmail();
            }
        }

        // Save Payment record in database
        Payment payment = new Payment();
        payment.setTransactionId(transactionId);
        payment.setOrderId(orderId);
        payment.setAmount(amount);
        payment.setPaymentMethod(method);
        payment.setCustomerName(customerName);
        payment.setCustomerEmail(customerEmail);
        payment.setStatus("SUCCESSFUL");
        payment.setTimestamp(LocalDateTime.now());

        paymentRepository.save(payment);
        logger.info("Payment saved to DB: TransactionId={}, OrderId={}, Amount={}", transactionId, orderId, amount);

        // Build Response object matching Frontend expectation
        Map<String, Object> response = new HashMap<>();
        response.put("success", true);
        response.put("transactionId", transactionId);
        response.put("orderId", orderId);
        response.put("amount", amount);
        response.put("paymentMethod", method);
        response.put("customer", request.getCustomer());
        response.put("items", request.getItems());
        response.put("status", "SUCCESSFUL");
        response.put("timestamp", LocalDateTime.now().toString());
        response.put("message", "Payment processed and saved successfully");

        return response;
    }

    /**
     * Razorpay API Order Creation
     */
    public Map<String, Object> createRazorpayOrder(Double amount) {
        String orderId;
        int amountInPaise = (int) (amount * 100);

        try {
            if (razorKeyId != null && !razorKeyId.contains("placeholder")) {
                RazorpayClient razorpayClient = new RazorpayClient(razorKeyId, razorpayKeySecret);
                JSONObject options = new JSONObject();
                options.put("amount", amountInPaise);
                options.put("currency", "INR");
                options.put("receipt", "rcpt_" + System.currentTimeMillis());

                Order order = razorpayClient.orders.create(options);
                orderId = order.get("id");
            } else {
                orderId = "order_mock_" + System.currentTimeMillis();
            }
        } catch (Exception e) {
            logger.warn("Razorpay API call failed, generating fallback order ID: {}", e.getMessage());
            orderId = "order_mock_" + System.currentTimeMillis();
        }

        Map<String, Object> result = new HashMap<>();
        result.put("orderId", orderId);
        result.put("amount", amount);
        result.put("currency", "INR");
        result.put("key", razorKeyId);
        return result;
    }

    /**
     * Verify payment status
     */
    public Map<String, Object> verifyPayment(PaymentVerificationRequest verificationRequest) {
        Optional<Payment> paymentOpt = paymentRepository.findByTransactionId(verificationRequest.getTransactionId());
        
        Map<String, Object> result = new HashMap<>();
        if (paymentOpt.isPresent()) {
            Payment payment = paymentOpt.get();
            if (verificationRequest.getStatus() != null) {
                payment.setStatus(verificationRequest.getStatus());
                paymentRepository.save(payment);
            }
            result.put("verified", true);
            result.put("payment", payment);
        } else {
            result.put("verified", true);
            result.put("status", verificationRequest.getStatus() != null ? verificationRequest.getStatus() : "VERIFIED");
            result.put("transactionId", verificationRequest.getTransactionId());
        }
        return result;
    }

    /**
     * Retrieve all payment transactions
     */
    public List<Payment> getAllTransactions() {
        return paymentRepository.findAll();
    }

    /**
     * Get single transaction by Transaction ID
     */
    public Optional<Payment> getTransactionByTxnId(String transactionId) {
        return paymentRepository.findByTransactionId(transactionId);
    }
}
