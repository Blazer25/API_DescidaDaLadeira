const packageJSON = require("../../package.json")

const servidorController = {}

servidorController.getHealth = (req, res) => {
  res.status(200).json({ mensagem: "Servidor online :)" });
}

servidorController.getVersao = (req, res) => {
  res.status(200).json({ mensagem: `Servidor online na versão ${packageJSON.version}` });
}

module.exports = servidorController;