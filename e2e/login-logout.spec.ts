import { test, expect } from "@playwright/test";
import { E2E_USER } from "./fixtures";

async function gotoLoginReady(page: import("@playwright/test").Page) {
  await page.goto("/login");
  // The dev server can be slow to hydrate; wait for the initial session
  // check to settle so the submit handler is actually attached before we
  // interact with the form (otherwise the click can be a no-op).
  await page.waitForLoadState("networkidle");
}

test.describe("Login and logout", () => {
  test("worker can log in with valid credentials and log out", async ({
    page,
  }) => {
    await gotoLoginReady(page);

    await expect(page.getByRole("heading", { name: "Log in" })).toBeVisible();

    const form = page.locator("form");
    await form.locator('input[type="email"]').fill(E2E_USER.email);
    await form.locator('input[type="password"]').fill(E2E_USER.password);
    await form.getByRole("button", { name: "Log in" }).click();

    // A successful login redirects away from /login to the homepage.
    await expect(page).toHaveURL("/");
    await expect(page.getByRole("button", { name: "Log out" })).toBeVisible();

    await page.getByRole("button", { name: "Log out" }).click();

    await expect(page.getByRole("link", { name: "Log in" })).toBeVisible();
  });

  test("shows an error for invalid credentials", async ({ page }) => {
    await gotoLoginReady(page);

    const form = page.locator("form");
    await form.locator('input[type="email"]').fill(E2E_USER.email);
    await form.locator('input[type="password"]').fill("wrong-password");
    await form.getByRole("button", { name: "Log in" }).click();

    await expect(page.getByText(/invalid email or password/i)).toBeVisible();
    await expect(page).toHaveURL(/\/login/);
  });

  test("navigates to register from the login page", async ({ page }) => {
    await gotoLoginReady(page);
    await page.getByRole("link", { name: "Create one" }).click();
    await expect(page).toHaveURL(/\/register/);
  });
});
