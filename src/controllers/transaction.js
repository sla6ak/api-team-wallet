const TransactionModel = require("../models/transaction");
// const UserModel = require("../models/user");
// const { defaultResponseData } = require("../helpers");

class Transaction {
  async getAllTransaction(req, res, next) {
    try {
      // мидлвара аутентификации вкладывает юзера в объект req
      const { user } = req.user;
      console.log('user', user);
      const owner = user._id;

      // ищем все транзакции принадлежащие текущему юзеру
      const transactions = await TransactionModel.find({ owner }, "-createdAt -updatedAt");
      console.log(transactions);

      // возвращаем ответ если транзакций нет
      if (!transactions) {
        // const data = { ...defaultResponseData(), user };
        // res.json(data);
      }

      // возвращаем ответ если транзакции есть
      return res
        .status(200)
        .json({
          response: {
            user,
            transactions
          }
        });
    } catch (error) {
      next(error);
    }
  }

  // TODO: Joi - Проверить что все поля обязательные заполнены - тип, категория, сумма, дата
  async addNewTransaction(req, res, next) {
    try {
      // const { user } = req.user;
      // console.log('user', user);
      const { type, sum } = req.body;

      // const previousBalance = user.currentBalance;
      const previousBalance = 240;

      const balanceAfterTransaction =
        type === 'income'
          ? previousBalance + sum
          : previousBalance - sum;

      // const updatedUser = await UserModel.findByIdAndUpdate(user._id, { balanceAfterTransaction });
      // console.log('updatedUser', updatedUser);

      // TODO: формат даты обсудить
      // TODO: проверяем есть ли другие транзакции после даты текущей транзакции

      const newTransaction = await TransactionModel.create({
        ...req.body,
        balanceAfterTransaction,
        // owner: user._id,
      });

      const data = {
        // ...defaultResponseData(),
        // user,
        status: "201",
        message: "Transaction was created successfully",
        transaction: newTransaction,
      };

      return res.json(data);
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new Transaction();
