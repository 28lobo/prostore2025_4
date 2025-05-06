import { generateAccessToken, paypal } from "../lib/paypal";

// Test to generate access token from paypal
test("Generate access token from paypal", async () => {
  const tokenResponse = await generateAccessToken();
  console.log(tokenResponse);
  expect(typeof tokenResponse).toBe('string')
  expect(tokenResponse.length).toBeGreaterThan(0)
})

// Test to create a PayPal order 
test("Create a PayPal order", async () => {
  await generateAccessToken();
  const price = 10.0;
  const orderResponse = await paypal.createOrder(price);
  console.log(orderResponse);

  expect(orderResponse).toHaveProperty('id')
  expect(orderResponse).toHaveProperty('status')
  expect(orderResponse.status).toBe('CREATED')
  
})

// Test to capture a PayPal payment with a mmock order.
test('simulate a payment capture from an order', async() => {
  const orderId = '100';
  const mockCapturePayment = jest 
    .spyOn(paypal, 'capturePayment')
    .mockResolvedValue({ status: 'COMPLETED' });
  const captureResponse = await paypal.capturePayment(orderId);
  expect(captureResponse).toHaveProperty('status', 'COMPLETED');
  mockCapturePayment.mockRestore();
})
