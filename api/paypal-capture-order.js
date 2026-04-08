export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { orderID } = req.body || {};

  if (!orderID) {
    return res.status(400).json({ error: "Missing orderID" });
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

    const captureRes = await fetch(
      `${process.env.PAYPAL_BASE_URL}/v2/checkout/orders/${orderID}/capture`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
      }
    );

    const captureData = await captureRes.json();

    if (captureData.status !== "COMPLETED") {
      return res.status(500).json({ error: "Payment not completed", details: captureData });
    }

    return res.status(200).json({ success: true, details: captureData });
  } catch (error) {
    console.error("PayPal capture error:", error);
    return res.status(500).json({ error: "Server error capturing PayPal order" });
  }
}
