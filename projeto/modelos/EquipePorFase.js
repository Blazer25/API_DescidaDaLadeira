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

equipeSchema.pre("save", function (next) {
  const equipe = this;
  if (!equipe.isNew) {
    return next();
  }

  EquipePorFase.findOne(
    {},
    {},
    { sort: { insercao: -1 } },
    function (err, lastEquipe) {
      if (err || !lastEquipe) {
        equipe.insercao = 1;
      } else {
        equipe.insercao = lastEquipe.insercao + 1;
      }
      next();
    }
  );
});

const EquipePorFase = mongoose.model("EquipePorFase", equipeSchema);

module.exports = EquipePorFase;
