'use strict';

const { Before, After } = require('@cucumber/cucumber');
const config = require("../../config");

var client;

var webdriver = require('webdriverio'),
        spawn = require('child_process').spawn;

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