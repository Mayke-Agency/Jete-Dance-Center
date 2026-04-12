import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed." });
  }

  const { firstName, lastName, email, message, websiteUrl, formStarted } =
    req.body || {};

  if (websiteUrl) {
    return res.status(400).json({ error: "Spam detected." });
  }

  if (!firstName || !lastName || !email || !message) {
    return res
      .status(400)
      .json({ error: "Please fill out all required fields." });
  }

  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailPattern.test(email)) {
    return res
      .status(400)
      .json({ error: "Please enter a valid email address." });
  }

  if (message.trim().length < 10 || message.length > 5000) {
    return res.status(400).json({ error: "Please enter a valid message." });
  }

  const started = Number(formStarted);
  const now = Date.now();

  if (!started || now - started < 3000) {
    return res.status(400).json({ error: "Form submitted too quickly." });
  }

  try {
    const data = await resend.emails.send({
      from: "Jeté Dance Center <onboarding@resend.dev>",
      to: ["jetedancetx@gmail.com"],
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

    return res.status(200).json({ success: true, data });
  } catch (error) {
    console.error("RESEND ERROR:", error);

    return res.status(500).json({
      error: error?.message || "Failed to send message.",
      details: error?.name || null,
    });
  }
}
