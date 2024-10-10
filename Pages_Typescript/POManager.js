"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.POManager = void 0;
var LoginPage_1 = require("./LoginPage");
var DashboardPage_1 = require("./DashboardPage");
var OrdersHistoryPage_1 = require("./OrdersHistoryPage");
var OrdersReviewPage_1 = require("./OrdersReviewPage");
var CartPage_1 = require("./CartPage");
var POManager = /** @class */ (function () {
    function POManager(page) {
        this.page = page;
        this.loginPage = new LoginPage_1.LoginPage(this.page);
        this.dashboardPage = new DashboardPage_1.DashboardPage(this.page);
        this.ordersHistoryPage = new OrdersHistoryPage_1.OrdersHistoryPage(this.page);
        this.ordersReviewPage = new OrdersReviewPage_1.OrdersReviewPage(this.page);
        this.cartPage = new CartPage_1.CartPage(this.page);
    }
    POManager.prototype.getLoginPage = function () {
        return this.loginPage;
    };
    POManager.prototype.getCartPage = function () {
        return this.cartPage;
    };
    POManager.prototype.getDashboardPage = function () {
        return this.dashboardPage;
    };
    POManager.prototype.getOrdersHistoryPage = function () {
        return this.ordersHistoryPage;
    };
    POManager.prototype.getOrdersReviewPage = function () {
        return this.ordersReviewPage;
    };
    return POManager;
}());
exports.POManager = POManager;
module.exports = { POManager: POManager };
