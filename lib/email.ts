import { Resend } from "resend";

let resend: Resend | null = null;

function getResendClient(): Resend {
  if (!resend) {
    resend = new Resend(process.env.RESEND_API_KEY);
  }
  return resend;
}

const FROM = process.env.EMAIL_FROM || "noreply@workervoice.example";

function getClient() {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) return null;
  return new Resend(apiKey);
}

export async function sendVerificationEmail(to: string, verifyUrl: string) {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    console.log(`[DEV] Skipping verification email. Verify URL: ${verifyUrl}`);
    return;
  }
  const { error } = await getResendClient().emails.send({
    from: FROM,
    to,
    subject: "Verify your WorkerVoice account",
    html: `<p>Welcome to WorkerVoice. Click the link below to verify your email address:</p><p><a href="${verifyUrl}">${verifyUrl}</a></p><p>This link expires in 24 hours.</p>`,
  });
  if (error) {
    console.error("Failed to send verification email:", error.message);
  }
}

export async function sendPasswordResetEmail(to: string, resetUrl: string) {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    console.log(`[DEV] Skipping password reset email. Reset URL: ${resetUrl}`);
    return;
  }
  const { error } = await getResendClient().emails.send({
    from: FROM,
    to,
    subject: "Reset your WorkerVoice password",
    html: `<p>We received a request to reset your password. Click the link below to choose a new password:</p><p><a href="${resetUrl}">${resetUrl}</a></p><p>This link expires in 1 hour. If you did not request this, you can ignore this email.</p>`,
  });
  if (error) {
    console.error("Failed to send password reset email:", error.message);
  }
}
