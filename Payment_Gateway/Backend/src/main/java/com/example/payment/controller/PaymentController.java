package com.example.payment.controller;

import com.example.payment.dto.CreateOrderRequest;
import com.example.payment.dto.PaymentVerificationRequest;
import com.example.payment.model.Payment;
import com.example.payment.service.PaymentService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/payment")
@CrossOrigin(origins = "*")
public class PaymentController {

    private final PaymentService paymentService;

    public PaymentController(PaymentService paymentService) {
        this.paymentService = paymentService;
    }

    /**
     * Main Payment Processing Endpoint called by Frontend
     */
    @PostMapping("/process")
    public ResponseEntity<Map<String, Object>> processPayment(@RequestBody CreateOrderRequest request) {
        Map<String, Object> result = paymentService.processPayment(request);
        return ResponseEntity.ok(result);
    }

    /**
     * Razorpay Order Creation Endpoint
     */
    @PostMapping("/create-order")
    public ResponseEntity<Map<String, Object>> createOrder(@RequestParam Double amount) {
        Map<String, Object> order = paymentService.createRazorpayOrder(amount);
        return ResponseEntity.ok(order);
    }

    /**
     * Payment Verification Endpoint
     */
    @PostMapping("/verify")
    public ResponseEntity<Map<String, Object>> verifyPayment(@RequestBody PaymentVerificationRequest request) {
        Map<String, Object> verification = paymentService.verifyPayment(request);
        return ResponseEntity.ok(verification);
    }

    /**
     * Get All Payment Transactions
     */
    @GetMapping("/transactions")
    public ResponseEntity<List<Payment>> getAllTransactions() {
        List<Payment> transactions = paymentService.getAllTransactions();
        return ResponseEntity.ok(transactions);
    }

    /**
     * Get Transaction by Transaction ID
     */
    @GetMapping("/transaction/{transactionId}")
    public ResponseEntity<Payment> getTransactionByTxnId(@PathVariable String transactionId) {
        return paymentService.getTransactionByTxnId(transactionId)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }
}
