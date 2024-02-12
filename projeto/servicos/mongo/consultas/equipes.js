const Equipe = require("../../../modelos/Equipe");

const listarTodasEquipes = async () => {
  try {
    return await Equipe.find({}, { _id: 0 });
  } catch (error) {
    throw new Error(error.message);
  }
};

const listarEquipePeloCodigo = async ({ codigo }) => {
  try {
    return await Equipe.findOne({ codigo }, { _id: 0 });
  } catch (error) {
    throw new Error(error.message);
  }
};

module.exports = {
  listarTodasEquipes,
  listarEquipePeloCodigo,
};
