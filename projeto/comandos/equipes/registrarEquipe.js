const StatusError = require("../../helpers/status/StatusError");
const { StatusOk } = require("../../helpers/status/StatusOk");
const Equipe = require("../../modelos/Equipe");

async function executar({ nome, quantidadeIntegrantes, integrantes }) {
  try {
    validarParametros({ nome, quantidadeIntegrantes, integrantes });
    const equipe = criarEquipe({ nome, quantidadeIntegrantes, integrantes });
    await gravarEquipe({ equipe });

    return StatusOk({
      data: null,
      status: 201,
      mensagem: "Equipe registrada com sucesso!",
    });
  } catch (error) {
    return {
      erro: true,
      status: error.status || 500,
      mensagem: error.message || "Erro desconhecido ao registrar equipe.",
    };
  }
}

function validarParametros({ nome, quantidadeIntegrantes, integrantes }) {
  if (!nome || !quantidadeIntegrantes || !integrantes) {
    throw new StatusError(
      "Preencha todos os campos obrigatórios (nome, integrantes e quantidade de integrantes).",
      400
    );
  }

  if (typeof nome !== "string") {
    throw new StatusError("O nome da equipe deve ser do tipo texto.", 400);
  }

  if (
    typeof quantidadeIntegrantes !== "number" ||
    quantidadeIntegrantes <= 0 ||
    quantidadeIntegrantes > 5 ||
    !Number.isInteger(quantidadeIntegrantes)
  ) {
    return {
      erro: true,
      mensagem:
        "A quantidade integrantes da equipe deve ser um número inteiro entre 1 e 5.",
    };
  }

  if (!Array.isArray(integrantes)) {
    return {
      erro: true,
      mensagem: "O Campo integrantes deve ser um Array de objetos.",
    };
  }

  if (integrantes.length !== quantidadeIntegrantes) {
    return {
      erro: true,
      mensagem:
        "O campo quantidade de integrantes deve ser igual a quantidade de integrantes enviada.",
    };
  }

  if (integrantes.length <= 0 || integrantes.length > 5) {
    return {
      erro: true,
      mensagem:
        "A quantidade de objetos enviados no campo membro deve ser maior que zero e menor que 5.",
    };
  }

  for (let membro = 0; membro < integrantes.length; membro++) {
    if (
      !integrantes[membro].nome ||
      typeof integrantes[membro].nome !== "string"
    ) {
      return {
        erro: true,
        mensagem: `O campo 'nome' do ${
          membro + 1
        }° membro é obrigatório e deve ser do tipo texto.`,
      };
    }

    if (!integrantes[membro].RA || typeof integrantes[membro].RA !== "string") {
      return {
        erro: true,
        mensagem: `O campo 'RA' do ${
          membro + 1
        }° membro é obrigatório e deve ser do tipo texto.`,
      };
    }
  }
}

function criarEquipe({ nome, quantidadeIntegrantes, integrantes }) {
  const equipe = new Equipe({
    nome,
    quantidadeIntegrantes,
    integrantes,
  });

  return equipe;
}

async function gravarEquipe({ equipe }) {
  try {
    await equipe.save();
  } catch (error) {
    throw new StatusError(error.message, error.status);
  }
}
module.exports = {
  executar,
};
