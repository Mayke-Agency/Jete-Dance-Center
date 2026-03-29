import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed." });
  }

  const { firstName, lastName, email, message, websiteUrl, formStarted } =
    req.body || {};

  // Honeypot check
  if (websiteUrl) {
    return res.status(400).json({ error: "Spam detected." });
  }

  // Required fields
  if (!firstName || !lastName || !email || !message) {
    return res
      .status(400)
      .json({ error: "Please fill out all required fields." });
  }

  // Email validation
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailPattern.test(email)) {
    return res
      .status(400)
      .json({ error: "Please enter a valid email address." });
  }

  // Message validation
  if (message.trim().length < 10 || message.length > 5000) {
    return res.status(400).json({ error: "Please enter a valid message." });
  }

  // Timing check
  const started = Number(formStarted);
  const now = Date.now();

  if (!started || now - started < 3000) {
    return res.status(400).json({ error: "Form submitted too quickly." });
  }

  try {
    await resend.emails.send({
      from: "Jeté Dance Center <alan@maykeagency.com>",
      to: ["jetedancetx@gmail.com"], // ← change if needed
      subject: "New Contact Form Submission",
      reply_to: email,
      text: `
First Name: ${firstName}
Last Name: ${lastName}
Email: ${email}

Message:
${message}
      `,
    });

    return res.status(200).json({ success: true });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Failed to send message." });
  }
}
