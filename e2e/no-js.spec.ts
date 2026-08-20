import { test, expect } from "@playwright/test";

// No-JS fallback: functional static/SSR content without JavaScript
// (progressive enhancement, audit §6.5 / §12.2).
test.use({ javaScriptEnabled: false });

test("home renders without JS", async ({ page }) => {
  await page.goto("/");
  await expect(page.locator("h1").first()).toContainText("CineNix");
});

test("catalog renders without JS", async ({ page }) => {
  await page.goto("/movies");
  await expect(page.locator(".movie-card").first()).toBeVisible();
  await expect(page.locator(".movie-card").first()).toContainText("Inception");
});

test("movie page renders without JS", async ({ page }) => {
  await page.goto("/movies/inception");
  await expect(page.locator("h1").first()).toContainText("Inception");
});

test("docs renders without JS", async ({ page }) => {
  await page.goto("/docs/streaming");
  await expect(page.locator("h1").first()).toContainText("Streaming");
});

test("404 renders without JS", async ({ page }) => {
  const response = await page.goto("/ruta-que-no-existe");
  expect(response?.status()).toBe(404);
});
