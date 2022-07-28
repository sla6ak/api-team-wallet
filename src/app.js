const app = require("./config/serverConfig");

// Ниже импорты разных рероутов
const routerAuth = require("./routers/auth.routes");
const routerTransaction = require("./routers/transaction.routes");

app.use("/auth", routerAuth);
app.use("/transaction", routerTransaction);
app.use("*", (req, res) => {
  res.status(200).json({ massage: "Страница 404 и тестовые запросы к серверу" });
});

module.exports = app;
