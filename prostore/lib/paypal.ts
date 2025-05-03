// gets the paypal sandbox
const base = process.env.PAYPAY_API_URL || "https://api-m.sandbox.paypal.com";

// create paypal order and capture payment
export const paypal = {}


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
    if(response.ok){
        const jsonData = await response.json();
        return jsonData.access_token;
    
    }else {
        const errorMessage = await response.text()
        throw new Error(errorMessage);
    }
}

export {generateAccessToken}