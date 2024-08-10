const { executar } = require("../../../consultas/ranking/listarRanking");
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

  it("deve retornar o ranking com os melhores tempos", async () => {
    const corridasMock = [
      {
        estagio: "fase1",
        temposChegadas: [
          {
            equipe: { codigo: "equipe1", nome: "Equipe 1" },
            tempo: "00:05:300",
          },
          {
            equipe: { codigo: "equipe2", nome: "Equipe 2" },
            tempo: "00:04:250",
          },
          {
            equipe: { codigo: "equipe2", nome: "Equipe 2" },
            tempo: "00:01:100",
          },
        ],
      },
      {
        estagio: "fase2",
        temposChegadas: [
          {
            equipe: { codigo: "equipe1", nome: "Equipe 1" },
            tempo: "00:06:400",
          },
        ],
      },
      {
        estagio: "fase3",
        temposChegadas: [
          {
            equipe: { codigo: "equipe1", nome: "Equipe 1" },
            tempo: "00:05:300",
          },
          {
            equipe: { codigo: "equipe1", nome: "Equipe 1" },
            tempo: "00:05:300",
          },
          {
            equipe: { codigo: "equipe2", nome: "Equipe 2" },
            tempo: "00:04:250",
          },
          {
            equipe: { codigo: "equipe2", nome: "Equipe 2" },
            tempo: "00:00:010",
          },
          {
            equipe: { codigo: "equipe3", nome: "Equipe 3" },
            tempo: "00:01:100",
          },
        ],
      },
    ];

    consultasCorrida.listarTodasCorridas = jest
      .fn()
      .mockResolvedValue(corridasMock);
    StatusOk.mockImplementation(({ data, status, mensagem }) => ({
      data,
      status,
      mensagem,
    }));

    const resultado = await executar({});

    expect(resultado).toStrictEqual({
      data: {
        ranking: {
          fase1: [
            {
              equipe: { codigo: "equipe2", nome: "Equipe 2" },
              tempo: 1100,
              tempoFormatado: "00:01:100",
            },
            {
              equipe: { codigo: "equipe1", nome: "Equipe 1" },
              tempo: 5300,
              tempoFormatado: "00:05:300",
            },
          ],
          fase2: [
            {
              equipe: { codigo: "equipe1", nome: "Equipe 1" },
              tempo: 6400,
              tempoFormatado: "00:06:400",
            },
          ],
          fase3: [
            {
              equipe: { codigo: "equipe2", nome: "Equipe 2" },
              tempo: 10,
              tempoFormatado: "00:00:010",
            },
            {
              equipe: { codigo: "equipe3", nome: "Equipe 3" },
              tempo: 1100,
              tempoFormatado: "00:01:100",
            },
            {
              equipe: { codigo: "equipe1", nome: "Equipe 1" },
              tempo: 5300,
              tempoFormatado: "00:05:300",
            },
          ],
          fase4: [],
          fase5: [],
        },
      },
      mensagem: "Ranking com os melhores tempos encontrado.",
      status: 200,
    });
  });

  it("deve lançar um StatusError quando não há corridas para serem rankeadas", async () => {
    consultasCorrida.listarTodasCorridas = jest.fn().mockResolvedValue([]);
    StatusError.mockImplementation((message, status) => ({ message, status }));

    const resultado = await executar({});

    expect(resultado).toEqual({
      erro: true,
      status: 404,
      mensagem: "Não há corridas para serem rankeadas.",
      dados: null,
    });
  });

  it("deve lançar um StatusError quando ocorre um erro na consulta das corridas", async () => {
    const erroMock = new StatusError("Erro na consulta", 500);
    consultasCorrida.listarTodasCorridas = jest
      .fn()
      .mockRejectedValue(erroMock);
    StatusError.mockImplementation((message, status) => ({ message, status }));

    const resultado = await executar({});

    expect(resultado).toEqual({
      erro: true,
      status: 500,
      mensagem: "Erro na consulta",
      dados: null,
    });
  });
});
