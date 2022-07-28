const app = require("./config/serverConfig");

// Ниже импорты разных рероутов
const routerAuth = require("./routers/auth.routes");
const routerTransaction = require("./routers/transaction.routes");

app.use("/auth", routerAuth);
app.use("/transaction", routerTransaction);

module.exports = app;
