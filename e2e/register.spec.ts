import { test, expect } from "@playwright/test";
import { E2E_USER } from "./fixtures";

async function gotoRegisterReady(page: import("@playwright/test").Page) {
  await page.goto("/register");
  // The dev server can be slow to hydrate; wait for the page to settle so
  // the submit handler is actually attached before we interact with the form.
  await page.waitForLoadState("networkidle");
}

test.describe("Registration", () => {
  test("worker can create an account and is prompted to verify email", async ({
    page,
  }) => {
    const uniqueEmail = `e2e-register-${Date.now()}@workervoice.test`;

    await gotoRegisterReady(page);

    await expect(
      page.getByRole("heading", { name: "Create an account" })
    ).toBeVisible();

    const form = page.locator("form");
    await form.locator("input").first().fill("New Worker");
    await form.locator('input[type="email"]').fill(uniqueEmail);
    await form.locator('input[type="password"]').fill("a-strong-password");

    await form.getByRole("button", { name: "Create account" }).click();

    await expect(page.getByText("Check your email to verify")).toBeVisible();
  });

  test("shows an error for a duplicate email", async ({ page }) => {
    // Relies on the seeded E2E user (prisma/seed-e2e.ts) already existing.
    await gotoRegisterReady(page);

    const form = page.locator("form");
    await form.locator("input").first().fill("Duplicate Worker");
    await form.locator('input[type="email"]').fill(E2E_USER.email);
    await form.locator('input[type="password"]').fill("a-strong-password");

    await form.getByRole("button", { name: "Create account" }).click();

    await expect(page.getByText(/already exists/i)).toBeVisible();
  });

  test("navigates to login from the register page", async ({ page }) => {
    await gotoRegisterReady(page);
    await page
      .locator("main")
      .getByRole("link", { name: "Log in" })
      .click();
    await expect(page).toHaveURL(/\/login/);
  });
});
