// /api/create-checkout-session.js
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY); // Ensure this is your test secret key

export default async function handler(req, res) {
  const YOUR_DOMAIN = "https://lawscout.co.uk"; // Replace with your custom domain

  try {
    // Create a Stripe Checkout session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency: "usd",
            product_data: {
              name: "Premium LawScout Report",
            },
            unit_amount: 999, // Amount in cents (e.g., 999 = $9.99)
          },
          quantity: 1,
        },
      ],
      mode: "payment",
      success_url: `${YOUR_DOMAIN}/report.html?session_id={CHECKOUT_SESSION_ID}`, // Redirect to the success page after payment
      cancel_url: `${YOUR_DOMAIN}/cancel.html`, // If the user cancels payment
    });

    // Send the session ID to the frontend
    res.status(200).json({ id: session.id });
  } catch (error) {
    console.error("Error creating Stripe checkout session:", error);
    res.status(500).json({ error: "Internal server error" });
  }
}
