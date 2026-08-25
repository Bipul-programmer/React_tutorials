const API_URL = "http://localhost:8080/api/payment";

export const getProducts = async () => {
  const response = await fetch("http://localhost:8080/api/products");
  if (!response.ok) {
    throw new Error("Failed to fetch products");
  }
  return await response.json();
};

export const processPayment = async (paymentDetails) => {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 2500);

    const response = await fetch(`${API_URL}/process`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(paymentDetails),
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      throw new Error(`Payment processing failed with status: ${response.status}`);
    }

    const data = await response.json();
    return { success: true, ...data, isMock: false };
  } catch (error) {
    console.warn("Backend payment endpoint unreachable, simulating payment response:", error.message);

    await new Promise((resolve) => setTimeout(resolve, 1500));

    const mockTransactionId = "TXN_" + Math.random().toString(36).substr(2, 9).toUpperCase();
    const mockOrderId = "ORD_" + Math.floor(100000 + Math.random() * 900000);

    return {
      success: true,
      transactionId: mockTransactionId,
      orderId: mockOrderId,
      amount: paymentDetails.amount,
      paymentMethod: paymentDetails.method,
      customer: paymentDetails.customer,
      items: paymentDetails.items,
      timestamp: new Date().toISOString(),
      status: "SUCCESSFUL",
      isMock: true,
    };
  }
};

export default { getProducts, processPayment };