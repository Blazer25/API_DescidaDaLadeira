const mongoose = require("mongoose");

const integranteSchema = new mongoose.Schema(
  {
    nome: String,
    RA: String,
    curso: {
      type: String,
      set: (value) => (value ? value.toUpperCase() : value),
    },
  },
  { _id: false }
);

const equipeSchema = new mongoose.Schema(
  {
    codigo: String,
    nome: String,
    quantidadeIntegrantes: Number,
    integrantes: [integranteSchema],
    ativa: Boolean,
    numeroCarrinho: String,
    logoUrl: String,
  },
  { _id: true }
);

const Equipe = mongoose.model("Equipe", equipeSchema);

module.exports = Equipe;
