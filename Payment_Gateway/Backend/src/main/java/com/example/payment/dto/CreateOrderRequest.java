package com.example.payment.dto;

import java.util.List;
import java.util.Map;

public class CreateOrderRequest {

    private Double amount;
    private String method;
    private CustomerDto customer;
    private List<Map<String, Object>> items;
    private Map<String, Object> details;

    public CreateOrderRequest() {}

    public Double getAmount() {
        return amount;
    }

    public void setAmount(Double amount) {
        this.amount = amount;
    }

    public String getMethod() {
        return method;
    }

    public void setMethod(String method) {
        this.method = method;
    }

    public CustomerDto getCustomer() {
        return customer;
    }

    public void setCustomer(CustomerDto customer) {
        this.customer = customer;
    }

    public List<Map<String, Object>> getItems() {
        return items;
    }

    public void setItems(List<Map<String, Object>> items) {
        this.items = items;
    }

    public Map<String, Object> getDetails() {
        return details;
    }

    public void setDetails(Map<String, Object> details) {
        this.details = details;
    }

    public static class CustomerDto {
        private String name;
        private String email;
        private String phone;
        private String address;
        private String city;
        private String pincode;

        public CustomerDto() {}

        public String getName() { return name; }
        public void setName(String name) { this.name = name; }

        public String getEmail() { return email; }
        public void setEmail(String email) { this.email = email; }

        public String getPhone() { return phone; }
        public void setPhone(String phone) { this.phone = phone; }

        public String getAddress() { return address; }
        public void setAddress(String address) { this.address = address; }

        public String getCity() { return city; }
        public void setCity(String city) { this.city = city; }

        public String getPincode() { return pincode; }
        public void setPincode(String pincode) { this.pincode = pincode; }
    }
}
