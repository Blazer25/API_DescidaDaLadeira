const registrarCorrida = require("../comandos/corrida/registrarCorrida");
const deletarCorrida = require("../comandos/corrida/deletarCorrida");
const listarCorridas = require("../consultas/corrida/listarCorridas");

const corridaController = {};

corridaController.registrar = async (req, res) => {
  try {
    const { dataHoraInicio, dataHoraFim, tempoTotal, temposChegadas } =
      req.body;

    const { erro, status, mensagem } = await registrarCorrida.executar({
      dataHoraInicio,
      dataHoraFim,
      tempoTotal,
      temposChegadas,
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
    res.status(500).json({
      mensagem: "Erro interno do servidor, tente novamente mais tarde",
    });
  }
};

corridaController.deletar = async (req, res) => {
  try {
    const { codigoCorrida } = req.query;

    const { erro, status, mensagem } = await deletarCorrida.executar({
      codigoCorrida,
    });

    if (erro) return res.status(status).json({ mensagem });

    res.status(status).json({ mensagem });
  } catch (err) {
    res.status(500).json({
      mensagem: "Erro interno do servidor, tente novamente mais tarde",
    });
  }
};

module.exports = corridaController;
