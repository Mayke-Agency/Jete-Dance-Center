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
    return res.status(200).json({ success: true });
  } catch (error) {
    return res.status(500).json({ error: "Failed to send message." });
  }
}
