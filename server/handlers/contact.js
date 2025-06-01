const sgMail = require("@sendgrid/mail");
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

async function contact(req, res) {
  const { name, email, message } = req.body;

  if (!name || !email || !message) {
    return res.status(400).json({ error: "All fields are required." });
  }

  const msg = {
    to: process.env.CONTACT_RECEIVER_EMAIL, // verified sender
    from: process.env.CONTACT_RECEIVER_EMAIL, // must match verified sender
    replyTo: email, // the user who submitted the form
    subject: `New contact message from ${name}`,
    text: message,
    html: `
      <p><strong>Name:</strong> ${name}</p>
      <p><strong>Email:</strong> ${email}</p>
      <p><strong>Message:</strong><br>${message}</p>
    `,
  };

  try {
    await sgMail.send(msg);
    res.status(200).json({ message: "Message sent successfully!" });
  } catch (error) {
    console.error("SendGrid error:", error.response?.body || error.message);
    res.status(500).json({ error: "Failed to send message." });
  }
}

module.exports = contact;
