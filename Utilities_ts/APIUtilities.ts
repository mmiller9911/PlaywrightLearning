import {test,expect,request,APIRequestContext } from '@playwright/test';
import { POManager } from '../Pages_Typescript/POManager';

export class APIUtilities{

apiContext:APIRequestContext ;
loginPayload:APIRequestContext ;

    constructor(apiContext:APIRequestContext ,loginPayload:APIRequestContext )
    {
        //Take the apicontext passed into the method and make it a local variable (of this current object)
        this.apiContext = apiContext;
        //All the other methods will require a login to do anything so make it required whenever an instance is created.
        this.loginPayload = loginPayload;
    }

    async loginAndGetASessionToken()
    {
        const loginResponse = await this.apiContext.post("https://rahulshettyacademy.com/api/ecom/auth/login",
            {
            data:this.loginPayload
            })
            const loginResponseJson = await loginResponse.json();
            const token = loginResponseJson.token;
            return token;
    }
    async createOrder(orderPayload)
    {
        //Order call
        let response:any = {};

        response.token = await this.loginAndGetASessionToken();

        const orderResponse = await this.apiContext.post("https://rahulshettyacademy.com/api/ecom/order/create-order",
            {
                data:orderPayload,
                headers:{
                    'Authorization' : response.token,
                    'Content-Type' :'application/json'    
                },
            })
        const orderResponseJson = await orderResponse.json();
        const orderId = orderResponseJson.orders[0];
        response.orderId = orderId;
        return response;
    }
}
module.exports = {APIUtilities}