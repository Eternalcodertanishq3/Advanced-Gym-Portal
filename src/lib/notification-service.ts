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
    } catch (error: any) {
      console.error("Email Service Error:", error);
      return { success: false, error: error.message };
    }
  },

  /**
   * Send an SMS (Twilio/Mock)
   */
  async sendSMS({ to, message }: SMSParams) {
    // Placeholder for Twilio/AWS SNS implementation
    console.log(`[SMS MOCK] To: ${to}, Message: ${message}`);
    return { success: true, provider: "Mock/Twilio Placeholder" };
  }
};
