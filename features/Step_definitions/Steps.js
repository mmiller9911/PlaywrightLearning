const assert = require('assert')
const { Given, When, Then } = require('@cucumber/cucumber')
const { Greeter } = require('../../src')


Given('I login to the Ecommerce site with a username of {username} and password of {password}', function (username, password) {
    // Write code here that turns the phrase above into concrete actions
    return 'pending';
  });

  When('I add the product {product} to the cart', function (product) {
    // Write code here that turns the phrase above into concrete actions
    return 'pending';
  });

  Then('I confirm the product has been added', function () {
    // Write code here that turns the phrase above into concrete actions
    return 'pending';
  });

  When('I enter the details and submit the ORDER', function () {
    // Write code here that turns the phrase above into concrete actions
    return 'pending';
  });

  Then('the ORDER is present in the order history page', function () {
    // Write code here that turns the phrase above into concrete actions
    return 'pending';
  });