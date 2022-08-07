const sgMail = require("@sendgrid/mail");
const { SENDGRID_API_KEY, SENDGRID_FROM_EMAIL } = process.env;

sgMail.setApiKey(SENDGRID_API_KEY);

const sgMailData = (verificationToken, emailTo, host) => {
  const data = {
    to: emailTo,
    from: SENDGRID_FROM_EMAIL,
    subject: "Confirmation of registration",
    html: `<a target="_blank" href="http://${host}/auth/verify/${verificationToken}">Click to verification email</a>`,
  };
  return data;
};

const sendMail = async (sgMailData, next) => {
  try {
    const mail = { ...sgMailData };
    const send = await sgMail.send(mail);
    return send;
  } catch (error) {
    next(error);
  }
};

module.exports = { sgMailData, sendMail };
