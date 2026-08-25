package com.example.payment.dto;

public class PaymentVerificationRequest {

    private String transactionId;
    private String orderId;
    private String status;

    public PaymentVerificationRequest() {}

    public PaymentVerificationRequest(String transactionId, String orderId, String status) {
        this.transactionId = transactionId;
        this.orderId = orderId;
        this.status = status;
    }

    public String getTransactionId() {
        return transactionId;
    }

    public void setTransactionId(String transactionId) {
        this.transactionId = transactionId;
    }

    public String getOrderId() {
        return orderId;
    }

    public void setOrderId(String orderId) {
        this.orderId = orderId;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }
}
