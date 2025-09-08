const chalk = require("chalk");


/**
 * 
 * @param {String} message 
 * @param {String} type, success / error 
 */
function log(message, type) {
  switch (type) {
    case "success":
      console.log(chalk.green(message));
      break;
    case "error":
      console.log(chalk.red(message));
      break;
    default:
      console.log(chalk.cyan(message));
      break;
  }
}

module.exports = log;
