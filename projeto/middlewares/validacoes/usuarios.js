const validarInformacoesRegistrarUsuarios = ({
  login,
  senha,
  confirmarSenha,
}) => {
  if (!login || !senha || !confirmarSenha) {
    return {
      erro: true,
      mensagem:
        "Preencha todos os campos obrigatórios (login, senha e confirmarSenha)",
    };
  }

  if (
    typeof login !== "string" ||
    typeof senha !== "string" ||
    typeof confirmarSenha !== "string"
  ) {
    return {
      erro: true,
      mensagem: "Todos os campos devem ser do tipo texto",
    };
  }

  if (senha !== confirmarSenha) {
    return {
      erro: true,
      mensagem: "As senhas não conferem",
    };
  }

  return {
    erro: false,
  };
};

const validarInformacoesLogin = ({ login, senha }) => {
  if (!login || !senha) {
    return {
      erro: true,
      mensagem: "Preencha todos os campos obrigatórios (login e senha)",
    };
  }

  if (typeof login !== "string" || typeof senha !== "string") {
    return {
      erro: true,
      mensagem: "Todos os campos devem ser do tipo texto",
    };
  }

  return {
    erro: false,
  };
};
module.exports = {
  validarInformacoesRegistrarUsuarios,
  validarInformacoesLogin,
};
