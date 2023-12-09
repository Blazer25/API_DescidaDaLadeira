const Equipe = require("../modelos/Equipe.js");
const validacoesEquipe = require("../middlewares/validacoes/equipe.js");
const consultasEquipe = require("../servicos/mongo/consultas/equipes.js");

const equipeController = {};

equipeController.registrar = async (req, res) => {
  try {
    const { nome, quantidadeIntegrantes, integrantes } = req.body;

    const resValidacoes = validacoesEquipe.validarInformacoesRegistrarEquipe({
      nome,
      quantidadeIntegrantes,
      integrantes,
    });

    if (resValidacoes.erro && resValidacoes.mensagem) {
      return res.status(400).json({ mensagem: resValidacoes.mensagem });
    }

    const equipe = new Equipe({
      nome,
      quantidadeIntegrantes,
      integrantes,
    });
    equipe.save();
    res.status(201).json({ mensagem: "Equipe registrada com sucesso!" });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      mensagem: "Erro interno do servidor, tente novamente mais tarde",
    });
  }
};

equipeController.listar = async (req, res) => {
  try {
    const resultado = await consultasEquipe.listarTodasEquipes();
    console.log(resultado);

    if (!resultado || !resultado.length) {
      res.status(404).json({
        mensagem: "Nenhuma equipe encontrada.",
        total: 0,
        equipes: [],
      });
      return;
    }

    const esquipesMapeadas = resultado.map((equipe) => {
      return {
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

    res.status(200).json({
      mensagem: "Equipes encontradas.",
      total: resultado.length,
      equipes: esquipesMapeadas,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      mensagem: "Erro interno do servidor, tente novamente mais tarde",
    });
  }
};

module.exports = equipeController;
