/**
 *
 * Example test script for Hello OpenFin App using Mocha, CHAI and WebdriverIO (http://webdriver.io)
 * ChromeDriver must be running before test.
 *
 */

"use strict";

const expect = require('chai').expect;

var should = require('chai').should(),
  webdriver = require('webdriverio'),
  config = require("../../config"),
  spawn = require('child_process').spawn;


describe('ACE Client Login Window', function () {
  var client;

  this.timeout(config.testTimeout);

  before(function (done) {
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

  after(function () {
    return client.end();
  });


  /**
   * Select a Window
   * @param windowHandle handle of the window
   * @param callback callback with window title if selection is successful
   */
  function switchWindow(windowHandle, callback) {
    client.switchTab(windowHandle).then(function () {
      client.getTitle().then(function (title) {
        callback(title);
      });
    });
  }

  /**
   * Select the window with specified title
   * @param windowTitle window title
   * @param done done callback for Mocha
   */
  function switchWindowByTitle(windowTitle, done) {
    client.getTabIds().then(function (tabIds) {
      var handleIndex = 0;
      var checkTitle = function (title) {
        if (title === windowTitle) {
          done();
        } else {
          handleIndex++;
          if (handleIndex < tabIds.length) {
            switchWindow(tabIds[handleIndex], checkTitle);
          } else {
            // the window may not be loaded yet, so call itself again
            switchWindowByTitle(windowTitle, done);
          }
        }
      };
      switchWindow(tabIds[handleIndex], checkTitle);
    });
  }

  it('Switch to Login window', async function (done) {
    should.exist(client);
    await switchWindowByTitle("Login", done);
  });

  let emailInput, passwordInput, loginButton, cancelButton;

  it('find email input box', async function (done) {
    should.exist(client);
    // Wait for pre-login checks
    await client.pause(5000).then(async function () {
      await client.element("#email").then(async function (result) {
        should.exist(result.value);
        emailInput = await result.value;
        done();
      });
    });
  });

  it('find password input box', async function (done) {
    should.exist(client);
    await client.element("#password").then(function (result) {
      should.exist(result.value);
      passwordInput = result.value;
      done();
    });
  });

  it("should find buttons", async function (done) {
    should.exist(client);
    await client.elements(".Button").then(function (result) {
      const { value } = result;
      loginButton = value[0];
      cancelButton = value[1];
      done();
    });
  });

  it('enter text into email input box', async function (done) {
    should.exist(client);
    should.exist(emailInput);
    await client.pause(2000).then(async function () {
      console.log("Here...Email");
      await client.addValue("#email", "ns2@dev.archax.com");
      done();
    });
  });

  it('enter text into password input box', async function (done) {
    should.exist(client);
    should.exist(passwordInput);
    await client.pause(2000).then(async function () {
      console.log("Here...Password");
      await client.addValue("#password", "sh!nyPump99");
      done();
    });
  });

  it("should click login button", async function (done) {
    should.exist(client);
    should.exist(loginButton);

    await client.elementIdClick(loginButton.ELEMENT).then(async function (result) {
      await client.pause(3000).then(async function () {
        console.log("Click Result", result);
        done();
      })
    });
  });

  it('Switch to Menu window', async function (done) {
    should.exist(client);
    await switchWindowByTitle("Archax", done);
  });

  it('Exit OpenFin Runtime', function (done) {
    should.exist(client);
    client.execute(function () {
      fin.desktop.System.exit();
      fin.desktop.System.clearCache({
        cache: true,
        cookies: true,
        localStorage: true,
        appcache: true
      });
    });
    client.pause(1000).then(function () {  // pause here to give Runtime time to exit
      done();
    });
  });

});
