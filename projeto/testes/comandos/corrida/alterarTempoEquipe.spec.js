const { executar } = require("../../../comandos/corrida/alterarTempoEquipe");
const StatusError = require("../../../helpers/status/StatusError");
const { StatusOk } = require("../../../helpers/status/StatusOk");
const Corrida = require("../../../modelos/Corrida");

jest.mock("../../../helpers/status/StatusError");
jest.mock("../../../helpers/status/StatusOk");
jest.mock("../../../modelos/Corrida");

describe("Testes da função executar de alterarTempoEquipe", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("deve alterar o tempo da equipe na corrida com sucesso", async () => {
    const mockSave = jest.fn();
    Corrida.findOne = jest.fn().mockResolvedValue({
      temposChegadas: [
        { equipe: { codigo: "equipe1" }, tempo: "01:00:000" },
        { equipe: { codigo: "equipe2" }, tempo: "02:00:000" }
      ],
      save: mockSave
    });
    StatusOk.mockImplementation((obj) => obj);

    const resultado = await executar({
      codigoCorrida: "corrida1",
      codigoEquipe: "equipe2",
      tempo: "03:00:000"
    });

    expect(Corrida.findOne).toHaveBeenCalledWith({ codigo: "corrida1" });
    expect(mockSave).toHaveBeenCalled();
    expect(resultado).toEqual({
      data: null,
      status: 200,
      mensagem: "Tempo da equipe atualizado com sucesso!"
    });
  });

  it("deve manter o tempo se não for passado tempo novo", async () => {
    const mockSave = jest.fn();
    const chegada = { equipe: { codigo: "equipe1" }, tempo: "01:00:000" };
    Corrida.findOne = jest.fn().mockResolvedValue({
      temposChegadas: [chegada],
      save: mockSave
    });
    StatusOk.mockImplementation((obj) => obj);

    const resultado = await executar({
      codigoCorrida: "corrida1",
      codigoEquipe: "equipe1"
    });

    expect(chegada.tempo).toBe("01:00:000");
    expect(mockSave).toHaveBeenCalled();
    expect(resultado.status).toBe(200);
  });

  it("deve retornar erro se corrida não encontrada", async () => {
    Corrida.findOne = jest.fn().mockResolvedValue(null);
    StatusError.mockImplementation((msg, status) => ({ message: msg, status }));

    const resultado = await executar({ codigoCorrida: "naoexiste", codigoEquipe: "equipe1" });
    expect(resultado.status).toBe(404);
    expect(resultado.mensagem).toMatch(/Corrida não encontrada/);
  });

  it("deve retornar erro se equipe não encontrada na corrida", async () => {
    Corrida.findOne = jest.fn().mockResolvedValue({
      temposChegadas: [{ equipe: { codigo: "outraequipe" }, tempo: "01:00:000" }],
      save: jest.fn()
    });
    StatusError.mockImplementation((msg, status) => ({ message: msg, status }));

    const resultado = await executar({ codigoCorrida: "corrida1", codigoEquipe: "equipe1" });
    expect(resultado.status).toBe(404);
    expect(resultado.mensagem).toMatch(/Equipe não encontrada/);
  });

  it("deve validar obrigatoriedade dos parâmetros", async () => {
    StatusError.mockImplementation((msg, status) => ({ message: msg, status }));
    let resultado = await executar({ codigoEquipe: "equipe1" });
    expect(resultado.status).toBe(400);
    resultado = await executar({ codigoCorrida: "corrida1" });
    expect(resultado.status).toBe(400);
  });
});
