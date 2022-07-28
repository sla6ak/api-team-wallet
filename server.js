const mongoose = require("mongoose");
const dotenv = require("dotenv");
const app = require("./src/app");

// Вытягиваем переменные окружения в которой прячем путь к базе данных
dotenv.config();
const { MONGO_DB } = process.env;
const PORT = process.env.PORT || 5000; // http://localhost:5000/docs

async function start() {
  try {
    app.listen(PORT, () => {
      console.log(`listening ${PORT}`);
      mongoose.connect(MONGO_DB).then(() => {
        console.log(`MongoDB start`);
      });
    });
  } catch (error) {
    process.exit(0);
  }
}

start();
