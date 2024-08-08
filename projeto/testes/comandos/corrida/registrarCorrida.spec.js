const { executar } = require("../../../comandos/corrida/registrarCorrida");
const StatusError = require("../../../helpers/status/StatusError");
const { StatusOk } = require("../../../helpers/status/StatusOk");
const Corrida = require("../../../modelos/Corrida");
const consultasEquipe = require("../../../servicos/mongo/consultas/equipes");
const { v4: uuidv4 } = require("uuid");

// Mocks
jest.mock("uuid", () => ({
  v4: jest.fn(() => "mock-uuid"),
}));
jest.mock("../../../helpers/status/StatusError");
jest.mock("../../../helpers/status/StatusOk");
jest.mock("../../../modelos/Corrida");
jest.mock("../../../servicos/mongo/consultas/equipes");

describe("Testes da função executar", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("deve registrar a corrida com sucesso", async () => {
    const dados = {
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
    };

    Corrida.prototype.save = jest.fn();
    StatusOk.mockImplementation(({ data, status, mensagem }) => ({
      data,
      status,
      mensagem,
    }));

    consultasEquipe.listarEquipePeloCodigo = jest.fn().mockResolvedValue({
      codigo: "equipe1",
      nome: "Equipe 1",
      integrantes: [{ RA: "123", nome: "Membro 1" }],
    });

    const resultado = await executar(dados);

    expect(resultado).toEqual({
      data: null,
      status: 201,
      mensagem: "Corrida registrada com sucesso!",
    });
  });

  it("deve lançar um StatusError quando parâmetros são inválidos", async () => {
    const dados = {
      dataHoraInicio: null,
      dataHoraFim: "2024-08-08T12:00:00Z",
      tempoTotal: "2h",
      temposChegadas: [],
      estagio: "fase1",
    };

    StatusError.mockImplementation((message, status) => ({ message, status }));

    const resultado = await executar(dados);

    expect(resultado).toEqual({
      erro: true,
      status: 400,
      mensagem:
        "Preencha todos os campos obrigatórios (dataHoraInicio, dataHoraFim, tempoTotal, temposChegadas).",
    });
  });

  it("deve lançar um StatusError quando erro de validação de equipe", async () => {
    const dados = {
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
    };

    consultasEquipe.listarEquipePeloCodigo = jest.fn().mockResolvedValue(null);

    StatusError.mockImplementation((message, status) => ({ message, status }));

    const resultado = await executar(dados);

    expect(resultado).toEqual({
      erro: true,
      status: 404,
      mensagem:
        "Equipe não encontrada para o código informado para a 1° equipe!",
    });
  });

  it("deve lançar um StatusError quando ocorrer um erro ao salvar a corrida", async () => {
    const dados = {
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
    };

    consultasEquipe.listarEquipePeloCodigo = jest.fn().mockResolvedValue({
      codigo: "equipe1",
      nome: "Equipe 1",
      integrantes: [{ RA: "123", nome: "Membro 1" }],
    });

    const mockSave = jest.fn(() => {
      throw new StatusError("Erro ao gravar corrida", 500);
    });

    const Corrida = require("../../../modelos/Corrida");
    Corrida.mockImplementation(() => ({
      save: mockSave,
    }));

    const resultado = await executar(dados);

    expect(resultado).toEqual({
      erro: true,
      status: 500,
      mensagem: "Erro ao gravar corrida",
    });
  });
});
