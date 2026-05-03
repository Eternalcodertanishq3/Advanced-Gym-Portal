import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

interface EmailParams {
  to: string;
  subject: string;
  html: string;
}

interface SMSParams {
  to: string;
  message: string;
}

/**
 * 🦅 EAGLE GYM — Notification Hub
 * Centralized service for Email and SMS delivery.
 */
export const NotificationService = {
  /**
   * Send an Email via Resend
   */
  async sendEmail({ to, subject, html }: EmailParams) {
    if (!process.env.RESEND_API_KEY) {
      console.warn("RESEND_API_KEY not found. Email suppressed.");
      return { success: false, error: "API Key missing" };
    }

    try {
      const { data, error } = await resend.emails.send({
        from: "Eagle Gym <notifications@eaglegym.com>",
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
    
    // Logic for real implementation would go here:
    // const client = require('twilio')(sid, auth);
    // await client.messages.create({ body: message, from: '+12345', to });

    return { success: true, provider: "Mock/Twilio Placeholder" };
  }
};
