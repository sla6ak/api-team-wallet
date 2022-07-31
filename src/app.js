const app = require("./config/serverConfig");
const swaggerUi = require("swagger-ui-express");
const swaggerDocument = require("../swagger.json");
const routerAuth = require("./routers/auth.routes");
const routerTransaction = require("./routers/transaction.routes");

app.use("/auth", routerAuth);
app.use("/transaction", routerTransaction);
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.use((req, res) => {
  res.status(404).json({ message: "Not found" });
});

app.use((err, req, res, next) => {
  const { status = 500, message = "Server error" } = err;
  res.status(status).json({ message });
});

module.exports = app;
