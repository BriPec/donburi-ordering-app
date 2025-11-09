import { Resend } from "resend";

export default async function handler(req, res) {
  try {
    const {
      customer_name,
      contact_number,
      delivery_address,
      payment_method,
      item_summary,
      total,
      proof_url,
    } = req.body;

    const resend = new Resend(process.env.RESEND_API_KEY);

    await resend.emails.send({
      from: "Ogata Ya San Orders <onboarding@resend.dev>",
      to: "brigittepecundo@gmail.com",
      subject: `New Order from ${customer_name}`,
      html: `
        <h2 style="color:#ff7a00;">New Order Received!</h2>
        <p><strong>👤 Name:</strong> ${customer_name}</p>
        <p><strong>📞 Contact:</strong> ${contact_number}</p>
        <p><strong>📍 Address:</strong> ${delivery_address}</p>
        <p><strong>💳 Payment:</strong> ${payment_method}</p>
        <h3>🧾 Items Ordered:</h3>
        <pre style="background:#fff6eb; border-left:4px solid #ff7a00; padding:10px;">${item_summary}</pre>
        <p><strong>💰 Total:</strong> ₱${(total / 100).toFixed(2)}</p>
        ${
          proof_url
            ? `<p><strong>📸 Proof:</strong> <a href="${proof_url}">${proof_url}</a></p>`
            : ""
        }
        <p style="margin-top:16px; color:#888;">Sent automatically from Ogata Ya San Ordering App 🍙</p>
      `,
    });

    res.status(200).json({ message: "Email sent successfully!" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
}
