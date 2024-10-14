import {test,expect} from '@playwright/test';
import { POManager } from '../Pages_Typescript/POManager';
const dataset = JSON.parse(JSON.stringify(require("../JSONdata/ClientAppPO.json")));
 
for(const data of dataset)
{

test(`Getting Data from JSON files ${data.productName}`, async ({ page }) => {
  const poManager = new POManager(page);
  const loginPage = poManager.getLoginPage();
  await loginPage.goTo();
  await loginPage.validLogin(data.username, data.password);
  const dashboardPage = poManager.getDashboardPage();
  await dashboardPage.searchProductAddCart(data.productName);
  await dashboardPage.navigateToCart();

  const cartPage = poManager.getCartPage();
  await cartPage.VerifyProductIsDisplayed(data.productName);
  await cartPage.Checkout();

  const ordersReviewPage = poManager.getOrdersReviewPage();
  await ordersReviewPage.searchCountryAndSelect("ind", "India");
  let orderId:any;
  orderId = await ordersReviewPage.SubmitAndGetOrderId();
  console.log(orderId);
  await dashboardPage.navigateToOrders();
  const ordersHistoryPage = poManager.getOrdersHistoryPage();
  await ordersHistoryPage.searchOrderAndSelect(orderId);
  expect(orderId.includes(await ordersHistoryPage.getOrderId())).toBeTruthy();


})};
test('Log in to FULL Salesforce environment',async({page})=>
  {
      await page.goto("https://test.salesforce.com/");
      await expect(page).toHaveTitle("Login | Salesforce");
      await page.locator("#username").fill("");
      await page.locator("#password").fill("");
      await page.locator("#Login").click();
      //await page.pause();
})
test('Fail to Log in to Shetty academy',async({page})=>
  {
      //await page.pause();
      const userName = page.locator("#username");
      const password = page.locator("#password");
      const signInButton = page.locator("#signInBtn");
      const errorMessage = page.locator("[style*='block']")
      const itemTitles = page.locator(".card-body a")
  
      await page.goto("https://rahulshettyacademy.com/loginpagePractise/");
      await expect(page).toHaveTitle("LoginPage Practise | Rahul Shetty Academy");
      await userName.fill("rahulshettyacademy");
      await password.fill("wrongpassword");
      await signInButton.click();
      console.log(await errorMessage.textContent())
      await expect(errorMessage).toContainText('Incorrect username/password.')
      await userName.fill("rahulshettyacademy");
      await password.fill("learning");
      await signInButton.click();
      await expect(page).toHaveTitle("ProtoCommerce");
      console.log(await page.locator(".card-body a").first().textContent());
      console.log(await page.locator(".card-body a").nth(0).textContent());
      console.log(await page.locator(".card-body a").nth(1).textContent());
      console.log(await page.locator(".card-body a").last().textContent());
      console.log(await itemTitles.allTextContents());
})
test('Selector Dropdown list',async({page})=>
  {
      const userName = page.locator("#username");
      const dropdown = page.locator("select.form-control");
  
      await page.goto("https://rahulshettyacademy.com/loginpagePractise/");
      await userName.fill("rahulshettyacademy");
      await page.locator("#password").fill("learning");

      await dropdown.selectOption("consult");
      await page.locator(".radiotextsty").last().click();
      await page.locator("#okayBtn").click();
      await expect(page.locator(".radiotextsty").last()).toBeChecked();
      console.log(await page.locator(".radiotextsty").last().isChecked())
      await page.locator("#terms").click();
      await expect(page.locator("#terms").last()).toBeChecked();
      await page.locator("#terms").uncheck();
      expect(await page.locator("#terms").isChecked()).toBeFalsy();
      //await page.pause();
})
test('Check attribute of element',async({page})=>
  {
  const blinkingText = page.locator("[href*='documents-request']");
  await page.goto("https://rahulshettyacademy.com/loginpagePractise/");
  await expect(blinkingText).toHaveAttribute("class","blinkingText");
})
test('Child Windows',async({browser})=>
  {
  const context = await browser.newContext();
  const pageOne = await context.newPage();    

  const blinkingText = pageOne.locator("[href*='documents-request']");
  await pageOne.goto("https://rahulshettyacademy.com/loginpagePractise/");


  const [newPage]= await Promise.all
  (
  [
  context.waitForEvent('page'),
  await blinkingText.click()
  ] 
  )
  let redText:any;
  redText = await newPage.locator('.red').textContent();
  const splitTextIntoArray = redText.split("@");
  const stringPartOne = splitTextIntoArray[0];
  const stringPartTwo = splitTextIntoArray[1];
  const stringSubString = stringPartTwo.split(" ")
  console.log(stringSubString[0]);
  await pageOne.locator("#username").fill(stringSubString[0]);
  //await pageOne.pause();
})
test('Log in and make an order',async({page})=>
{

  const products = page.locator(".card-body");
  const productName = 'IPHONE 13 PRO';
  await page.goto("https://rahulshettyacademy.com/client");
  await page.locator("#userEmail").fill("mmiller9911@gmail.com");
  await page.locator("#userPassword").fill("2&3gr0gTDWaz");
  await page.locator("#login").click();
  await page.waitForLoadState("networkidle");

  const count = await products.count();
  console.log(count);

  for (let i = 0; i < count;++i){
      
     if(await products.nth(i).locator("b").textContent() === productName)
      {
          await products.nth(i).locator("text= Add To Cart").click();
          break;
      }
  }
  await page.locator('[routerlink~="/dashboard/cart"]').click();
  await page.locator("div li").first().waitFor();
  const bool = await page.locator("h3:has-text('IPHONE 13 PRO')").isVisible();
  expect(bool).toBeTruthy();
  await page.locator("text= Checkout").click();
  await page.locator("[placeholder*='Select Country']").pressSequentially("Ind");
  const options = page.locator(".ta-results");
  await options.waitFor();
  const optionsCount = await options.locator("button").count();
  for(let i=0; i<optionsCount;++i)
  {
      let text:any = await options.locator("button").nth(i).textContent(); 
      if(text.trim()==="India"){
          await options.locator("button").nth(i).click();
          break;
      }
  }
  await expect(page.locator(".user__name [type='text']").first()).toHaveText("mmiller9911@gmail.com");
  await page.locator(".action__submit").click();
  await expect(page.locator(".hero-primary")).toHaveText(" Thankyou for the order. ");
  let orderId:any;
  orderId = await page.locator(".em-spacer-1 .ng-star-inserted").textContent();
  console.log(orderId);

  await page.locator("[routerlink='/dashboard/myorders']").first().click();
  await page.locator("tbody").waitFor();
  const tablerowsCount = await page.locator("tbody tr").count();
  const tablerows = await page.locator("tbody tr");
  console.log(tablerowsCount);
  for(let i=0;i<tablerowsCount;++i){

      let rowOrderId:any;
      rowOrderId = await tablerows.nth(i).locator("th").textContent();
      console.log(rowOrderId);
      if(orderId.includes(rowOrderId)){
          await tablerows.nth(i).locator("button").first().click();
          break;
      }
  }
const orderIdDetails = await page.locator(".col-text").textContent();
expect(orderId.includes(orderIdDetails)).toBeTruthy();
})
test('Special locators',async({page})=>
  {
      await page.goto("https://rahulshettyacademy.com/angularpractice");
      await page.getByLabel("Check me out if you Love IceCreams!").click();
      await page.getByLabel("Employed").click();
      await page.getByLabel("Gender").selectOption("Female");
      await page.getByPlaceholder("Password").fill("Yogi");
      await page.getByRole("button",{name: 'Submit'}).click();
      await page.getByText("Success! The Form has been submitted successfully!.").click();
      await page.getByRole("link",{name: 'Shop'}).click();
      await page.locator("app-card").filter({hasText: 'Nokia Edge'}).getByRole("button").click();
      //await page.pause();
})
test("Calendar validations",async({page})=>
  {
   
      const monthNumber = "6";
      const date = "15";
      const year = "2027";
      const expectedList = [monthNumber,date,year];
      await page.goto("https://rahulshettyacademy.com/seleniumPractise/#/offers");
      await page.locator(".react-date-picker__inputGroup").click();
      await page.locator(".react-calendar__navigation__label").click();
      await page.locator(".react-calendar__navigation__label").click();
      await page.getByText(year).click();
      await page.locator(".react-calendar__year-view__months__month").nth(Number(monthNumber)-1).click();
      await page.locator("//abbr[text()='"+date+"']").click();
      let inputs = await page.locator(".react-date-picker__inputGroup input");
      for (let index:any = 0; index <inputs.count(); index++)
      {
          const value =inputs[index].getAttribute("value");
          expect(value).toEqual(expectedList[index]);
      } 
})
test("Popup validations",async({page})=>
  {
      await page.goto("http://rahulshettyacademy.com/AutomationPractice/");
      // await page.goto("http://google.com");
      // await page.goBack();
      // await page.goForward();
      await expect(page.locator("input[id='displayed-text']")).toBeVisible();
      await page.locator("#hide-textbox").click();
      await expect(page.locator("input[id='displayed-text']")).toBeHidden();
      //await page.pause();
})
test("Alert validations",async({page})=>
  {
      await page.goto("http://rahulshettyacademy.com/AutomationPractice/");
      page.on("dialog",dialog => dialog.accept());
      await page.locator("#confirmbtn").click();
      await page.locator("#mousehover").hover();
      //await page.pause();
})
test("Frame validations",async({page})=>
  {
      await page.goto("http://rahulshettyacademy.com/AutomationPractice/");
      const FramePage = await page.frameLocator("#courses-iframe");
      await FramePage.locator("li a[href*='lifetime-access']:visible").click();
      let textCheck:any = await FramePage.locator(".text h2").textContent();
      console.log(textCheck.split(" ")[1]);
      //await page.pause();
})