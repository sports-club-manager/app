import { expect, test } from "@playwright/test";

test("index page shows title and competitions", async ({ page }) => {
    await page.goto("http://scm.lvh.me:5173/");
    await expect(page).toHaveTitle(/SCM Test/);
    await expect(page.getByRole("heading", { name: "SCM Test" })).toBeVisible();

    // const u11 = page.getByRole("heading", { name: "All U11 Competitions" });
    // await expect(u11).toBeVisible();
    // u11.click();
});
