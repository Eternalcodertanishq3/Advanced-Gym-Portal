export const EmailTemplates = {
  WELCOME: (name: string) => ({
    subject: "Welcome to Eagle Gym!",
    body: `Hi ${name},\n\nWelcome to Eagle Gym! We are excited to have you.\n\nRegards,\nEagle Gym Team`
  }),
  PAYMENT_REMINDER: (name: string, amount: string) => ({
    subject: "Payment Reminder - Eagle Gym",
    body: `Hi ${name},\n\nThis is a reminder that a payment of ${amount} is due.\n\nRegards,\nEagle Gym Team`
  })
};

