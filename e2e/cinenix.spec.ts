import { test, expect } from "@playwright/test";

const TS = Date.now();

// No console errors or page errors during the whole run.
// Expected 4xx responses (e.g. server validation failures on actions) are
// logged by Chrome as failed resources; only 5xx and real JS errors fail.
test.beforeEach(async ({ page }) => {
  const errors: string[] = [];
  page.on("console", (msg) => {
    if (msg.type() !== "error") return;
    const text = msg.text();
    if (/Failed to load resource: the server responded with a status of (4\d\d)/.test(text)) return;
    errors.push(text);
  });
  page.on("pageerror", (err) => errors.push(String(err)));
  (page as unknown as { __errors?: string[] }).__errors = errors;
});

test.afterEach(async ({ page }) => {
  const errors = (page as unknown as { __errors?: string[] }).__errors ?? [];
  expect(errors, `console/page errors: ${errors.join(" | ")}`).toEqual([]);
});

test("home page: SSG, title and islands hydrate (ThemeToggle load)", async ({ page }) => {
  await page.goto("/");
  await expect(page).toHaveTitle(/CineNix|Nix\.js Kit/);
  await expect(page.locator("h1")).toContainText("CineNix");
  // ThemeToggle island hydrated: clicking toggles data-theme on <html>.
  const themeBtn = page.getByRole("button", { name: /Cambiar tema/ });
  await expect(themeBtn).toBeVisible();
  const before = await page.evaluate(() => document.documentElement.getAttribute("data-theme"));
  await themeBtn.click();
  const after = await page.evaluate(() => document.documentElement.getAttribute("data-theme"));
  expect(after).not.toBe(before);
  // Persisted to localStorage + cookie.
  const stored = await page.evaluate(() => localStorage.getItem("cinenix-theme"));
  expect(stored).toBe(after);
});

test("catalog: SearchMovies island filters by query and genre", async ({ page }) => {
  await page.goto("/movies");
  await expect(page.locator(".movie-card")).toHaveCount(6);

  const search = page.getByPlaceholder(/Buscar por título/);
  await search.fill("parasite");
  await expect(page.locator(".movie-card")).toHaveCount(1);
  await expect(page.locator(".movie-card")).toContainText("Parasite");

  await search.fill("");
  await expect(page.locator(".movie-card")).toHaveCount(6);

  await page.getByRole("button", { name: "Sci-Fi", exact: true }).click();
  await expect(page.locator(".movie-card")).toHaveCount(3);
  await expect(page.locator(".movie-card h3")).toContainText(["Inception", "Mad Max"]);
});

test("SPA navigation: movie page loads without reload and title updates", async ({ page }) => {
  await page.goto("/movies");
  await page.locator('a[href="/movies/inception"]').first().click();
  await expect(page.locator("h1")).toContainText("Inception", { timeout: 10_000 });
  await expect(page).toHaveTitle(/Inception/);
  // Only the initial document load happened: SPA navigation uses history
  // pushState (same-document), which does not create a new navigation entry.
  expect(await page.evaluate(() => performance.getEntriesByType("navigation").length)).toBe(1);
});

test("movie page: like + rating islands work against the API", async ({ page }) => {
  await page.goto("/movies/inception");
  const likeBtn = page.getByRole("button", { name: /me gusta/i });
  await expect(likeBtn).toBeVisible();

  // Deterministic assertion: the button must reflect the API response.
  const [response] = await Promise.all([
    page.waitForResponse((r) => r.url().includes("/api/movies/inception/like") && r.request().method() === "POST"),
    likeBtn.click(),
  ]);
  expect(response.ok()).toBeTruthy();
  const { likes } = (await response.json()) as { likes: number };
  await expect(likeBtn).toHaveText(new RegExp(`${likes} me gusta`), { timeout: 10_000 });

  // RatingStars (visible): click the 4th star -> 4 filled stars.
  const stars = page.getByRole("radio");
  await expect(stars).toHaveCount(5);
  await stars.nth(3).click();
  await expect(page.locator('[role="radio"]').filter({ hasText: "★" })).toHaveCount(4, {
    timeout: 10_000,
  });
});

