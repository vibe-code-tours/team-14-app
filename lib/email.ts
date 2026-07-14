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

export async function sendContactEmail({
  name,
  email,
  subject,
  message,
}: {
  name: string;
  email: string;
  subject: string;
  message: string;
}) {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    console.log(
      `[DEV] Skipping contact email. From: ${name} <${email}>, Subject: ${subject}`
    );
    return;
  }

  const toAddress = process.env.CONTACT_EMAIL_TO || "support@workervoice.example";

  const { error } = await getResendClient().emails.send({
    from: FROM,
    to: toAddress,
    replyTo: email,
    subject: `[WorkerVoice Contact] ${subject}`,
    html: `
      <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #059669;">New Contact Form Submission</h2>
        <table style="width: 100%; border-collapse: collapse;">
          <tr>
            <td style="padding: 8px 0; font-weight: bold; color: #64748b; width: 120px;">Name</td>
            <td style="padding: 8px 0; color: #1e293b;">${name}</td>
          </tr>
          <tr>
            <td style="padding: 8px 0; font-weight: bold; color: #64748b;">Email</td>
            <td style="padding: 8px 0; color: #1e293b;"><a href="mailto:${email}">${email}</a></td>
          </tr>
          <tr>
            <td style="padding: 8px 0; font-weight: bold; color: #64748b;">Subject</td>
            <td style="padding: 8px 0; color: #1e293b;">${subject}</td>
          </tr>
          <tr>
            <td style="padding: 8px 0; font-weight: bold; color: #64748b; vertical-align: top;">Message</td>
            <td style="padding: 8px 0; color: #1e293b; white-space: pre-wrap;">${message}</td>
          </tr>
        </table>
        <hr style="border: none; border-top: 1px solid #e2e8f0; margin: 16px 0;" />
        <p style="font-size: 12px; color: #94a3b8;">Sent from WorkerVoice contact form</p>
      </div>
    `,
  });

  if (error) {
    console.error("Failed to send contact email:", error.message);
  }
}

export async function sendAdminCredentialsEmail(
  to: string,
  fullName: string,
  password: string,
  loginUrl: string
) {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    console.log(
      `[DEV] Skipping admin credentials email. To: ${to}, Password: ${password}, Login: ${loginUrl}`
    );
    return;
  }
  const { error } = await getResendClient().emails.send({
    from: FROM,
    to,
    subject: "Your WorkerVoice Admin Account",
    html: `
      <p>Hi ${fullName},</p>
      <p>An admin account has been created for you on WorkerVoice.</p>
      <p><strong>Login credentials:</strong></p>
      <p>Email: ${to}<br/>Password: ${password}</p>
      <p><a href="${loginUrl}">Click here to login</a></p>
      <p>Please change your password after your first login for security.</p>
    `,
  });
  if (error) {
    console.error("Failed to send admin credentials email:", error.message);
  }
}
