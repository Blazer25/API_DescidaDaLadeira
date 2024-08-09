const { executar } = require("../../../consultas/corrida/listarCorridas");
const StatusError = require("../../../helpers/status/StatusError");
const { StatusOk } = require("../../../helpers/status/StatusOk");
const consultasCorrida = require("../../../servicos/mongo/consultas/corridas");

jest.mock("../../../helpers/status/StatusError");
jest.mock("../../../helpers/status/StatusOk");
jest.mock("../../../servicos/mongo/consultas/corridas");

describe("Testes da função executar", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("deve listar todas as corridas com sucesso", async () => {
    const dados = [
      {
        codigo: "corrida1",
        dataHoraInicio: "2024-08-08T10:00:00Z",
        dataHoraFim: "2024-08-08T12:00:00Z",
        tempoTotal: "2h",
        temposChegadas: [
          {
            tempo: "1h30m",
            posicao: 1,
            equipe: {
              codigo: "equipe1",
              nome: "Equipe 1",
              integrantes: [{ RA: "123", nome: "Membro 1" }],
            },
          },
        ],
        estagio: "fase1",
      },
    ];

    consultasCorrida.listarTodasCorridas.mockResolvedValue(dados);

    StatusOk.mockImplementation(({ data, status, mensagem }) => ({
      data,
      status,
      mensagem,
    }));

    const resultado = await executar({});

    expect(resultado).toEqual({
      data: {
        corridas: dados,
      },
      status: 200,
      mensagem: "Corridas encontradas!",
    });
  });

  it("deve lançar um StatusError quando nenhuma corrida é encontrada", async () => {
    consultasCorrida.listarTodasCorridas.mockResolvedValue([]);

    StatusError.mockImplementation((message, status) => ({ message, status }));

    const resultado = await executar({});

    expect(resultado).toEqual({
      erro: true,
      status: 404,
      mensagem: "Nenhuma corrida encontrada.",
      dados: null,
    });
  });

  it("deve lançar um StatusError quando ocorre um erro ao listar as corridas", async () => {
    consultasCorrida.listarTodasCorridas.mockRejectedValue(
      new StatusError("Erro ao acessar o banco de dados", 500)
    );

    StatusError.mockImplementation((message, status) => ({ message, status }));

    const resultado = await executar({});

    expect(resultado).toEqual({
      erro: true,
      status: 500,
      mensagem: "Erro ao acessar o banco de dados",
      dados: null,
    });
  });
});
