import nodemailer from "nodemailer";

export const sendEmail = async ({ to, bcc, subject, text }) => {
  // If BREVO_API_KEY is provided, bypass SMTP (to avoid Render free tier block) and use Brevo's HTTP API.
  if (process.env.BREVO_API_KEY) {
    const payload = {
      sender: {
        name: "Bislig iCenter",
        email: process.env.EMAIL_USER,
      },
      subject: subject,
      textContent: text,
      to: [],
    };

    if (to) {
      payload.to = typeof to === "string" ? [{ email: to }] : to.map((e) => ({ email: e }));
    }

    if (bcc && bcc.length > 0) {
      payload.bcc = bcc.map((e) => ({ email: e }));
      // Brevo API requires at least one "to" address, even if sending primarily via bcc.
      if (payload.to.length === 0) {
        payload.to = [{ email: process.env.EMAIL_USER }];
      }
    }

    try {
      const response = await fetch("https://api.brevo.com/v3/smtp/email", {
        method: "POST",
        headers: {
          "api-key": process.env.BREVO_API_KEY,
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorData = await response.text();
        console.error("Brevo API Error:", errorData);
        throw new Error(`Brevo HTTP API sending failed: ${response.statusText}`);
      }
      return await response.json();
    } catch (e) {
      console.error(e);
      throw e;
    }
  }

  // Fallback to Nodemailer over SMTP (for local dev or if using Google App Passwords)
  let transporter;
  if (process.env.SMTP_HOST) {
    transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: process.env.SMTP_PORT || 587,
      secure: process.env.SMTP_PORT == 465,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });
  } else {
    transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });
  }

  return await transporter.sendMail({
    from: `"Bislig iCenter" <${process.env.EMAIL_USER}>`,
    to: to,
    bcc: bcc,
    subject: subject,
    text: text,
  });
};
