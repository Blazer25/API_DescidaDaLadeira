const StatusError = require("../../helpers/status/StatusError");
const { StatusOk } = require("../../helpers/status/StatusOk");
const consultasEquipe = require("../../servicos/mongo/consultas/equipes");

async function executar({filtros}) {
  try {
    const resultado = await consultasEquipe.listarTodasEquipes({filtros});

    if (!resultado || !resultado.length) {
      throw new StatusError("Nenhuma equipe encontrada.", 404);
    }

    const esquipesMapeadas = resultado.map((equipe) => {
      return {
        codigo: equipe.codigo,
        ativa: equipe.ativa,
        nome: equipe.nome,
        quantidadeIntegrantes: equipe.quantidadeIntegrantes,
        integrantes: equipe.integrantes.map((integrante) => {
          return {
            nome: integrante.nome,
            RA: integrante.RA,
          };
        }),
      };
    });

    return StatusOk({
      data: {
        esquipesMapeadas,
      },
      status: 200,
      mensagem: "Equipes encontradas!",
    });
  } catch (error) {
    return {
      erro: true,
      status: error.status || 500,
      mensagem: error.message || "Erro desconhecido ao listar equipes.",
      dados: null,
    };
  }
}

module.exports = {
  executar,
};
