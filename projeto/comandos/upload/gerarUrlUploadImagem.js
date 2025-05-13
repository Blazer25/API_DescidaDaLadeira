const { generatePresignedUrl } = require("../../helpers/aws/s3");
const StatusError = require("../../helpers/status/StatusError");
const { StatusOk } = require("../../helpers/status/StatusOk");

async function executar({ fileName, contentType }) {
  try {
    validarParametros({ fileName, contentType });
    const url = await generatePresignedUrl(fileName, contentType);

    return StatusOk({
      data: { url },
      status: 200,
      mensagem: "URL de upload gerada com sucesso!",
    });
  } catch (error) {
    console.error("Erro ao gerar URL de upload:", error);
    return {
      erro: true,
      status: error.status || 500,
      mensagem: error.message || "Erro ao gerar URL de upload.",
    };
  }
}

function validarParametros({ fileName, contentType }) {
  if (!fileName || !contentType) {
    throw new StatusError(
      "Preencha todos os campos obrigatórios (fileName e contentType).",
      400
    );
  }

  if (typeof fileName !== "string" || typeof contentType !== "string") {
    throw new StatusError(
      "Os campos fileName e contentType devem ser do tipo texto.",
      400
    );
  }

  const tiposPermitidos = [
    "image/jpeg",
    "image/png",
    "image/gif",
    "image/webp",
  ];
    if (!tiposPermitidos.includes(contentType)) {
        throw new StatusError(
        `Tipo de conteúdo não permitido. Tipos permitidos: ${tiposPermitidos.join(
            ", "
        )}.`,
        400
        );
    }
}

module.exports = {
  executar,
};