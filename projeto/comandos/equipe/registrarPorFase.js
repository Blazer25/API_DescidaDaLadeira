const { v4: uuidv4 } = require("uuid");
const StatusError = require("../../helpers/status/StatusError");
const { StatusOk } = require("../../helpers/status/StatusOk");
const EquipePorFase = require("../../modelos/EquipePorFase.js");

async function executar({ equipes, fase }) {
  try {
    validarParametros({ equipes, fase });
    const equipesPorFase = criarEquipesPorFase({ equipes, fase });
    await gravarEquipesPorFase({ equipesPorFase });

    return StatusOk({
      data: null,
      status: 201,
      mensagem: "Equipe por fase registrada com sucesso!",
    });
  } catch (error) {
    return {
      erro: true,
      status: error.status || 500,
      mensagem: error.message || "Erro desconhecido ao registrar equipe.",
    };
  }
}

function validarParametros({ equipes, fase }) {
  if (typeof fase !== "string") {
    throw new StatusError(
      "O campo fase é obrigatório e deve ser do tipo texto",
      400
    );
  }

  if (!Array.isArray(equipes)) {
    throw new StatusError(
      "O campo equipes é obrigatório e deve ser um Array.",
      400
    );
  }
}

function criarEquipesPorFase({ equipes, fase }) {
  try {
    const equipesPorFase = new EquipePorFase({
      codigo: uuidv4(),
      fase,
      equipes,
    });

    return equipesPorFase;
  } catch (error) {
    throw new StatusError(error.message, error.status || 500);
  }
}

async function gravarEquipesPorFase({ equipesPorFase }) {
  try {
    await equipesPorFase.save();
  } catch (error) {
    throw new StatusError(error.message, error.status);
  }
}
module.exports = {
  executar,
};
