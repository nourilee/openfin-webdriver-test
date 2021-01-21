// cucumber.js
const common = [
    "./test/WebDriverIO/Cucumber/features/**/*.feature",
    "--require ./test/WebDriverIO/Cucumber/features/step-definitions/**/*.js",
    "--publish-quiet",
  ].join(" ");
  
  // eslint-disable-next-line no-undef
  module.exports = {
    default: common,
  };