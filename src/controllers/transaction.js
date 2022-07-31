const TransactionModel = require("../models/transaction");
// const UserModel = require("../models/user");

class Transaction {
  async getAllTransaction(req, res, next) {
    try {
      const allTransaction = await TransactionModel.find({});
      return res.status(200).json({ message: "status 200", response: allTransaction });
    } catch (error) {
      return res
        .status(404)
        .json({ message: `Transaction not found`, response: null, error: error });
    }
  }

  // Проверить что все поля обязательные заполнены - тип, категория, сумма, дата
  async addNewTransaction(req, res, next) {
    try {
      // мидлвара аутентификации вкладывает юзера в объект req
      const { user } = req.user;
      const { type, sum } = req.body;

      // берем текущий баланс у юзера
      const previousCurrentBalance = user.currentBalance;

      // высчитываем новый баланс
      const currentBalance = () => {
        return type === 'income'
          ? (previousCurrentBalance + sum)
          : (previousCurrentBalance - sum)
      }

      // переписать у юзера текущий баланс
      // const updatedUser = await UserModel.findByIdAndUpdate()

      // проверить есть ли другие транзакции после даты текущей транзакции

      // создать новую транзакцию в базе
      const newTransaction = await TransactionModel.create({
        ...req.body, // тип, категория, дата, сумма транзакции, комментарий
        currentBalance, // баланс после текущей транзакции транзакции
        owner: user._id,
      });

      return res
        .status(201)
        .json({
          message: "Transaction was created successfully", response: {
            user,
            newTransaction,
        } });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new Transaction();
