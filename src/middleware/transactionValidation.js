const Joi = require("joi");
const { createError } = require("../helpers");

const newTransactionValidation = (req, res, next) => {
  try {
    const schema = Joi.object({
      type: Joi.string().valid("income", "expense").required(),
      category: Joi.string().valid("Main", "Food", "Auto", "Children", "House", "Education").required(),
      sum: Joi.number().required(),
      // TODO: обсудить формат даты
      date: Joi.string().required(),
    });

    const { error } = schema.validate(req.body);
    if (error) {
      throw createError(400, "JoiError. Missing required field");
    }

    next();
  } catch (error) {
    next(error);
  }
};

module.exports = {
  newTransactionValidation,
}