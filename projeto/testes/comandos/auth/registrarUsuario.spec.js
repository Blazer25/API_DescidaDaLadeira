const { executar } = require("../../../comandos/auth/registrarUsuario");
const StatusError = require("../../../helpers/status/StatusError");
const { StatusOk } = require("../../../helpers/status/StatusOk");
const Usuario = require("../../../modelos/Usuario");
const consultasUsuarios = require("../../../servicos/mongo/consultas/usuarios");
const bcrypt = require("bcrypt");

jest.mock("../../../helpers/status/StatusError");
jest.mock("../../../helpers/status/StatusOk");
jest.mock("../../../modelos/Usuario");
jest.mock("../../../servicos/mongo/consultas/usuarios");
jest.mock("bcrypt");

describe("Testes da função executar", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("deve registrar um usuário com sucesso", async () => {
    const dados = {
      login: "usuario1",
      senha: "senha123",
      confirmarSenha: "senha123",
    };

    consultasUsuarios.verificaExistenciaUsuarioPeloLogin.mockResolvedValue(null);
    bcrypt.genSalt.mockResolvedValue("salt");
    bcrypt.hash.mockResolvedValue("senhaCriptografada");
    Usuario.prototype.save = jest.fn();

    StatusOk.mockImplementation(({ data, status, mensagem }) => ({
      data,
      status,
      mensagem,
    }));

    const resultado = await executar(dados);

    expect(resultado).toEqual({
      data: null,
      status: 201,
      mensagem: "Usuário criado com sucesso!",
    });
  });

  it("deve lançar um StatusError quando parâmetros são inválidos", async () => {
    const dados = {
      login: null,
      senha: "senha123",
      confirmarSenha: "senha123",
    };

    StatusError.mockImplementation((message, status) => ({ message, status }));

    const resultado = await executar(dados);

    expect(resultado).toEqual({
      erro: true,
      status: 400,
      mensagem: "Preencha todos os campos obrigatórios (login, senha e confirmarSenha).",
    });
  });

  it("deve lançar um StatusError quando as senhas não conferem", async () => {
    const dados = {
      login: "usuario1",
      senha: "senha123",
      confirmarSenha: "senha321",
    };

    StatusError.mockImplementation((message, status) => ({ message, status }));

    const resultado = await executar(dados);

    expect(resultado).toEqual({
      erro: true,
      status: 400,
      mensagem: "As senhas não conferem.",
    });
  });

  it("deve lançar um StatusError quando o login já existe", async () => {
    const dados = {
      login: "usuario1",
      senha: "senha123",
      confirmarSenha: "senha123",
    };

    consultasUsuarios.verificaExistenciaUsuarioPeloLogin.mockResolvedValue({
      login: "usuario1",
    });

    StatusError.mockImplementation((message, status) => ({ message, status }));

    const resultado = await executar(dados);

    expect(resultado).toEqual({
      erro: true,
      status: 400,
      mensagem: "Login já existente para outro usuário!",
    });
  });

  it("deve lançar um StatusError quando ocorrer um erro ao salvar o usuário", async () => {
    const dados = {
      login: "usuario1",
      senha: "senha123",
      confirmarSenha: "senha123",
    };

    consultasUsuarios.verificaExistenciaUsuarioPeloLogin.mockResolvedValue(null);
    bcrypt.genSalt.mockResolvedValue("salt");
    bcrypt.hash.mockResolvedValue("senhaCriptografada");

    const mockSave = jest.fn(() => {
      throw new StatusError("Erro ao salvar usuário", 500);
    });

    Usuario.mockImplementation(() => ({
      save: mockSave,
    }));

    const resultado = await executar(dados);

    expect(resultado).toEqual({
      erro: true,
      status: 500,
      mensagem: "Erro ao salvar usuário",
    });
  });
});
