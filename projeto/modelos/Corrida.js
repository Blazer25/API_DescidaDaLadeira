const mongoose = require("mongoose");

const integranteSchema = new mongoose.Schema(
  {
    nome: String,
    RA: String,
  },
  { _id: false }
);

const chegadaSchema = new mongoose.Schema(
  {
    tempo: String,
    posicao: String,
    equipe: {
      codigo: String,
      nome: String,
      integrantes: [integranteSchema],
    },
  },
  { _id: false }
);

const corridaSchema = new mongoose.Schema(
  {
    codigo: String,
    dataHoraInicio: String,
    dataHoraFim: String,
    tempoTotal: String,
    temposChegadas: [chegadaSchema],
  },
  { _id: true }
);

const Corrida = mongoose.model("Corrida", corridaSchema);

module.exports = Corrida;
