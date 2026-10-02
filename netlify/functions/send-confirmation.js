exports.handler = async (event, context) => {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: JSON.stringify({ error: 'Method not allowed' }) };
  }

  try {
    const { to, orderId, items, total, shipping } = JSON.parse(event.body);

    if (!to || !orderId || !items || !total || !shipping) {
      return { statusCode: 400, body: JSON.stringify({ error: 'Missing required fields' }) };
    }

    const itemsHtml = items
      .map(
        (item) => `
        <tr>
          <td style="padding: 8px 0; border-bottom: 1px solid #eee;">${item.name}</td>
          <td style="padding: 8px 0; border-bottom: 1px solid #eee; text-align: center;">${item.quantity}</td>
          <td style="padding: 8px 0; border-bottom: 1px solid #eee; text-align: right;">₦${(item.price * item.quantity).toLocaleString()}</td>
        </tr>
      `
      )
      .join('');

    const html = `
      <!DOCTYPE html>
      <html>
      <head><meta charset="utf-8"></head>
      <body style="margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #f5f5f5;">
        <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff;">
          <div style="background-color: #E8531A; padding: 30px; text-align: center;">
            <h1 style="color: #ffffff; margin: 0; font-size: 28px;">P-ELLA Market</h1>
            <p style="color: #ffffff; margin: 5px 0 0; opacity: 0.9;">Fresh Groceries, Delivered with Love</p>
          </div>
          
          <div style="padding: 30px;">
            <h2 style="color: #1C1917; margin-top: 0;">Order Confirmed!</h2>
            <p style="color: #444;">Hi ${shipping.fullName},</p>
            <p style="color: #444;">Thank you for your order! We're preparing your fresh groceries with care.</p>
            
            <div style="background-color: #FFFBF5; border-radius: 8px; padding: 15px; margin: 20px 0;">
              <p style="margin: 0;"><strong>Order ID:</strong> ${orderId}</p>
              <p style="margin: 5px 0 0;"><strong>Date:</strong> ${new Date().toLocaleDateString('en-NG', { dateStyle: 'long' })}</p>
            </div>

            <table style="width: 100%; border-collapse: collapse; margin: 20px 0;">
              <thead>
                <tr style="background-color: #f8f8f8;">
                  <th style="padding: 10px; text-align: left; border-bottom: 2px solid #E8531A;">Item</th>
                  <th style="padding: 10px; text-align: center; border-bottom: 2px solid #E8531A;">Qty</th>
                  <th style="padding: 10px; text-align: right; border-bottom: 2px solid #E8531A;">Price</th>
                </tr>
              </thead>
              <tbody>${itemsHtml}</tbody>
            </table>

            <div style="text-align: right; margin: 20px 0;">
              <p style="margin: 5px 0;"><strong>Total: ₦${total.toLocaleString()}</strong></p>
            </div>

            <div style="background-color: #f8f8f8; border-radius: 8px; padding: 15px; margin: 20px 0;">
              <p style="margin: 0;"><strong>Delivery Address:</strong></p>
              <p style="margin: 5px 0 0; color: #444;">${shipping.address}, ${shipping.city}, ${shipping.state}</p>
            </div>

            <p style="color: #666; font-size: 14px;">We'll notify you when your order ships. If you have any questions, reply to this email.</p>
          </div>

          <div style="background-color: #1C1917; padding: 20px; text-align: center;">
            <p style="color: #999; margin: 0; font-size: 12px;">P-ELLA Market — Fresh Groceries, Delivered with Love</p>
            <p style="color: #666; margin: 5px 0 0; font-size: 11px;">Lagos, Nigeria</p>
          </div>
        </div>
      </body>
      </html>
    `;

    const formData = new URLSearchParams();
    formData.append('from', process.env.MAILGUN_FROM_EMAIL || 'P-ELLA Market <orders@pellamarket.com>');
    formData.append('to', to);
    formData.append('subject', `Order Confirmed — ${orderId}`);
    formData.append('html', html);

    const response = await fetch(
      `https://api.mailgun.net/v3/${process.env.MAILGUN_DOMAIN}/messages`,
      {
        method: 'POST',
        headers: {
          Authorization: `Basic ${Buffer.from(`api:${process.env.MAILGUN_API_KEY}`).toString('base64')}`,
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: formData.toString(),
      }
    );

    if (!response.ok) {
      const errText = await response.text();
      console.error('Mailgun error:', errText);
      return { statusCode: 500, body: JSON.stringify({ error: 'Failed to send email' }) };
    }

    return { statusCode: 200, body: JSON.stringify({ success: true }) };
  } catch (error) {
    console.error('Send confirmation error:', error);
    return { statusCode: 500, body: JSON.stringify({ error: 'Internal server error' }) };
  }
};
