const listarCorridas = require("../consultas/corrida/listarCorridas");

const rankingController = {};


rankingController.listar = async (req, res) => {
  try {
    const { erro, status, mensagem, data } = await listarCorridas.executar({});

    if (erro) return res.status(status).json({ mensagem });

    res.status(status).json({
      mensagem,
      total: data.corridas.length,
      corridas: data.corridas,
    });
  } catch (err) {
    res.status(500).json({
      mensagem: "Erro interno do servidor, tente novamente mais tarde",
    });
  }
};


module.exports = rankingController;
