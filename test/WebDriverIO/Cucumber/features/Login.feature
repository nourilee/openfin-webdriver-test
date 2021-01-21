Feature: Performing a login

    Scenario Outline: Login with a default user
        Given I'm on "Login" window
        When I enter '<email>' into email input box
            And I enter '<password>' into password input box
            And I click the login button
        Then I should switch to the "Menu" window
            And show connected user '<email>'

        Examples:
            | emai               | password    |
            | ns2@dev.archax.com | sh!nyPump99 |

    Scenario: Logout
        Given I'm on "Menu" window
        When I go to menu item "Accounts"
            And I click the logout link
        Then I should see a confirmation window