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
import { bot, getSiteUrl } from "../lib/telegram";

// Load environment variables
config();

async function main() {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || getSiteUrl();
  const secretToken = process.env.TELEGRAM_WEBHOOK_SECRET;

  if (!secretToken) {
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
  const webhookInfo = await bot.api.getWebhookInfo();
  console.log(`   URL: ${webhookInfo.url || "Not set"}`);
  console.log(`   Pending updates: ${webhookInfo.pending_update_count}`);
  console.log("");

  // Delete existing webhook if any
  console.log("🗑️  Clearing existing webhook...");
  await bot.api.deleteWebhook();

  // Set new webhook with secret token
  console.log("🔗 Setting new webhook...");
  await bot.api.setWebhook(webhookUrl, {
    secret_token: secretToken,
    allowed_updates: ["message", "callback_query"],
  });

  // Verify
  console.log("📋 Verifying webhook...");
  const verifyInfo = await bot.api.getWebhookInfo();
  console.log(`   URL: ${verifyInfo.url}`);
  console.log(`   Status: ${verifyInfo.url === webhookUrl ? "✅ Correct" : "❌ Mismatch"}`);

  console.log("\n🎉 Setup complete!");
  console.log("\nNext steps:");
  console.log("1. Start your server: npm run dev (or deploy to Vercel)");
  console.log("2. Open Telegram and find your bot");
  console.log("3. Send /start to test");
  console.log("4. Send /lang to change language (English/Myanmar)");
}

main().catch(console.error);
