const listarRanking = require("../consultas/ranking/listarRanking");

const rankingController = {};


rankingController.listar = async (req, res) => {
  try {
    const { erro, status, mensagem, data } = await listarRanking.executar({});

    if (erro) return res.status(status).json({ mensagem });

    res.status(status).json({
      mensagem,
      ranking: data.ranking,
    });
  } catch (err) {
    res.status(500).json({
      mensagem: "Erro interno do servidor, tente novamente mais tarde",
    });
  }
};


module.exports = rankingController;
