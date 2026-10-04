const admin = require("firebase-admin");
const { handler: sendConfirmation } = require("./send-confirmation");

if (!admin.apps?.length) {
  admin.initializeApp({
    credential: admin.credential.cert({
      projectId: process.env.FIREBASE_PROJECT_ID,
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, "\n"),
    }),
  });
}

const db = admin.firestore();

const CORS_HEADERS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "Content-Type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

exports.handler = async (event, context) => {
  // CORS preflight from the Android app (cross-origin JSON POST)
  if (event.httpMethod === "OPTIONS") {
    return {
      statusCode: 204,
      headers: CORS_HEADERS,
      body: "",
    };
  }

  if (event.httpMethod !== "POST") {
    return {
      statusCode: 405,
      headers: CORS_HEADERS,
      body: JSON.stringify({ error: "Method not allowed" }),
    };
  }

  try {
    const { reference, cartItems, shipping, total, userId } = JSON.parse(
      event.body,
    );

    if (!reference || !cartItems || !shipping || !total || !userId) {
      return {
      statusCode: 400,
      headers: CORS_HEADERS,
      body: JSON.stringify({ error: "Missing required fields" }),
      };
    }

    const paystackResponse = await fetch(
      `https://api.paystack.co/transaction/verify/${reference}`,
      {
        headers: {
          Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
        },
      },
    );

    const paystackData = await paystackResponse.json();

    if (!paystackData.status || paystackData.data.status !== "success") {
      return {
      statusCode: 400,
      headers: CORS_HEADERS,
      body: JSON.stringify({ error: "Payment verification failed" }),
      };
    }

    if (paystackData.data.amount !== total * 100) {
      return {
      statusCode: 400,
      headers: CORS_HEADERS,
      body: JSON.stringify({ error: "Payment amount mismatch" }),
      };
    }

    const orderId = `PELLA-${Date.now().toString(36).toUpperCase().slice(-4)}`;

    const orderData = {
      id: orderId,
      userId,
      items: cartItems,
      shipping,
      subtotal: total - (total >= 15000 ? 0 : 100),
      deliveryFee: total >= 15000 ? 0 : 100,
      total,
      paystackReference: reference,
      status: "paid",
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
    };

    await db.collection("orders").doc(orderId).set(orderData);

    try {
      const emailRes = await sendConfirmation(
        {
          httpMethod: "POST",
          body: JSON.stringify({
            to: shipping.email,
            orderId,
            items: cartItems,
            total,
            shipping,
          }),
        },
        {},
      );
      console.log("Confirmation email status:", emailRes.statusCode, emailRes.body);
    } catch (emailErr) {
      console.log("Email sending failed:", emailErr.message);
    }

    return {
      statusCode: 200,
      headers: CORS_HEADERS,
      body: JSON.stringify({ success: true, orderId }),
    };
  } catch (error) {
    console.error("Process order error:", error);
    return {
      statusCode: 500,
      headers: CORS_HEADERS,
      body: JSON.stringify({ error: "Internal server error" }),
    };
  }
};
