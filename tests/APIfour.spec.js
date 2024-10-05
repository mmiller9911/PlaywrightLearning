const { test, expect, request } = require("@playwright/test");
const {APIUtilities} = require ("/PlayWrightAutomation/Utilities/APIUtilities")

test("Security intercept", async ({ page }) => {
  const products = page.locator(".card-body");
  const productName = "IPHONE 13 PRO";
  await page.goto("https://rahulshettyacademy.com/client");
  await page.locator("#userEmail").fill("mmiller9911@gmail.com");
  await page.locator("#userPassword").fill("2&3gr0gTDWaz");
  await page.locator("#login").click();
  await page.waitForLoadState("networkidle");
  await page.locator(".card-body b").first().waitFor();
  await page.locator("button[routerlink*='myorders']").click();

  await page.route(
    "https://rahulshettyacademy.com/api/ecom/order/get-orders-details?id=*",
    (route) =>
      route.continue({
        url: "https://rahulshettyacademy.com/api/ecom/order/get-orders-details?id=555666111",
      })
  );

  await page.locator("button:has-text('View')").first().click();
  await expect(page.locator("p").last()).toHaveText(
    "You are not authorize to view this order"
  );
  //await page.pause();
});
test("Block requests", async ({ page }) => {
  //await page.route("**/*.css",route=>route.abort());
  await page.route("**/*.{jpg,gif,jpeg}", (route) => route.abort());
  const userName = page.locator("#username");
  const password = page.locator("#password");
  const signInButton = page.locator("#signInBtn");
  const errorMessage = page.locator("[style*='block']");
  const itemTitles = page.locator(".card-body a");

  await page.goto("https://rahulshettyacademy.com/loginpagePractise/");
  await expect(page).toHaveTitle("LoginPage Practise | Rahul Shetty Academy");
  await userName.fill("rahulshettyacademy");
  await password.fill("wrongpassword");
  await signInButton.click();
  console.log(await errorMessage.textContent());
  await expect(errorMessage).toContainText("Incorrect username/password.");
  await userName.fill("rahulshettyacademy");
  await password.fill("learning");
  await signInButton.click();
  //page.on("request",request=>console.log(request.url()));
  page.on("response", (response) =>
    console.log(response.url(), response.status())
  );
  await expect(page).toHaveTitle("ProtoCommerce");
  console.log(await page.locator(".card-body a").first().textContent());
  console.log(await page.locator(".card-body a").nth(0).textContent());
  console.log(await page.locator(".card-body a").nth(1).textContent());
  console.log(await page.locator(".card-body a").last().textContent());
  console.log(await itemTitles.allTextContents());
  await page.pause();
});
test("Screenshots", async ({ page }) => {
  const userName = page.locator("#username");
  const password = page.locator("#password");
  const signInButton = page.locator("#signInBtn");

  await page.goto("https://rahulshettyacademy.com/loginpagePractise/");
  await expect(page).toHaveTitle("LoginPage Practise | Rahul Shetty Academy");
  await userName.fill("rahulshettyacademy");
  await page
    .locator("label.text-white")
    .first()
    .screenshot({ path: "screenshot1.png" });
  await password.fill("learning");
  await signInButton.click();
  await page.screenshot({ path: "screenshot.png" });
  await expect(page).toHaveTitle("ProtoCommerce");
  //await page.pause();
});
test("Visual testing", async ({ page }) => {
  await page.goto("https://rahulshettyacademy.com/loginpagePractise/");
  expect(await page.screenshot()).toMatchSnapshot("login.png");
});
