const {test,expect,request} = require ('@playwright/test');
const {APIUtilities} = require ("./Utilities/APIUtilities")

const loginPayload = {userEmail: "mmiller9911@gmail.com", userPassword: "2&3gr0gTDWaz"}
const orderPayload = {orders: [{country: "Cuba", productOrderedId: "6581cade9fd99c85e8ee7ff5"}]}

let response;
let webContext;

test.beforeAll(async({browser})=>
{
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