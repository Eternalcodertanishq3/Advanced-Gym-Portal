import { Resend } from "resend";
import nodemailer from "nodemailer";

const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null;

const smtpTransporter = process.env.SMTP_HOST
  ? nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: parseInt(process.env.SMTP_PORT || "587"),
      secure: process.env.SMTP_SECURE === "true",
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    })
  : null;

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
    const displayName = fromName || "GymFlow SaaS";
    const fromEmail =
      process.env.RESEND_FROM_EMAIL || process.env.SMTP_FROM_EMAIL || "notifications@gymflow.saas";
    const fromAddress = `${displayName} <${fromEmail}>`;

    // 1. Primary: Use Resend if API Key is configured
    if (resend) {
      try {
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
        console.error("Email Service Error (Resend):", error);
        return { success: false, error: error instanceof Error ? error.message : String(error) };
      }
    }

    // 2. Secondary: Fallback to standard SMTP if SMTP server is configured
    if (smtpTransporter) {
      try {
        await smtpTransporter.sendMail({
          from: fromAddress,
          to,
          subject,
          html,
        });
        return { success: true, data: { provider: "SMTP" } };
      } catch (error: unknown) {
        console.error("Email Service Error (SMTP):", error);
        return { success: false, error: error instanceof Error ? error.message : String(error) };
      }
    }

    // 3. Fallback: Log email details to console to prevent hard failures in local dev
    console.warn(
      `🦅 GymFlow Email Log (No Email Providers Configured):\n` +
        `From: ${fromAddress}\n` +
        `To: ${to}\n` +
        `Subject: ${subject}\n` +
        `Body: ${html.slice(0, 200)}...\n`,
    );
    return { success: true, data: { provider: "STUB_CONSOLE" } };
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
