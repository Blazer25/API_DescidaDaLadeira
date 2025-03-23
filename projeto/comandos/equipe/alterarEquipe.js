const StatusError = require("../../helpers/status/StatusError");
const { StatusOk } = require("../../helpers/status/StatusOk");
const { urlValida } = require("../../helpers/text");
const Equipe = require("../../modelos/Equipe");
const consultasEquipe = require("../../servicos/mongo/consultas/equipes");
const repositoriosEquipe = require("../../servicos/mongo/repositorios/equipes");

async function executar({
  codigoEquipe,
  nomeEquipe,
  dadosIntegrantes = [],
  numeroCarrinho,
  logoUrl,
}) {
  try {
    validarParametros({
      codigoEquipe,
      nomeEquipe,
      dadosIntegrantes,
      numeroCarrinho,
      logoUrl,
    });
    const equipe = await listarEquipePeloCodigo({ codigo: codigoEquipe });
    verificaQuantidadeIntegrantes({ equipe, dadosIntegrantes });

    const dadosIntegrantesAtualizados = atualizarDadosIntegrantes({
      dadosIntegrantes,
      equipe,
    });

    const equipeAtualizada = instanciarEquipeAtualizada({
      equipeDesatualizada: equipe,
      nomeEquipe,
      dadosIntegrantes: dadosIntegrantesAtualizados,
      numeroCarrinho,
      logoUrl,
    });

    await atualizarEquipe({ codigo: codigoEquipe, equipe: equipeAtualizada });

    return StatusOk({
      data: null,
      status: 201,
      mensagem: "Equipe atualizada com sucesso!",
    });
  } catch (error) {
    return {
      erro: true,
      status: error.status || 500,
      mensagem: error.message || "Erro desconhecido ao atualizar equipe.",
    };
  }
}

function validarParametros({
  codigoEquipe,
  nomeEquipe,
  dadosIntegrantes,
  numeroCarrinho,
  logoUrl,
}) {
  if (!codigoEquipe || typeof codigoEquipe !== "string") {
    throw new StatusError(
      'Código da equipe é obrigatório e deve ser do tipo "texto".',
      400
    );
  }

  if (nomeEquipe && typeof nomeEquipe !== "string") {
    throw new StatusError('Nome da equipe deve ser do tipo "texto".', 400);
  }

  if (dadosIntegrantes) {
    if (!Array.isArray(dadosIntegrantes)) {
      throw new StatusError(
        'Dados dos integrantes deve ser do tipo "array".',
        400
      );
    }

    dadosIntegrantes.forEach((integrante, index) => {
      if (!integrante || typeof integrante !== "object") {
        throw new StatusError(
          `Os dados dos integrantes devem ser um objeto ({})`,
          400
        );
      }

      if (!integrante.RA || typeof integrante.RA !== "string") {
        throw new StatusError(
          `O RA do ${index + 1}° integrante deve ser do tipo "texto".`,
          400
        );
      }

      if (!integrante.RA_Atual || typeof integrante.RA_Atual !== "string") {
        throw new StatusError(
          `O RA atual do ${index + 1}° integrante deve ser do tipo "texto"`,
          400
        );
      }

      if (!integrante.nome || typeof integrante.nome !== "string") {
        throw new StatusError(
          `O nome do ${index + 1}° integrante deve ser do tipo "texto"`,
          400
        );
      }

      if (!integrante.curso || typeof integrante.curso !== "string") {
        throw new StatusError(
          `O curso do ${index + 1}° integrante deve ser do tipo "texto"`,
          400
        );
      }
    });

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
}

async function listarEquipePeloCodigo({ codigo }) {
  const equipe = await consultasEquipe.listarEquipePeloCodigo({ codigo });
  if (!equipe) {
    throw new StatusError("Equipe não encontrada para ser editada!", 404);
  }
  return equipe;
}

function verificaQuantidadeIntegrantes({ equipe, dadosIntegrantes }) {
  if (dadosIntegrantes.length > equipe.quantidadeIntegrantes) {
    throw new StatusError(
      "Foram passados mais dados de integrantes do que essa equipe possui!",
      400
    );
  }
}

function atualizarDadosIntegrantes({ dadosIntegrantes, equipe }) {
  const dadosIntegrantesDesatualizados = equipe.integrantes;

  const dadosIntegrantesAtualizados = dadosIntegrantes.forEach((integrante) => {
    const integranteDesatualizado = dadosIntegrantesDesatualizados.find(
      (integranteDesatualizado) =>
        integranteDesatualizado.RA === integrante.RA_Atual
    );

    integranteDesatualizado.RA = integrante.RA || integranteDesatualizado.RA;
    integranteDesatualizado.nome =
      integrante.nome || integranteDesatualizado.nome;

    return integranteDesatualizado;
  });

  return dadosIntegrantesAtualizados;
}

function instanciarEquipeAtualizada({
  equipeDesatualizada,
  nomeEquipe,
  dadosIntegrantes,
  numeroCarrinho,
  logoUrl,
}) {
  const integrantes = dadosIntegrantes || equipeDesatualizada.integrantes;
  const equipeAtualizada = new Equipe({
    codigo: equipeDesatualizada.codigo,
    nome: nomeEquipe || equipeDesatualizada.nome,
    integrantes: integrantes,
    quantidadeIntegrantes: integrantes.length,
    numeroCarrinho,
    logoUrl,
  });

  return equipeAtualizada;
}

async function atualizarEquipe({ codigo, equipe }) {
  await repositoriosEquipe.atualizarEquipe({ codigo }, equipe);
}

module.exports = {
  executar,
};
