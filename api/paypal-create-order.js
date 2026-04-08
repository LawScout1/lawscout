export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const auth = Buffer.from(
      `${process.env.PAYPAL_CLIENT_ID}:${process.env.PAYPAL_CLIENT_SECRET}`
    ).toString("base64");

    const accessTokenRes = await fetch(`${process.env.PAYPAL_BASE_URL}/v1/oauth2/token`, {
      method: "POST",
      headers: {
        Authorization: `Basic ${auth}`,
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: "grant_type=client_credentials",
    });

    const accessTokenData = await accessTokenRes.json();
    const accessToken = accessTokenData.access_token;

    if (!accessToken) {
      return res.status(500).json({ error: "Failed to get PayPal access token", details: accessTokenData });
    }

    const orderRes = await fetch(`${process.env.PAYPAL_BASE_URL}/v2/checkout/orders`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        intent: "CAPTURE",
        purchase_units: [
          {
            amount: {
              currency_code: "GBP",
              value: "9.99",
            },
            description: "LawScout Premium Legal Report",
          },
        ],
      }),
    });

    const orderData = await orderRes.json();

    if (!orderData.id) {
      return res.status(500).json({ error: "Failed to create PayPal order", details: orderData });
    }

    return res.status(200).json({ id: orderData.id });
  } catch (error) {
    console.error("PayPal create order error:", error);
    return res.status(500).json({ error: "Server error creating PayPal order" });
  }
}
