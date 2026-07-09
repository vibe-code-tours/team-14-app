import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);
const FROM = process.env.EMAIL_FROM || "noreply@workervoice.example";

export async function sendVerificationEmail(to: string, verifyUrl: string) {
  await resend.emails.send({
    from: FROM,
    to,
    subject: "Verify your WorkerVoice account",
    html: `<p>Welcome to WorkerVoice. Click the link below to verify your email address:</p><p><a href="${verifyUrl}">${verifyUrl}</a></p><p>This link expires in 24 hours.</p>`,
  });
}

export async function sendPasswordResetEmail(to: string, resetUrl: string) {
  await resend.emails.send({
    from: FROM,
    to,
    subject: "Reset your WorkerVoice password",
    html: `<p>We received a request to reset your password. Click the link below to choose a new password:</p><p><a href="${resetUrl}">${resetUrl}</a></p><p>This link expires in 1 hour. If you did not request this, you can ignore this email.</p>`,
  });
}
