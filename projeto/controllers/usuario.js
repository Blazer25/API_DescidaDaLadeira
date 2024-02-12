const listaUsuario = require("../consultas/usuario/listarUsuario.js");

const usuarioController = {};

usuarioController.listar = async (req, res) => {
  try {
    const login = req.params.usuario;
    const { erro, status, mensagem, data } = await listaUsuario.executar({
      login,
    });

    if (erro) return res.status(status).json({ mensagem });

    return res.status(status).json({ mensagem, usuario: data });
  } catch (error) {
    res.status(500).json({
      mensagem: "Erro interno do servidor, tente novamente mais tarde.",
    });
  }
};
module.exports = usuarioController;
