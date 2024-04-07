const registrarEquipe = require("../comandos/equipe/registrarEquipe");
const alterarEquipe = require("../comandos/equipe/alterarEquipe");
const inativarAtivarEquipe = require("../comandos/equipe/inativarAtivarEquipe");
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
    const { ativas } = req.query;
    const filtros = {
      ativas,
    };
    console.log(filtros)
    const { erro, status, mensagem, data } = await listarEquipes.executar({
      filtros,
    });

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

equipeController.inativarAtivar = async (req, res) => {
  try {
    const { codigoEquipe } = req.params;

    const { erro, status, mensagem } = await inativarAtivarEquipe.executar({
      codigoEquipe,
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
