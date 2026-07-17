export async function register() {
  if (process.env.NEXT_RUNTIME === "nodejs") {
    // In production, boot up custom OpenTelemetry exporters here if configured
    // e.g. import('./otel-node')
  }
}
