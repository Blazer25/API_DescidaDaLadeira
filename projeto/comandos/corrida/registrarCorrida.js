const { v4: uuidv4 } = require("uuid");
const StatusError = require("../../helpers/status/StatusError");
const { StatusOk } = require("../../helpers/status/StatusOk");
const Corrida = require("../../modelos/Corrida");
const consultasEquipe = require("../../servicos/mongo/consultas/equipes");

async function executar({
  dataHoraInicio,
  dataHoraFim,
  tempoTotal,
  temposChegadas,
}) {
  try {
    validarParametros({
      dataHoraInicio,
      dataHoraFim,
      tempoTotal,
      temposChegadas,
    });

    await verificaCodigoEquipe({ temposChegadas });

    const corrida = criarCorrida({
      dataHoraInicio,
      dataHoraFim,
      tempoTotal,
      temposChegadas,
    });

    await gravarCorrida({ corrida });

    return StatusOk({
      data: null,
      status: 201,
      mensagem: "Corrida registrada com sucesso!",
    });
  } catch (error) {
    return {
      erro: true,
      status: error.status || 500,
      mensagem: error.message || "Erro desconhecido ao registrar corrida.",
    };
  }
}

function validarParametros({
  dataHoraInicio,
  dataHoraFim,
  tempoTotal,
  temposChegadas,
}) {
  if (!dataHoraInicio || !dataHoraFim || !tempoTotal || !temposChegadas) {
    throw new StatusError(
      "Preencha todos os campos obrigatórios (dataHoraInicio, dataHoraFim, tempoTotal, temposChegadas).",
      400
    );
  }

  if (typeof dataHoraInicio !== "string" || typeof dataHoraFim !== "string") {
    throw new StatusError(
      "Os campos dataHoraInicio e dataHoraFim devem ser do tipo 'texto'.",
      400
    );
  }

  if (typeof tempoTotal !== "string") {
    throw new StatusError("O campo tempoTotal deve ser do tipo 'texto'.", 400);
  }

  if (!Array.isArray(temposChegadas)) {
    throw new StatusError(
      "O campo temposChegadas deve ser do tipo 'array'.",
      400
    );
  }

  if (!temposChegadas.length) {
    throw new StatusError("O campo temposChegadas não pode ser vazio.", 400);
  }

  temposChegadas.forEach((tempoChegada, index) => {
    if (!tempoChegada.tempo || typeof tempoChegada.tempo !== "string") {
      throw new StatusError(
        `O tempo da chegada do ${
          index + 1
        }° integrante deve ser do tipo "texto".`,
        400
      );
    }

    if (typeof tempoChegada.posicao !== "string") {
      throw new StatusError(
        `A posição de chegada do ${
          index + 1
        }° integrante deve ser do tipo "texto".`,
        400
      );
    }

    if (
      typeof tempoChegada.equipe !== "object" ||
      Array.isArray(tempoChegada.equipe)
    ) {
      throw new StatusError(
        `A equipe do ${index + 1}° integrante deve ser um objeto ({}).`,
        400
      );
    }

    if (typeof tempoChegada.equipe.codigo !== "string") {
      throw new StatusError(
        `O código da equipe do ${
          index + 1
        }° integrante deve ser do tipo "texto".`,
        400
      );
    }

    if (typeof tempoChegada.equipe.nome !== "string") {
      throw new StatusError(
        `O nome da equipe do ${
          index + 1
        }° integrante deve ser do tipo "texto".`,
        400
      );
    }

    if (!Array.isArray(tempoChegada.equipe.integrantes)) {
      throw new StatusError(
        `Os integrantes da equipe do ${
          index + 1
        }° integrante devem ser do tipo "array".`,
        400
      );
    }

    if (!tempoChegada.equipe.integrantes.length) {
      throw new StatusError(
        `Os integrantes da equipe do ${
          index + 1
        }° integrante não podem ser vazios.`,
        400
      );
    }

    tempoChegada.equipe.integrantes.forEach((integrante, indexIntegrante) => {
      if (typeof integrante.RA !== "string") {
        throw new StatusError(
          `O RA do ${indexIntegrante + 1}° integrante da ${
            index + 1
          }° equipe deve ser do tipo "texto".`,
          400
        );
      }

      if (typeof integrante.nome !== "string") {
        throw new StatusError(
          `O nome do ${indexIntegrante + 1}° integrante da ${
            index + 1
          }° equipe deve ser do tipo "texto".`,
          400
        );
      }
    });
  });
}

async function verificaCodigoEquipe({ temposChegadas }) {
  try {
    for (let index = 0; index < temposChegadas.length; index++) {
      const tempo = temposChegadas[index];
      const resultado = await consultasEquipe.listarEquipePeloCodigo({
        codigo: tempo.equipe.codigo,
      });
      if (!resultado) {
        throw new StatusError(
          `Equipe não encontrada para o código informado para a ${
            index + 1
          }° equipe!`,
          404
        );
      }
    }
  } catch (error) {
    throw new StatusError(error.message, error.status);
  }
}

function criarCorrida({
  dataHoraInicio,
  dataHoraFim,
  tempoTotal,
  temposChegadas,
}) {
  const corrida = new Corrida({
    codigo: uuidv4(),
    dataHoraInicio,
    dataHoraFim,
    tempoTotal,
    temposChegadas,
  });

  return corrida;
}

async function gravarCorrida({ corrida }) {
  try {
    await corrida.save();
  } catch (error) {
    throw new StatusError(error.message, error.status);
  }
}
module.exports = {
  executar,
};
