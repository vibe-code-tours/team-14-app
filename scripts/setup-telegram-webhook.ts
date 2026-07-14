/**
 * Setup Telegram Webhook
 *
 * Run this script to register your webhook with Telegram:
 * npx tsx scripts/setup-telegram-webhook.ts
 *
 * For Vercel:
 * NEXT_PUBLIC_SITE_URL=https://your-app.vercel.app npx tsx scripts/setup-telegram-webhook.ts
 *
 * For local (with ngrok):
 * npx tsx scripts/setup-telegram-webhook.ts https://abc123.ngrok.io
 */

import { config } from "dotenv";
import { setWebhook, getWebhookInfo, deleteWebhook } from "../lib/telegram";

// Load environment variables
config();

async function main() {
  const token = process.env.TELEGRAM_BOT_TOKEN;
  const secret = process.env.TELEGRAM_WEBHOOK_SECRET;
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

  if (!token || token === "your-telegram-bot-token") {
    console.error("❌ TELEGRAM_BOT_TOKEN is not configured");
    console.error("   Get a token from @BotFather on Telegram");
    console.error("   Add it to .env file");
    process.exit(1);
  }

  if (!secret || secret === "your-webhook-secret") {
    console.error("❌ TELEGRAM_WEBHOOK_SECRET is not configured");
    console.error("   Generate one with: openssl rand -hex 32");
    console.error("   Add it to .env file");
    process.exit(1);
  }

  // Determine webhook URL
  let webhookUrl: string;

  if (siteUrl.includes("localhost")) {
    // Local development - need to use ngrok or similar
    console.log("⚠️  Local development detected");
    console.log("   You need to expose your local server to the internet.");
    console.log("   Use ngrok: ngrok http 3000");
    console.log("   Then set NEXT_PUBLIC_SITE_URL to the ngrok URL\n");

    // Try to get from command line arg
    const ngrokUrl = process.argv[2];
    if (ngrokUrl) {
      webhookUrl = `${ngrokUrl}/api/telegram/webhook`;
    } else {
      console.error("❌ Please provide ngrok URL:");
      console.error("   npx tsx scripts/setup-telegram-webhook.ts https://abc123.ngrok.io");
      process.exit(1);
    }
  } else {
    webhookUrl = `${siteUrl}/api/telegram/webhook`;
  }

  console.log("🔧 Setting up Telegram webhook...\n");
  console.log(`   Webhook URL: ${webhookUrl}`);
  console.log(`   Site URL: ${siteUrl}\n`);

  // Check current webhook status
  console.log("📋 Current webhook status:");
  const currentInfo = await getWebhookInfo();
  if (currentInfo.ok && currentInfo.result) {
    console.log(`   URL: ${currentInfo.result.url || "Not set"}`);
    console.log(`   Custom certificate: ${currentInfo.result.has_custom_certificate}`);
  }
  console.log("");

  // Delete existing webhook if any
  console.log("🗑️  Clearing existing webhook...");
  await deleteWebhook();

  // Set new webhook
  console.log("🔗 Setting new webhook...");
  const result = await setWebhook(webhookUrl, secret);

  if (result.ok) {
    console.log("✅ Webhook set successfully!\n");

    // Verify
    console.log("📋 Verifying webhook...");
    const verifyInfo = await getWebhookInfo();
    if (verifyInfo.ok && verifyInfo.result) {
      console.log(`   URL: ${verifyInfo.result.url}`);
      console.log(`   Status: ${verifyInfo.result.url === webhookUrl ? "✅ Correct" : "❌ Mismatch"}`);
    }
  } else {
    console.error("❌ Failed to set webhook:");
    console.error(`   ${result.description}`);
    process.exit(1);
  }

  console.log("\n🎉 Setup complete!");
  console.log("\nNext steps:");
  console.log("1. Start your server: npm run dev (or deploy to Vercel)");
  console.log("2. Open Telegram and find your bot");
  console.log("3. Send /start to test");
  console.log("4. Send /lang to change language (English/Myanmar)");
}

main().catch(console.error);
