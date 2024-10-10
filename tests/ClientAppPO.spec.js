"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
var test_1 = require("@playwright/test");
var POManager_1 = require("../Pages_Typescript/POManager");
var dataset = JSON.parse(JSON.stringify(require("../JSONdata/ClientAppPO.json")));
var _loop_1 = function (data) {
    test_1.test.only("Getting Data from JSON files ".concat(data.productName), function (_a) { return __awaiter(void 0, [_a], void 0, function (_b) {
        var poManager, loginPage, dashboardPage, cartPage, ordersReviewPage, orderId, ordersHistoryPage, _c, _d, _e;
        var page = _b.page;
        return __generator(this, function (_f) {
            switch (_f.label) {
                case 0:
                    poManager = new POManager_1.POManager(page);
                    loginPage = poManager.getLoginPage();
                    return [4 /*yield*/, loginPage.goTo()];
                case 1:
                    _f.sent();
                    return [4 /*yield*/, loginPage.validLogin(data.username, data.password)];
                case 2:
                    _f.sent();
                    dashboardPage = poManager.getDashboardPage();
                    return [4 /*yield*/, dashboardPage.searchProductAddCart(data.productName)];
                case 3:
                    _f.sent();
                    return [4 /*yield*/, dashboardPage.navigateToCart()];
                case 4:
                    _f.sent();
                    cartPage = poManager.getCartPage();
                    return [4 /*yield*/, cartPage.VerifyProductIsDisplayed(data.productName)];
                case 5:
                    _f.sent();
                    return [4 /*yield*/, cartPage.Checkout()];
                case 6:
                    _f.sent();
                    ordersReviewPage = poManager.getOrdersReviewPage();
                    return [4 /*yield*/, ordersReviewPage.searchCountryAndSelect("ind", "India")];
                case 7:
                    _f.sent();
                    return [4 /*yield*/, ordersReviewPage.SubmitAndGetOrderId()];
                case 8:
                    orderId = _f.sent();
                    console.log(orderId);
                    return [4 /*yield*/, dashboardPage.navigateToOrders()];
                case 9:
                    _f.sent();
                    ordersHistoryPage = poManager.getOrdersHistoryPage();
                    return [4 /*yield*/, ordersHistoryPage.searchOrderAndSelect(orderId)];
                case 10:
                    _f.sent();
                    _c = test_1.expect;
                    _e = (_d = orderId).includes;
                    return [4 /*yield*/, ordersHistoryPage.getOrderId()];
                case 11:
                    _c.apply(void 0, [_e.apply(_d, [_f.sent()])]).toBeTruthy();
                    return [2 /*return*/];
            }
        });
    }); });
};
for (var _i = 0, dataset_1 = dataset; _i < dataset_1.length; _i++) {
    var data = dataset_1[_i];
    _loop_1(data);
}
;
