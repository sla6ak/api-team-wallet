const sgMail = require("@sendgrid/mail");
const { PORT, SENDGRID_API_KEY } = process.env;

sgMail.setApiKey(SENDGRID_API_KEY);

const sgMailData = (verificationToken, emailTo, emailFrom) => {
  const data = {
    to: emailTo,
    from: emailFrom,
    subject: "Подтверждение регистрации на сайте",
    html: `<a target="_blank" href="http://localhost:${PORT}/api/auth//users/verify/${verificationToken}">Нажмите для подтверждения email</a>`,
  };
  return data;
};

const sendMail = async (sgMailData, next) => {
  try {
    const mail = { ...sgMailData };
    await sgMail.send(mail);
  } catch (error) {
    next(error);
  }
};

module.exports = { sgMailData, sendMail };
