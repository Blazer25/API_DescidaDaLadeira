const validarInformacoesRegistrarEquipe = ({
  nome,
  quantidadeIntegrantes,
  integrantes,
}) => {
  if (!nome || !quantidadeIntegrantes || !integrantes) {
    return {
      erro: true,
      mensagem:
        "Preencha todos os campos obrigatórios (nome, quantidade de integrantes e integrantes).",
    };
  }

  if (typeof nome !== "string") {
    return {
      erro: true,
      mensagem: "O nome da equipe deve ser do tipo texto.",
    };
  }

  if (
    typeof quantidadeIntegrantes !== "number" ||
    quantidadeIntegrantes <= 0 ||
    quantidadeIntegrantes > 5 ||
    !Number.isInteger(quantidadeIntegrantes)
  ) {
    return {
      erro: true,
      mensagem:
        "A quantidade integrantes da equipe deve ser um número inteiro entre 1 e 5.",
    };
  }

  if (!Array.isArray(integrantes)) {
    return {
      erro: true,
      mensagem: "O Campo integrantes deve ser um Array de objetos.",
    };
  }

  if (integrantes.length !== quantidadeIntegrantes) {
    return {
      erro: true,
      mensagem:
        "O campo quantidade de integrantes deve ser igual a quantidade de integrantes enviada.",
    };
  }

  if (integrantes.length <= 0 || integrantes.length > 5) {
    return {
      erro: true,
      mensagem:
        "A quantidade de objetos enviados no campo membro deve ser maior que zero e menor que 5.",
    };
  }

  for (let membro = 0; membro < integrantes.length; membro++) {
    if (
      !integrantes[membro].nome ||
      typeof integrantes[membro].nome !== "string"
    ) {
      return {
        erro: true,
        mensagem: `O campo 'nome' do ${
          membro + 1
        } membro é obrigatório e deve ser do tipo texto.`,
      };
    }

    if (!integrantes[membro].RA || typeof integrantes[membro].RA !== "string") {
      return {
        erro: true,
        mensagem: `O campo 'RA' do ${
          membro + 1
        } membro é obrigatório e deve ser do tipo texto.`,
      };
    }
  }

  return {
    erro: false,
  };
};

module.exports = {
  validarInformacoesRegistrarEquipe,
};
