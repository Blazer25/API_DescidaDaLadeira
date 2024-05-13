const mongoose = require("mongoose");

const equipeSchema = new mongoose.Schema(
  {
    codigo: String,
    fase: String,
    equipes: Array,
    insercao: { type: Number, default: 0 },
  },
  { _id: true }
);

equipeSchema.pre("save", async function (next) {
  try {
    const equipe = this;
    if (!equipe.isNew) {
      return next();
    }

    const totalDocumentos = await EquipePorFase.countDocuments({});
    equipe.insercao = totalDocumentos + 1;

    next();
  } catch (error) {
    next(error);
  }
});

const EquipePorFase = mongoose.model("EquipePorFase", equipeSchema);

module.exports = EquipePorFase;
