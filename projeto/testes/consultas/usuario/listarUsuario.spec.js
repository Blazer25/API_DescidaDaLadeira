const { executar } = require("../../../consultas/usuario/listarUsuario");
const StatusError = require("../../../helpers/status/StatusError");
const { StatusOk } = require("../../../helpers/status/StatusOk");
const consultasUsuarios = require("../../../servicos/mongo/consultas/usuarios");

jest.mock("../../../helpers/status/StatusError");
jest.mock("../../../helpers/status/StatusOk");
jest.mock("../../../servicos/mongo/consultas/usuarios");

describe("Testes da função executar", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("deve encontrar o usuário com sucesso", async () => {
    const dados = {
      login: "usuario123",
    };

    const usuarioMock = {
      _id: "user-id",
      login: "usuario123",
    };

    consultasUsuarios.verificaExistenciaUsuarioPeloLogin = jest.fn().mockResolvedValue(usuarioMock);
    StatusOk.mockImplementation(({ data, status, mensagem }) => ({
      data,
      status,
      mensagem,
    }));

    const resultado = await executar(dados);

    expect(resultado).toEqual({
      data: {
        id: "user-id",
        login: "usuario123",
      },
      status: 200,
      mensagem: "Usuário encontrado!",
    });
  });

  it("deve lançar um StatusError quando o parâmetro login é obrigatório", async () => {
    const dados = {};

    StatusError.mockImplementation((message, status) => ({ message, status }));

    const resultado = await executar(dados);

    expect(resultado).toEqual({
      erro: true,
      status: 400,
      mensagem: "O parâmetro login é obrigatório!",
      dados: null,
    });
  });

  it("deve lançar um StatusError quando o parâmetro login não é do tipo texto", async () => {
    const dados = {
      login: 123,
    };

    StatusError.mockImplementation((message, status) => ({ message, status }));

    const resultado = await executar(dados);

    expect(resultado).toEqual({
      erro: true,
      status: 400,
      mensagem: "O parâmetro login deve ser do tipo texto!",
      dados: null,
    });
  });

  it("deve lançar um StatusError quando o usuário não é encontrado", async () => {
    const dados = {
      login: "usuario123",
    };

    consultasUsuarios.verificaExistenciaUsuarioPeloLogin = jest.fn().mockResolvedValue(null);
    StatusError.mockImplementation((message, status) => ({ message, status }));

    const resultado = await executar(dados);

    expect(resultado).toEqual({
      erro: true,
      status: 404,
      mensagem: "Usuário não encontrado!",
      dados: null,
    });
  });

  it("deve lançar um StatusError quando ocorre um erro na consulta do usuário", async () => {
    const dados = {
      login: "usuario123",
    };

    const erroMock = new StatusError("Erro na consulta", 500);
    consultasUsuarios.verificaExistenciaUsuarioPeloLogin = jest.fn().mockRejectedValue(erroMock);
    StatusError.mockImplementation((message, status) => ({ message, status }));

    const resultado = await executar(dados);

    expect(resultado).toEqual({
      erro: true,
      status: 500,
      mensagem: "Erro na consulta",
      dados: null,
    });
  });
});
