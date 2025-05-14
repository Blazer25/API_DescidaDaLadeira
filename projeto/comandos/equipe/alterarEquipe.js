const StatusError = require("../../helpers/status/StatusError");
const { StatusOk } = require("../../helpers/status/StatusOk");
const { urlValida } = require("../../helpers/text");
const Equipe = require("../../modelos/Equipe");
const consultasEquipe = require("../../servicos/mongo/consultas/equipes");
const repositoriosEquipe = require("../../servicos/mongo/repositorios/equipes");

async function executar({
  codigoEquipe,
  nomeEquipe,
  dadosIntegrantes,
  numeroCarrinho,
  logoUrl,
}) {
  try {
    if (!codigoEquipe || typeof codigoEquipe !== "string") {
      throw new StatusError(
        'Código da equipe é obrigatório e deve ser do tipo "texto".',
        400
      );
    }

    const equipe = await listarEquipePeloCodigo({ codigo: codigoEquipe });
    if (!equipe) {
      throw new StatusError("Equipe não encontrada para ser editada!", 404);
    }

    // Validação dos parâmetros opcionais
    if (nomeEquipe && typeof nomeEquipe !== "string") {
      throw new StatusError('Nome da equipe deve ser do tipo "texto".', 400);
    }
    if (numeroCarrinho && typeof numeroCarrinho !== "string") {
      throw new StatusError(
        "O número do carrinho deve ser do tipo texto.",
        400
      );
    }
    if (logoUrl && !urlValida(logoUrl)) {
      throw new StatusError(
        "A URL da logo da equipe é inválida. Forneça uma URL válida.",
        400
      );
    }
    if (dadosIntegrantes) {
      if (!Array.isArray(dadosIntegrantes)) {
        throw new StatusError(
          'Dados dos integrantes deve ser do tipo "array".',
          400
        );
      }
      if (dadosIntegrantes.length > equipe.quantidadeIntegrantes) {
        throw new StatusError(
          "Foram passados mais dados de integrantes do que essa equipe possui!",
          400
        );
      }
      dadosIntegrantes.forEach((integrante, index) => {
        if (integrante && typeof integrante !== "object") {
          throw new StatusError(
            `Os dados dos integrantes devem ser um objeto ({})`,
            400
          );
        }
        if (integrante.RA && typeof integrante.RA !== "string") {
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
        if (integrante.nome && typeof integrante.nome !== "string") {
          throw new StatusError(
            `O nome do ${index + 1}° integrante deve ser do tipo "texto"`,
            400
          );
        }
        if (integrante.curso && typeof integrante.curso !== "string") {
          throw new StatusError(
            `O curso do ${index + 1}° integrante deve ser do tipo "texto"`,
            400
          );
        }
      });
    }

    if (numeroCarrinho) {
      const equipeComNumeroCarrinho =
        await consultasEquipe.obterPeloNumeroDoCarrinho({ numeroCarrinho });
      if (
        equipeComNumeroCarrinho &&
        equipeComNumeroCarrinho.codigo !== codigoEquipe
      ) {
        throw new StatusError(
          "Número do carrinho já está sendo utilizado por outra equipe!",
          400
        );
      }
    }

    // Atualização dos campos
    if (nomeEquipe) equipe.nome = nomeEquipe;
    if (numeroCarrinho) equipe.numeroCarrinho = numeroCarrinho;
    if (logoUrl) equipe.logoUrl = logoUrl;

    if (dadosIntegrantes) {
      equipe.integrantes = atualizarDadosIntegrantes({
        dadosIntegrantes,
        equipe,
      });
      equipe.quantidadeIntegrantes = equipe.integrantes.length;
    }

    await atualizarEquipe({ codigo: codigoEquipe, equipe });

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

async function listarEquipePeloCodigo({ codigo }) {
  const equipe = await consultasEquipe.listarEquipePeloCodigo({ codigo });
  return equipe;
}

function atualizarDadosIntegrantes({ dadosIntegrantes, equipe }) {
  const integrantesAtualizados = [...equipe.integrantes];
  dadosIntegrantes.forEach((integrante) => {
    const idx = integrantesAtualizados.findIndex(
      (i) => i.RA === integrante.RA_Atual
    );
    if (idx !== -1) {
      integrantesAtualizados[idx] = {
        ...integrantesAtualizados[idx],
        ...integrante,
        RA: integrante.RA || integrantesAtualizados[idx].RA,
        nome: integrante.nome || integrantesAtualizados[idx].nome,
        curso: integrante.curso || integrantesAtualizados[idx].curso,
      };
    }
  });
  return integrantesAtualizados;
}

async function atualizarEquipe({ codigo, equipe }) {
  await repositoriosEquipe.atualizarEquipe({ codigo }, equipe);
}

module.exports = {
  executar,
};
