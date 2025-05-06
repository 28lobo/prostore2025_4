// gets the PayPal sandbox (or live) base URL
const base = process.env.PAYPAL_API_URL || "https://api-m.sandbox.paypal.com";

export const paypal = {
  createOrder: async function createOrder(price: number) {
    const accessToken = await generateAccessToken();
    const url = `${base}/v2/checkout/orders`;

    // build the correct payload
    const body = JSON.stringify({
      intent: "CAPTURE",
      purchase_units: [
        {
          amount: {
            currency_code: "USD",
            // PayPal requires a string with 2 decimal places
            value: price.toFixed(2),
          },
        },
      ],
    });

    console.log("Creating PayPal order with payload:", body);

    const response = await fetch(url, {
      method: "POST",  // uppercase is conventional
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
      body,
    });

    return handleResponse(response);
  },

  capturePayment: async function capturePayment(orderId: string) {
    const accessToken = await generateAccessToken();
    const url = `${base}/v2/checkout/orders/${orderId}/capture`;

    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
    });

    return handleResponse(response);
  },
};

// …generateAccessToken() and handleResponse() stay the same…



// generate paypal access token

async function generateAccessToken () {
    // get client id and secret
    const {PAYPAL_CLIENT_ID, PAYPAL_APP_SECRET} = process.env;
    // Put client id and secret in base64
    const auth = Buffer.from(`${PAYPAL_CLIENT_ID}:${PAYPAL_APP_SECRET}`).toString("base64");
    // send the request in header to get the data from paypal
    const response = await fetch(`${base}/v1/oauth2/token`, {
        method: "POST",
        body: "grant_type=client_credentials",
        headers: {
            Authorization: `Basic ${auth}`,
            "Content-Type": "application/x-www-form-urlencoded",
        },
    });
    // check if response is true
    
        const jsonData = await handleResponse(response);
        return jsonData.access_token;
    
   
}

async function handleResponse(response: Response){
    if(response.ok){
        return response.json();
    }else {
        const errorMessage = await response.text();
        throw new Error(errorMessage);
    }
}

export {generateAccessToken}