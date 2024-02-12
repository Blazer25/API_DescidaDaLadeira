const Equipe = require("../../../modelos/Equipe");

const atualizarEquipe = async (
  { codigo },
  { nome, integrantes, RA, quantidadeIntegrantes }
  ) => {
  try {
    return await Equipe.findOneAndUpdate(
      { codigo },
      { nome, integrantes, RA, quantidadeIntegrantes },
      { new: true }
    );

  } catch (error) {
    throw new Error(error.message);
  }
};

module.exports = {
  atualizarEquipe,
};
