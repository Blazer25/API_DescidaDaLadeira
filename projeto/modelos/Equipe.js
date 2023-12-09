const mongoose = require("mongoose");

const integranteSchema = new mongoose.Schema({
  nome: String,
  RA: String,
});

const Equipe = mongoose.model("Equipe", {
  nome: String,
  quantidadeIntegrantes: Number,
  integrantes: [integranteSchema],
});

module.exports = Equipe;
