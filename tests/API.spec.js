const {test,expect,request} = require ('@playwright/test');
const {APIUtilities} = require ("/PlayWrightAutomation/Utilities/APIUtilities")
const loginPayload = {userEmail: "mmiller9911@gmail.com", userPassword: "2&3gr0gTDWaz"}
const orderPayload = {orders: [{country: "Cuba", productOrderedId: "6581cade9fd99c85e8ee7ff5"}]}
const fakePayloadOrders = {data:[],message:"No Orders"};

let response;
let webContext;

test.beforeAll(async({browser})=>{

    const apiContext = await request.newContext();
    const apiUtilities = new APIUtilities(apiContext,loginPayload);
    response = await apiUtilities.createOrder(orderPayload);

    const context = await browser.newContext();
    const page = await context.newPage();
    await page.goto("https://rahulshettyacademy.com/client");
    await page.locator("#userEmail").fill("mmiller9911@gmail.com");
    await page.locator("#userPassword").fill("2&3gr0gTDWaz");
    await page.locator("#login").click();
    await page.waitForLoadState("networkidle");
    await context.storageState({path: "state.json"});
    webContext = await browser.newContext({storageState:"state.json"});
}
);

test.beforeEach(()=>{

}
)
test("APIs",async({page})=>
    {
        page.addInitScript(value =>{
            window.localStorage.setItem('token',value)
        }, response.token)

        await page.goto("https://rahulshettyacademy.com/client");   
        await page.locator("[routerlink='/dashboard/myorders']").first().click();
        await page.locator("tbody").waitFor();
        const tablerowsCount = await page.locator("tbody tr").count();
        const tablerows = await page.locator("tbody tr");
        console.log(tablerowsCount);
        for(let i=0;i<tablerowsCount;++i){
            const rowOrderId = await tablerows.nth(i).locator("th").textContent();
            console.log(rowOrderId);
            if(response.orderId.includes(rowOrderId)){
                await tablerows.nth(i).locator("button").first().click();
                break;
            }
        }
     const orderIdDetails = await page.locator(".col-text").textContent();
     expect(response.orderId.includes(orderIdDetails)).toBeTruthy();
})
test('Log in and make an order',async()=>
    {
        const page = await webContext.newPage();
        await page.goto("https://rahulshettyacademy.com/client");
        const products = page.locator(".card-body");
        const productName = 'IPHONE 13 PRO';
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
            const text =  await options.locator("button").nth(i).textContent();
            if(text.trim()==="India"){
                await options.locator("button").nth(i).click();
                break;
            }
        }
        await expect(page.locator(".user__name [type='text']").first()).toHaveText("mmiller9911@gmail.com");
        await page.locator(".action__submit").click();
        await expect(page.locator(".hero-primary")).toHaveText(" Thankyou for the order. ");
        const orderId = await page.locator(".em-spacer-1 .ng-star-inserted").textContent();
        console.log(orderId);
    
        await page.locator("[routerlink='/dashboard/myorders']").first().click();
        await page.locator("tbody").waitFor();
        const tablerowsCount = await page.locator("tbody tr").count();
        const tablerows = await page.locator("tbody tr");
        console.log(tablerowsCount);
        for(let i=0;i<tablerowsCount;++i){
            const rowOrderId = await tablerows.nth(i).locator("th").textContent();
            console.log(rowOrderId);
            if(orderId.includes(rowOrderId)){
                await tablerows.nth(i).locator("button").first().click();
                break;
            }
        }
     const orderIdDetails = await page.locator(".col-text").textContent();
     expect(orderId.includes(orderIdDetails)).toBeTruthy();
})
test("Intercepting an API call and mocking",async({page})=>
    {
        page.addInitScript(value =>{
            window.localStorage.setItem('token',value)
        }, response.token)

        await page.goto("https://rahulshettyacademy.com/client");  
        await page.route("https://rahulshettyacademy.com/api/ecom/order/get-orders-for-customer/*",
        async route=>
        {
           const realresponse =  await page.request.fetch(route.request());
           let body = JSON.stringify(fakePayloadOrders);
           route.fulfill(
            {
                realresponse,
                body,
 
            });
          });

        await page.locator("[routerlink='/dashboard/myorders']").first().click();
        await page.waitForResponse("https://rahulshettyacademy.com/api/ecom/order/get-orders-for-customer/*")
        console.log(await page.locator(".mt-4").textContent());
        
})
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
    //await page.pause();
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