const Corrida = require("../../../modelos/Corrida");

const listarTodasCorridas = async () => {
  try {
    return await Corrida.find({}, { _id: 0 });
  } catch (error) {
    throw new Error(error.message);
  }
};

module.exports = {
  listarTodasCorridas,
};
