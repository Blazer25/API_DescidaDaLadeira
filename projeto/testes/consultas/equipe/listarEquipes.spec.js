const { executar } = require("../../../consultas/equipe/listarEquipes");
const StatusError = require("../../../helpers/status/StatusError");
const { StatusOk } = require("../../../helpers/status/StatusOk");
const consultasEquipe = require("../../../servicos/mongo/consultas/equipes");

jest.mock("../../../helpers/status/StatusError");
jest.mock("../../../helpers/status/StatusOk");
jest.mock("../../../servicos/mongo/consultas/equipes");

describe("Testes da função executar", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("deve listar todas as equipes com sucesso", async () => {
    const dados = {
      filtros: {},
    };

    const equipesMock = [
      {
        codigo: "equipe1",
        ativa: true,
        nome: "Equipe 1",
        quantidadeIntegrantes: 1,
        integrantes: [{ RA: "123", nome: "Membro 1" }],
      },
      {
        codigo: "equipe2",
        ativa: false,
        nome: "Equipe 2",
        quantidadeIntegrantes: 2,
        integrantes: [{ RA: "456", nome: "Membro 2" }],
      },
    ];

    consultasEquipe.listarTodasEquipes = jest
      .fn()
      .mockResolvedValue(equipesMock);
    StatusOk.mockImplementation(({ data, status, mensagem }) => ({
      data,
      status,
      mensagem,
    }));

    const resultado = await executar(dados);

    expect(resultado).toEqual({
      data: {
        esquipesMapeadas: [
          {
            codigo: "equipe1",
            ativa: true,
            nome: "Equipe 1",
            quantidadeIntegrantes: 1,
            integrantes: [{ nome: "Membro 1", RA: "123" }],
          },
          {
            codigo: "equipe2",
            ativa: false,
            nome: "Equipe 2",
            quantidadeIntegrantes: 2,
            integrantes: [{ nome: "Membro 2", RA: "456" }],
          },
        ],
      },
      status: 200,
      mensagem: "Equipes encontradas!",
    });
  });

  it("deve lançar um StatusError quando nenhuma equipe é encontrada", async () => {
    const dados = {
      filtros: {},
    };

    consultasEquipe.listarTodasEquipes = jest.fn().mockResolvedValue([]);
    StatusError.mockImplementation((message, status) => ({ message, status }));

    const resultado = await executar(dados);

    expect(resultado).toEqual({
      erro: true,
      status: 404,
      mensagem: "Nenhuma equipe encontrada.",
      dados: null,
    });
  });

  it("deve lançar um StatusError quando ocorre um erro na consulta das equipes", async () => {
    const dados = {
      filtros: {},
    };

    const erroMock = new StatusError("Erro na consulta", 500);
    consultasEquipe.listarTodasEquipes = jest.fn().mockRejectedValue(erroMock);
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
