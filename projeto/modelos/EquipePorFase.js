const mongoose = require("mongoose");

const equipeSchema = new mongoose.Schema({
  codigo: String,
  fase: String,
  equipes: Array,
}, { _id: true });

const EquipePorFase = mongoose.model("EquipePorFase", equipeSchema);

module.exports = EquipePorFase;
