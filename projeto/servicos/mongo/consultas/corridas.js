const Corrida = require("../../../modelos/Corrida");

const listarTodasCorridas = async () => {
  try {
    return await Corrida.find({}, { _id: 0 }).sort({ dataHoraFim: 1 });
  } catch (error) {
    throw new Error(error.message);
  }
};

module.exports = {
  listarTodasCorridas,
};
