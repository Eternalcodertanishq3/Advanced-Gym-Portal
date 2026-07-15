import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

interface EmailParams {
  to: string;
  subject: string;
  html: string;
  fromName?: string;
}

interface SMSParams {
  to: string;
  message: string;
}

/**
 * 🦅 GymFlow SaaS — Notification Hub
 * Centralized service for Email and SMS delivery.
 */
export const NotificationService = {
  /**
   * Send an Email via Resend
   */
  async sendEmail({ to, subject, html, fromName }: EmailParams) {
    if (!process.env.RESEND_API_KEY) {
      console.warn("RESEND_API_KEY not found. Email suppressed.");
      return { success: false, error: "API Key missing" };
    }

    try {
      const displayName = fromName || "GymFlow SaaS";
      // Using a test resend email domain or configuration value
      const fromEmail = process.env.RESEND_FROM_EMAIL || "notifications@gymflow.saas";
      const fromAddress = `${displayName} <${fromEmail}>`;

      const { data, error } = await resend.emails.send({
        from: fromAddress,
        to: [to],
        subject,
        html,
      });

      if (error) {
        console.error("Resend Error:", error);
        return { success: false, error };
      }

      return { success: true, data };
    } catch (error: unknown) {
      console.error("Email Service Error:", error);
      return { success: false, error: error instanceof Error ? error.message : String(error) };
    }
  },

  /**
   * Send an SMS (via Twilio API)
   */
  async sendSMS({ to, message }: SMSParams) {
    const accountSid = process.env.TWILIO_ACCOUNT_SID;
    const authToken = process.env.TWILIO_AUTH_TOKEN;
    const fromNumber = process.env.TWILIO_PHONE_NUMBER;

    if (!accountSid || !authToken || !fromNumber) {
      console.warn("Twilio credentials missing. SMS suppressed.");
      return { success: false, error: "Twilio credentials missing" };
    }

    try {
      const response = await fetch(
        `https://api.twilio.com/2010-04-01/Accounts/${accountSid}/Messages.json`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
            Authorization: `Basic ${Buffer.from(`${accountSid}:${authToken}`).toString("base64")}`,
          },
          body: new URLSearchParams({
            To: to,
            From: fromNumber,
            Body: message,
          }).toString(),
        },
      );

      const data = await response.json();

      if (!response.ok) {
        console.error("Twilio Error:", data);
        return { success: false, error: data.message || "Failed to send SMS" };
      }

      return { success: true, data };
    } catch (error: unknown) {
      console.error("SMS Service Error:", error);
      return { success: false, error: error instanceof Error ? error.message : String(error) };
    }
  },
};
