import Newsletter from "../models/Newsletter.js";
import { sendEmail } from "../utils/emailService.js";

export const subscribe = async (req, res, next) => {
  try {
    const { email } = req.body;
    if (!email) {
      return res.status(400).json({ message: "Email is required" });
    }

    const existing = await Newsletter.findOne({ email });
    if (existing) {
      return res.status(409).json({ message: "You are already subscribed to the newsletter!" });
    }

    await Newsletter.create({ email });
    res.status(201).json({ message: "Successfully subscribed to the newsletter!" });
  } catch (err) {
    next(err);
  }
};

export const getSubscribers = async (req, res, next) => {
  try {
    const subscribers = await Newsletter.find().sort({ subscribedAt: -1 });
    res.json(subscribers);
  } catch (err) {
    next(err);
  }
};

export const sendNewsletter = async (req, res, next) => {
  try {
    const { subject, message } = req.body;
    if (!subject || !message) {
      return res.status(400).json({ message: "Subject and message are required" });
    }

    const subscribers = await Newsletter.find();
    if (subscribers.length === 0) {
      return res.status(404).json({ message: "No subscribers found to send to" });
    }

    const hasValidEmailConfig =
      (process.env.EMAIL_USER && process.env.EMAIL_PASS && process.env.EMAIL_USER !== 'your-email@gmail.com') ||
      process.env.BREVO_API_KEY;

    if (!hasValidEmailConfig) {
      console.log(`[DEV MODE] Would send newsletter "${subject}" to ${subscribers.length} subscribers.`);
      return res.status(200).json({ message: "Emails skipped in DEV mode (Invalid email Config). Check console." });
    }

    // Extract emails manually
    const emails = subscribers.map(sub => sub.email);

    // Send emails in batches or all together via Bcc
    await sendEmail({
      bcc: emails,
      subject: subject,
      text: message,
    });

    res.status(200).json({ message: `Newsletter sent successfully to ${emails.length} subscribers!` });
  } catch (err) {
    next(err);
  }
};
