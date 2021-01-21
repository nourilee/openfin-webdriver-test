const { Before, Given, When, Then, After } = require('@cucumber/cucumber');
const windowHandler = require('./../helper/WindowHandler.js');
const config = require("./../support/config.js");

var should = require('chai').should(),
    webdriver = require('webdriverio'),
    spawn = require('child_process').spawn;

var client;


Before(async function () {
    if (config.desiredCapabilities.chromeOptions.debuggerAddress) {
        // if debuggerAddress is set,  ChromeDriver does NOT start "binary" and assumes it is already running,
        // it needs to start separately
        spawn(config.desiredCapabilities.chromeOptions.binary, config.desiredCapabilities.chromeOptions.args);
    }

    // configure webdriver
    var driverOptions = {
        desiredCapabilities: config.desiredCapabilities,
        host: config.remoteDriverHost,
        port: config.remoteDriverPort,
        waitforTimeout: config.testTimeout,
        logLevel: 'verbose'  // http://webdriver.io/guide/getstarted/configuration.html
    };
    client = webdriver.remote(driverOptions);

    if (!config.remoteDriverPath) {
        client.requestHandler.startPath = "";  // webdriverio defaults it to '/wd/hub';
    }

    client.init().then(function () {
        client.timeouts("implicit", config.testTimeout).then(function (t) {
            client.timeouts("script", config.testTimeout).then(function (t2) {
                client.timeouts("page load", config.testTimeout).then(function (t3) {
                    done();
                })
            });
        });
    });
});

After(async function () {
    return client.end();
});


Given(/^I'm on (.*) window$/, async (windowTitle) => {
    should.exist(client);
    await switchWindowByTitle(client, windowTitle, done);
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

Then(/^I should switch to the (.*) window$/, async (windowTitle) => {
    should.exist(client);
    await switchWindowByTitle(client, windowTitle, done);
});

Then(/^show connected user$/, async (email) => {
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