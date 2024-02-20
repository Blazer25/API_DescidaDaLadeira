const registrarCorrida = require("../comandos/corrida/registrarCorrida");
const listarCorridas = require("../consultas/corrida/listarCorridas");

const corridaController = {};

corridaController.registrar = async (req, res) => {
  try {
    const { dataHoraInicio, dataHoraFim, tempoTotal, temposChegadas } = req.body;

    const { erro, status, mensagem } = await registrarCorrida.executar({
      dataHoraInicio, dataHoraFim, tempoTotal, temposChegadas
    });

    if (erro) return res.status(status).json({ mensagem });

    res.status(status).json({ mensagem });
  } catch (err) {
    res.status(500).json({
      mensagem: "Erro interno do servidor, tente novamente mais tarde",
    });
  }
};

corridaController.listar = async (req, res) => {
  try {
    const { erro, status, mensagem, data } = await listarCorridas.executar({});

    if (erro) return res.status(status).json({ mensagem });

    res.status(status).json({
      mensagem,
      total: data.corridas.length,
      corridas: data.corridas,
    });
  } catch (err) {
    console.log(err)
    res.status(500).json({
      mensagem: "Erro interno do servidor, tente novamente mais tarde",
    });
  }
};

module.exports = corridaController;
