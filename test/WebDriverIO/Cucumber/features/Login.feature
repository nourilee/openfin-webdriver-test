Feature: Performing a login

    Scenario Outline: Login with a default user
        Given I'm on "Login" window
        When I enter '<email>' into email input box
            And I enter '<password>' into password input box
            And I click "Login" button
        Then I should switch to the "Menu" window
            And show connected user '<email>'

        Examples:
            | email              | password    |
            | ns2@dev.archax.com | sh!nyPump99 |