test("REVIEW PUBLISH: new review appears without a full reload", async ({ page }) => {
  await page.goto("/movies/inception");
  const reviewsBefore = await page.locator(".review-list .card").count();
  const author = `E2E-${TS}`;

  const form = page.locator("form").filter({ has: page.getByRole("heading", { name: "Deja tu reseña" }) });
  await expect(form).toBeVisible();
  await form.locator("#review-author").fill(author);
  await form.locator("#review-body").fill("Reseña publicada desde el navegador real e2e");
  await form.getByRole("button", { name: "Publicar reseña" }).click();

  // The page body re-renders with the fresh review (SPA-style, no reload).
  await expect(page.locator(".review-list .card").filter({ hasText: author })).toBeVisible({
    timeout: 10_000,
  });
  expect(await page.locator(".review-list .card").count()).toBeGreaterThan(reviewsBefore);
  await expect(page).toHaveURL(/reviewed=1/);
  // Only the initial document load happened (no full reload on publish).
  expect(await page.evaluate(() => performance.getEntriesByType("navigation").length)).toBe(1);
});

test("THEME PERSISTENCE: dark survives the register redirect", async ({ page }) => {
  // Simulate a returning user with the dark preference stored.
  await page.addInitScript(() => {
    try {
      localStorage.setItem("cinenix-theme", "dark");
      document.cookie = "theme=dark; Path=/";
    } catch {
      // ignore
    }
  });

  await page.goto("/register");
  // No-flash head script applies the theme before the bundle loads.
  await expect
    .poll(() => page.evaluate(() => document.documentElement.getAttribute("data-theme")))
    .toBe("dark");
  await expect(page.getByRole("button", { name: /Cambiar tema/ })).toBeVisible();

  // Fill and submit the register form (server action -> redirect to /movies).
  await page.locator("#register-name").fill(`User-${TS}`);
  await page.locator("#register-email").fill(`user${TS}@test.com`);
  await page.getByRole("button", { name: "Registrarme" }).click();

  // After the redirect the page must still be dark.
  await expect(page).toHaveURL(/movies\?registered=1/, { timeout: 10_000 });
  await expect
    .poll(() => page.evaluate(() => document.documentElement.getAttribute("data-theme")))
    .toBe("dark");
  await expect(page.getByRole("button", { name: /Cambiar tema/ })).toBeVisible();
  const bodyColor = await page.evaluate(() => getComputedStyle(document.body).backgroundColor);
  expect(bodyColor).toBe("rgb(15, 23, 42)"); // dark theme --bg
});

test("contact form: validation errors then success redirect (SPA)", async ({ page }) => {
  await page.goto("/contact");
  const form = page.locator("form");
  await expect(form).toBeVisible();

  // Invalid input -> server validation errors shown.
  await form.locator("#contact-name").fill("X");
  await form.locator("#contact-email").fill("malo");
  await form.locator("#contact-message").fill("corto");
  await form.getByRole("button", { name: "Enviar mensaje" }).click();
  await expect(page.locator(".form-error").first()).toBeVisible({ timeout: 10_000 });

  // Valid input -> redirect (SPA-style) to /contact?sent=1.
  await form.locator("#contact-name").fill(`E2E-${TS}`);
  await form.locator("#contact-email").fill(`e2e${TS}@test.com`);
  await form.locator("#contact-message").fill("Mensaje de prueba desde el navegador real");
  await form.getByRole("button", { name: "Enviar mensaje" }).click();
  await expect(page).toHaveURL(/contact\?sent=1/, { timeout: 10_000 });
});

test("docs catch-all and 404 page", async ({ page }) => {
  await page.goto("/docs/streaming");
  await expect(page.locator("h1")).toContainText("Streaming");
  await expect(page.locator("code")).toContainText("docs/streaming");

  await page.goto("/ruta-que-no-existe");
  await expect(page.locator("h1")).toContainText("404");
});

test("dynamic slug fallback + streaming shell for unknown movies", async ({ page }) => {
  await page.goto("/movies/slug-inventado-e2e");
  // Streaming shell paints first, then the real content arrives.
  await expect(page.locator("h1").filter({ hasText: "no encontrada" })).toBeVisible({
    timeout: 10_000,
  });
});
