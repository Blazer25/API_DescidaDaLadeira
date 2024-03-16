const StatusError = require("../../../helpers/status/StatusError");
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
    throw new StatusError(error.message, error.status)
  }
};

const inativarEquipe = async ({ codigo }) => {
  try {
    return await Equipe.updateOne({ codigo }, { ativa: false });
  } catch (error) {
    throw new StatusError(error.message, error.status)
  }
};

module.exports = {
  atualizarEquipe,
  inativarEquipe
};
