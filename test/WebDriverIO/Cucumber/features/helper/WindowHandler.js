// WindowHandler.js

/**
 * Select a Window
 * @param windowHandle handle of the window
 * @param callback callback with window title if selection is successful
 */
function switchWindow(client, windowHandle, callback) {
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
function switchWindowByTitle(client, windowTitle, done) {
    client.getTabIds().then(function (tabIds) {
        var handleIndex = 0;
        var checkTitle = function (title) {
            if (title === windowTitle) {
                done();
            } else {
                handleIndex++;
                if (handleIndex < tabIds.length) {
                    switchWindow(client, tabIds[handleIndex], checkTitle);
                } else {
                    // the window may not be loaded yet, so call itself again
                    switchWindowByTitle(windowTitle, done);
                }
            }
        };
        switchWindow(client, tabIds[handleIndex], checkTitle);
    });
}

module.exports = { switchWindow, switchWindowByTitle }; // a list of exported variables

// export { switchWindow, switchWindowByTitle }; // a list of exported variables