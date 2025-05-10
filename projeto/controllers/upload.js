const gerarUrlUploadImagem = require("../comandos/upload/gerarUrlUploadImagem");

const uploadController = {};

uploadController.gerarUrlUpload = async (req, res) => {
  try {
    const { filename, contentType } = req.query;

    const { erro, status, mensagem, data } = await gerarUrlUploadImagem.executar({
      filename,
      contentType,
    });

    if (erro) return res.status(status).json({ mensagem });

    res.status(status).json({
      mensagem,
      url: data.url,
    });
  } catch (error) {
    return res.status(500).json({
      mensagem: "Erro interno do servidor, tente novamente mais tarde",
    });
  }
};

module.exports = uploadController;
