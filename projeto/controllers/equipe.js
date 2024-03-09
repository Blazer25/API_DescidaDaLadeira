const registrarEquipe = require("../comandos/equipe/registrarEquipe");
const alterarEquipe = require("../comandos/equipe/alterarEquipe");
const inativarEquipe = require("../comandos/equipe/inativarEquipe");
const listarEquipes = require("../consultas/equipe/listarEquipes");

const equipeController = {};

equipeController.registrar = async (req, res) => {
  try {
    const { nome, quantidadeIntegrantes, integrantes } = req.body;

    const { erro, status, mensagem } = await registrarEquipe.executar({
      nome,
      quantidadeIntegrantes,
      integrantes,
    });

    if (erro) return res.status(status).json({ mensagem });

    res.status(status).json({ mensagem });
  } catch (err) {
    res.status(500).json({
      mensagem: "Erro interno do servidor, tente novamente mais tarde",
    });
  }
};

equipeController.listar = async (req, res) => {
  try {
    const { erro, status, mensagem, data } = await listarEquipes.executar({});

    if (erro) return res.status(status).json({ mensagem });

    res.status(status).json({
      mensagem,
      total: data.esquipesMapeadas.length,
      equipes: data.esquipesMapeadas,
    });
  } catch (err) {
    res.status(500).json({
      mensagem: "Erro interno do servidor, tente novamente mais tarde",
    });
  }
};

equipeController.alterar = async (req, res) => {
  try {
    const { nomeEquipe, dadosIntegrantes } = req.body;
    const { codigoEquipe } = req.params;

    const { erro, status, mensagem } = await alterarEquipe.executar({
      codigoEquipe,
      nomeEquipe,
      dadosIntegrantes,
    });

    if (erro) return res.status(status).json({ mensagem });

    res.status(status).json({ mensagem });
  } catch (err) {
    res.status(500).json({
      mensagem: "Erro interno do servidor, tente novamente mais tarde",
    });
  }
};

equipeController.inativar = async (req, res) => {
  try {
    const { codigoEquipe } = req.query;

    const { erro, status, mensagem } = await inativarEquipe.executar({
      codigoEquipe
    });

    if (erro) return res.status(status).json({ mensagem });

    res.status(status).json({ mensagem });
  } catch (err) {
    res.status(500).json({
      mensagem: "Erro interno do servidor, tente novamente mais tarde",
    });
  }
};

module.exports = equipeController;
