import nodemailer from "nodemailer";

/**
 * Sends an "Out for Delivery" notification email to the customer.
 * The message differs based on the payment method:
 *  - COD:    asks the customer to prepare the exact amount.
 *  - PayPal: informs the customer that their paid order is on the way.
 *
 * @param {Object} order - The Mongoose Order document
 */
export const sendOutForDeliveryEmail = async (order) => {
  const { orderNumber, customer, paymentMethod } = order;

  let subject, text;

  if (paymentMethod === "cod") {
    subject = `Your Order ${orderNumber} is Out for Delivery`;
    text =
      `Hi ${customer.name},\n\n` +
      `Your COD order ${orderNumber} is out for delivery. ` +
      `Please prepare the exact amount to pay upon receiving your package.\n\n` +
      `Thank you for shopping with Bislig iCenter!\n\n` +
      `— The Bislig iCenter Team`;
  } else {
    // paypal (already paid)
    subject = `Your Order ${orderNumber} is Out for Delivery`;
    text =
      `Hi ${customer.name},\n\n` +
      `Your paid order ${orderNumber} is out for delivery. ` +
      `Please wait for the delivery rider to arrive and claim your package.\n\n` +
      `Thank you for shopping with Bislig iCenter!\n\n` +
      `— The Bislig iCenter Team`;
  }

  return sendEmail({ to: customer.email, subject, text });
};

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
