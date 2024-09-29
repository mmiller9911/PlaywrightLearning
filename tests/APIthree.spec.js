const {test,expect,request} = require ('@playwright/test');
const {APIUtilities} = require ("./Utilities/APIUtilities")

const loginPayload = {userEmail: "mmiller9911@gmail.com", userPassword: "2&3gr0gTDWaz"}
const orderPayload = {orders: [{country: "Cuba", productOrderedId: "6581cade9fd99c85e8ee7ff5"}]}
const fakePayloadOrders = {data:[],message:"No Orders"};
let response;

test.beforeAll(async()=>{

    const apiContext = await request.newContext();
    const apiUtilities = new APIUtilities(apiContext,loginPayload);
    response = await apiUtilities.createOrder(orderPayload);
}
);

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


 
 