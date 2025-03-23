const { v4: uuidv4 } = require("uuid");
const StatusError = require("../../helpers/status/StatusError");
const { StatusOk } = require("../../helpers/status/StatusOk");
const Equipe = require("../../modelos/Equipe");
const { urlValida } = require("../../helpers/text");

async function executar({
  nome,
  quantidadeIntegrantes,
  integrantes,
  numeroCarrinho,
  logoUrl,
}) {
  try {
    validarParametros({
      nome,
      quantidadeIntegrantes,
      integrantes,
      numeroCarrinho,
      logoUrl,
    });
    const equipe = criarEquipe({
      nome,
      quantidadeIntegrantes,
      integrantes,
      numeroCarrinho,
      logoUrl,
    });
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

function validarParametros({
  nome,
  quantidadeIntegrantes,
  integrantes,
  numeroCarrinho,
  logoUrl,
}) {
  if (
    !nome ||
    !quantidadeIntegrantes ||
    !integrantes ||
    !numeroCarrinho ||
    !logoUrl
  ) {
    throw new StatusError(
      "Preencha todos os campos obrigatórios (nome, número do carrinho, integrantes, quantidade de integrantes e logo da equipe).",
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
    throw new StatusError(
      "A quantidade integrantes da equipe deve ser um número inteiro entre 1 e 5.",
      400
    );
  }

  if (!Array.isArray(integrantes)) {
    throw new StatusError(
      "O Campo integrantes deve ser um Array de objetos.",
      400
    );
  }

  if (integrantes.length !== quantidadeIntegrantes) {
    throw new StatusError(
      "O campo quantidade de integrantes deve ser igual a quantidade de integrantes enviada.",
      400
    );
  }

  if (integrantes.length <= 0 || integrantes.length > 5) {
    throw new StatusError(
      "A quantidade de objetos enviados no campo membro deve ser maior que zero e menor que 5.",
      400
    );
  }

  for (let membro = 0; membro < integrantes.length; membro++) {
    if (
      !integrantes[membro].nome ||
      typeof integrantes[membro].nome !== "string"
    ) {
      throw new StatusError(
        `O campo 'nome' do ${
          membro + 1
        }° membro é obrigatório e deve ser do tipo texto.`,
        400
      );
    }

    if (!integrantes[membro].RA || typeof integrantes[membro].RA !== "string") {
      throw new StatusError(
        `O campo 'RA' do ${
          membro + 1
        }° membro é obrigatório e deve ser do tipo texto.`,
        400
      );
    }

    if (
      !integrantes[membro].curso ||
      typeof integrantes[membro].curso !== "string"
    ) {
      throw new StatusError(
        `O campo 'curso' do ${
          membro + 1
        }° membro é obrigatório e deve ser do tipo texto.`,
        400
      );
    }
  }

  if (typeof numeroCarrinho !== "string") {
    throw new StatusError(
      "O número do carrinho pertecente a equipe, deve ser do tipo texto.",
      400
    );
  }

  if (!urlValida(logoUrl)) {
    throw new StatusError(
      "A URL da logo da equipe é inválida. Forneça uma URL válida.",
      400
    );
  }
}

function criarEquipe({
  nome,
  quantidadeIntegrantes,
  integrantes,
  numeroCarrinho,
  logoUrl,
}) {
  try {
    const equipe = new Equipe({
      nome,
      quantidadeIntegrantes,
      integrantes,
      codigo: uuidv4(),
      ativa: true,
      numeroCarrinho,
      logoUrl,
    });

    return equipe;
  } catch (error) {
    throw new StatusError(error.message, 400);
  }
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
