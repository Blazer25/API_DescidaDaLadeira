const { executar } = require("../../../consultas/equipe/listarEquipesPorFase.js");
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

  it("deve listar todas as equipes por fase com sucesso", async () => {
    const dados = {
      filtros: { fase: "fase1" },
    };

    const equipesPorFaseMock = [
      {
        codigo: "equipe1",
        fase: "fase1",
        nome: "Equipe 1",
        quantidadeIntegrantes: 3,
        integrantes: [{ RA: "123", nome: "Membro 1" }],
      },
      {
        codigo: "equipe2",
        fase: "fase1",
        nome: "Equipe 2",
        quantidadeIntegrantes: 2,
        integrantes: [{ RA: "456", nome: "Membro 2" }],
      },
    ];

    consultasEquipe.listarTodasEquipesPorFase = jest
      .fn()
      .mockResolvedValue(equipesPorFaseMock);
    StatusOk.mockImplementation(({ data, status, mensagem }) => ({
      data,
      status,
      mensagem,
    }));

    const resultado = await executar(dados);

    expect(resultado).toEqual({
      data: {
        equipesPorFase: equipesPorFaseMock,
      },
      status: 200,
      mensagem: "Equipes por fase encontradas!",
    });
  });

  it("deve lançar um StatusError quando nenhuma equipe por fase é encontrada", async () => {
    const dados = {
      filtros: { fase: "fase1" },
    };

    consultasEquipe.listarTodasEquipesPorFase = jest.fn().mockResolvedValue([]);
    StatusError.mockImplementation((message, status) => ({ message, status }));

    const resultado = await executar(dados);

    expect(resultado).toEqual({
      erro: true,
      status: 404,
      mensagem: "Nenhuma equipe por fase encontrada.",
      dados: null,
    });
  });

  it("deve lançar um StatusError quando ocorre um erro na consulta das equipes por fase", async () => {
    const dados = {
      filtros: { fase: "fase1" },
    };

    const erroMock = new StatusError("Erro na consulta", 500);
    consultasEquipe.listarTodasEquipesPorFase = jest
      .fn()
      .mockRejectedValue(erroMock);
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
