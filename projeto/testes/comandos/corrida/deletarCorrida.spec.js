const { executar } = require("../../../comandos/corrida/deletarCorrida");
const StatusError = require("../../../helpers/status/StatusError");
const { StatusOk } = require("../../../helpers/status/StatusOk");
const Corrida = require("../../../modelos/Corrida");

jest.mock("../../../helpers/status/StatusError");
jest.mock("../../../helpers/status/StatusOk");
jest.mock("../../../modelos/Corrida");

describe("Testes da função executar", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("deve deletar a corrida com sucesso quando os parâmetros forem válidos", async () => {
    StatusOk.mockImplementation((status) => status);

    Corrida.findOneAndDelete = jest.fn().mockResolvedValue(true);

    const dados = { codigoCorrida: "12345" };

    const resultado = await executar(dados);

    expect(StatusOk).toHaveBeenCalledWith({
      data: null,
      status: 201,
      mensagem: "Corrida deletada com sucesso!",
    });
    expect(resultado).toEqual({
      data: null,
      status: 201,
      mensagem: "Corrida deletada com sucesso!",
    });
  });

  it("deve lançar um StatusError quando o códigoCorrida não for uma string", async () => {
    const dados = { codigoCorrida: 12345 };

    StatusError.mockImplementation((message, status) => ({ message, status }));

    const resultado = await executar(dados);

    expect(resultado).toEqual({
      erro: true,
      status: 400,
      mensagem:
        "Preencha todos os campos obrigatórios (dataHoraInicio, dataHoraFim, tempoTotal, temposChegadas).",
    });
  });

  it("deve lançar um StatusError quando não for encontrada nenhuma corrida com o código informado", async () => {
    Corrida.findOneAndDelete = jest.fn().mockResolvedValue(null);

    const dados = { codigoCorrida: "12345" };

    StatusError.mockImplementation((message, status) => ({ message, status }));

    const resultado = await executar(dados);

    expect(resultado).toEqual({
      erro: true,
      status: 404,
      mensagem: "Não foi encontrada nenhuma corrida com o código informado",
    });
  });

  it("deve lançar um StatusError quando ocorrer um erro ao remover a corrida", async () => {
    Corrida.findOneAndDelete = jest.fn(() => {
      throw new StatusError("Erro ao remover corrida", 500);
    });

    const dados = { codigoCorrida: "12345" };

    const resultado = await executar(dados);

    expect(resultado).toEqual({
      erro: true,
      status: 500,
      mensagem: "Erro ao remover corrida",
    });
  });
});
