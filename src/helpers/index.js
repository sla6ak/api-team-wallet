const createError = require("./errors/createError");
const { sgMailData, sendMail } = require("./sendMail/sendMail");
const defaultResponseData = require("./defaultResponseData/defaultResponseData");

module.exports = {
  createError,
  sendMail,
  sgMailData,
  defaultResponseData,
};
