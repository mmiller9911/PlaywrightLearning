const {test,expect,request} = require ('@playwright/test');
const {APIUtilities} = require ("/PlayWrightAutomation/Utilities/APIUtilities")

const loginPayload = {userEmail: "mmiller9911@gmail.com", userPassword: "2&3gr0gTDWaz"}
const orderPayload = {orders: [{country: "Cuba", productOrderedId: "6581cade9fd99c85e8ee7ff5"}]}

let response;

test.beforeAll(async()=>{

    const apiContext = await request.newContext();
    const apiUtilities = new APIUtilities(apiContext,loginPayload);
    response = await apiUtilities.createOrder(orderPayload);
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
     await page.pause();
})