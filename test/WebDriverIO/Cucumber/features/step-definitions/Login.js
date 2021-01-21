'use strict';

const { Given, When, Then } = require('@cucumber/cucumber');
const windowHandler = require('../helper/WindowHandler.js');

var client = require('../../Base').client;

var should = require('chai').should();

Given(/^I'm on (.*) window$/, async (windowTitle) => {
    should.exist(client);
    await windowHandler.switchWindowByTitle(client, windowTitle);
});

When(/^I enter (.*) into email input box$/, async (email) => {
    should.exist(client);
    await client.pause(2000).then(async function () {
        await client.addValue("#email", email);
        done();
    });
});

When(/^I enter (.*) into password input box$/, async (password) => {
    should.exist(client);
    await client.pause(2000).then(async function () {
        await client.addValue("#password", password);
        done();
    });
});

When(/^I click (.*) button$/, async (button) => {
    should.exist(client);
    await client.pause(2000).then(async function () {
        // pending
        done();
    });
});

Then(/^I should switch to the (.*) window$/, async (windowTitle) => {
    should.exist(client);
    await windowHandler.switchWindowByTitle(client, windowTitle);
});

Then(/^show connected user (.*)$/, async (email) => {
    should.exist(client);
    await client.pause(5000).then(async function () {
        await client.element(".Menu__user-section").then(function (result) {
            result.getAttribute('text').expect.to.contain(email);
            done();
        }, function (err) {
            done(err);
        });
    });
});