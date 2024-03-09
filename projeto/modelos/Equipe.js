const mongoose = require("mongoose");

const integranteSchema = new mongoose.Schema({
  nome: String,
  RA: String,
}, { _id: false });

const equipeSchema = new mongoose.Schema({
  codigo: String,
  nome: String,
  quantidadeIntegrantes: Number,
  integrantes: [integranteSchema],
  ativa: Boolean
}, { _id: true });

const Equipe = mongoose.model("Equipe", equipeSchema);

module.exports = Equipe;
