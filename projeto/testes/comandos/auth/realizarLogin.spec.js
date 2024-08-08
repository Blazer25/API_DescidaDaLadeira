const { executar } = require("../../../comandos/auth/realizarLogin");
const StatusError = require("../../../helpers/status/StatusError");
const { StatusOk } = require("../../../helpers/status/StatusOk");
const consultasUsuarios = require("../../../servicos/mongo/consultas/usuarios");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

jest.mock("../../../helpers/status/StatusError");
jest.mock("../../../helpers/status/StatusOk");
jest.mock("../../../servicos/mongo/consultas/usuarios");
jest.mock("bcrypt");
jest.mock("jsonwebtoken");

describe("Testes da função executar", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("deve realizar login com sucesso", async () => {
    const dados = {
      login: "usuario@example.com",
      senha: "senha123",
    };

    const usuarioMock = {
      _id: "user-id",
      login: "usuario@example.com",
      senha: "$2b$10$hashedpassword", // Senha já hasheada
    };

    StatusOk.mockImplementation(({ data, status, mensagem }) => ({
      data,
      status,
      mensagem,
    }));

    consultasUsuarios.verificaExistenciaUsuarioPeloLogin = jest
      .fn()
      .mockResolvedValue(usuarioMock);
    bcrypt.compare = jest.fn().mockResolvedValue(true);
    jwt.sign = jest.fn().mockReturnValue("mock-token");

    const resultado = await executar(dados);

    expect(resultado).toEqual({
      data: {
        token: "mock-token",
        usuario: "usuario@example.com",
      },
      status: 201,
      mensagem: "Login realizado com sucesso!",
    });
  });

  it("deve lançar um StatusError quando os parâmetros são inválidos", async () => {
    const dados = {
      login: null,
      senha: "senha123",
    };

    StatusError.mockImplementation((message, status) => ({ message, status }));

    const resultado = await executar(dados);

    expect(resultado).toEqual({
      erro: true,
      status: 400,
      mensagem: "Preencha todos os campos obrigatórios (login e senha).",
    });
  });

  it("deve lançar um StatusError quando o login não existe", async () => {
    const dados = {
      login: "usuario@example.com",
      senha: "senha123",
    };

    StatusError.mockImplementation((message, status) => ({ message, status }));

    consultasUsuarios.verificaExistenciaUsuarioPeloLogin = jest
      .fn()
      .mockResolvedValue(null);

    const resultado = await executar(dados);

    expect(resultado).toEqual({
      erro: true,
      status: 400,
      mensagem: "Usuário ou senha incorretos!",
    });
  });

  it("deve lançar um StatusError quando a senha é inválida", async () => {
    const dados = {
      login: "usuario@example.com",
      senha: "senha123",
    };

    const usuarioMock = {
      _id: "user-id",
      login: "usuario@example.com",
      senha: "$2b$10$hashedpassword", // Senha já hasheada
    };

    StatusError.mockImplementation((message, status) => ({ message, status }));
    consultasUsuarios.verificaExistenciaUsuarioPeloLogin = jest
      .fn()
      .mockResolvedValue(usuarioMock);
    bcrypt.compare = jest.fn().mockResolvedValue(false);

    const resultado = await executar(dados);

    expect(resultado).toEqual({
      erro: true,
      status: 400,
      mensagem: "Usuário ou senha incorretos!",
    });
  });

  it("deve lançar um StatusError quando ocorrer um erro ao gerar o token", async () => {
    const dados = {
      login: "usuario@example.com",
      senha: "senha123",
    };

    const usuarioMock = {
      _id: "user-id",
      login: "usuario@example.com",
      senha: "$2b$10$hashedpassword", // Senha já hasheada
    };

    StatusError.mockImplementation((message, status) => ({ message, status }));
    consultasUsuarios.verificaExistenciaUsuarioPeloLogin = jest
      .fn()
      .mockResolvedValue(usuarioMock);
    bcrypt.compare = jest.fn().mockResolvedValue(true);
    jwt.sign = jest.fn(() => {
      throw new Error("Erro ao gerar token");
    });

    const resultado = await executar(dados);

    expect(resultado).toEqual({
      erro: true,
      status: 500,
      mensagem: "Erro ao gerar token",
    });
  });
});
