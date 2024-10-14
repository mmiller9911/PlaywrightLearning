Feature: Ecommerce validations

Scenario: Place an ORDER
    Given I login to the Ecommerce site with a username of "Username" and password of "Password"
    When I add the product "product" to the cart
    Then I confirm the product has been added
    When I enter the details and submit the ORDER
    Then the ORDER is present in the order history page


