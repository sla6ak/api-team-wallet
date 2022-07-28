const { Schema, model } = require("mongoose");

const schema = new Schema({});

module.exports = model("transaction", schema); // именует модель которая будет созданна при запросе к базе
