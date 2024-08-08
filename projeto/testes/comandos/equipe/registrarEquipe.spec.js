const { executar } = require("../../../comandos/equipe/registrarEquipe");
const StatusError = require("../../../helpers/status/StatusError");
const { StatusOk } = require("../../../helpers/status/StatusOk");
const Equipe = require("../../../modelos/Equipe");
const { v4: uuidv4 } = require("uuid");

jest.mock("uuid", () => ({
  v4: jest.fn(() => "mock-uuid"),
}));
jest.mock("../../../helpers/status/StatusError");
jest.mock("../../../helpers/status/StatusOk");
jest.mock("../../../modelos/Equipe");

describe("Testes da função executar", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("deve registrar a equipe com sucesso quando os parâmetros forem válidos", async () => {
    StatusOk.mockImplementation((status) => status);

    const dados = {
      nome: "Equipe Teste",
      quantidadeIntegrantes: 3,
      integrantes: [
        { nome: "Membro 1", RA: "123" },
        { nome: "Membro 2", RA: "456" },
        { nome: "Membro 3", RA: "789" },
      ],
    };

    Equipe.prototype.save = jest.fn().mockResolvedValue(true);

    const resultado = await executar(dados);

    expect(StatusOk).toHaveBeenCalledWith({
      data: null,
      status: 201,
      mensagem: "Equipe registrada com sucesso!",
    });

    expect(resultado).toEqual({
      data: null,
      status: 201,
      mensagem: "Equipe registrada com sucesso!",
    });
  });

  it("deve lançar um StatusError quando o nome da equipe for inválido", async () => {
    const dados = {
      nome: [],
      quantidadeIntegrantes: 3,
      integrantes: [
        { nome: "Membro 1", RA: "123" },
        { nome: "Membro 2", RA: "456" },
        { nome: "Membro 3", RA: "789" },
      ],
    };

    StatusError.mockImplementation((message, status) => ({ message, status }));

    const resultado = await executar(dados);

    expect(resultado).toEqual({
      erro: true,
      status: 400,
      mensagem: "O nome da equipe deve ser do tipo texto.",
    });
  });

  it("deve lançar um StatusError quando a quantidade de integrantes for inválida", async () => {
    const dados = {
      nome: "Equipe Teste",
      quantidadeIntegrantes: 6,
      integrantes: [
        { nome: "Membro 1", RA: "123" },
        { nome: "Membro 2", RA: "456" },
        { nome: "Membro 3", RA: "789" },
        { nome: "Membro 4", RA: "101" },
        { nome: "Membro 5", RA: "102" },
        { nome: "Membro 6", RA: "103" },
      ],
    };

    StatusError.mockImplementation((message, status) => ({ message, status }));

    const resultado = await executar(dados);

    expect(resultado).toEqual({
      erro: true,
      status: 400,
      mensagem:
        "A quantidade integrantes da equipe deve ser um número inteiro entre 1 e 5.",
    });
  });

  it("deve lançar um StatusError quando o campo integrantes não for um array", async () => {
    const dados = {
      nome: "Equipe Teste",
      quantidadeIntegrantes: 3,
      integrantes: "Não é um array",
    };

    StatusError.mockImplementation((message, status) => ({ message, status }));

    const resultado = await executar(dados);

    expect(resultado).toEqual({
      erro: true,
      status: 400,
      mensagem: "O Campo integrantes deve ser um Array de objetos.",
    });
  });

  it("deve lançar um StatusError quando o número de integrantes não corresponder à quantidade fornecida", async () => {
    const dados = {
      nome: "Equipe Teste",
      quantidadeIntegrantes: 3,
      integrantes: [
        { nome: "Membro 1", RA: "123" },
        { nome: "Membro 2", RA: "456" },
      ],
    };

    StatusError.mockImplementation((message, status) => ({ message, status }));

    const resultado = await executar(dados);

    expect(resultado).toEqual({
      erro: true,
      status: 400,
      mensagem:
        "O campo quantidade de integrantes deve ser igual a quantidade de integrantes enviada.",
    });
  });

  it("deve lançar um StatusError quando ocorrer um erro ao criar a equipe", async () => {
    const dados = {
      nome: "Equipe Teste",
      quantidadeIntegrantes: 3,
      integrantes: [
        { nome: "Membro 1", RA: "123" },
        { nome: "Membro 2", RA: "456" },
        { nome: "Membro 3", RA: "789" },
      ],
    };

    Equipe.mockImplementation(() => {
      throw new StatusError("Erro ao criar equipe", 400);
    });

    StatusError.mockImplementation((message, status) => ({ message, status }));

    const resultado = await executar(dados);

    expect(resultado).toEqual({
      erro: true,
      status: 400,
      mensagem: "Erro ao criar equipe",
    });
  });

  it("deve lançar um StatusError quando ocorrer um erro ao gravar a equipe", async () => {
    const dados = {
      nome: "Equipe Teste",
      quantidadeIntegrantes: 3,
      integrantes: [
        { nome: "Membro 1", RA: "123" },
        { nome: "Membro 2", RA: "456" },
        { nome: "Membro 3", RA: "789" },
      ],
    };

    const mockSave = jest.fn(() => {
      throw new StatusError("Erro ao gravar equipe", 500);
    });

    const Equipe = require("../../../modelos/Equipe");
    Equipe.mockImplementation(() => ({
      save: mockSave,
    }));

    const resultado = await executar(dados);

    expect(resultado).toEqual({
      erro: true,
      status: 500,
      mensagem: "Erro ao gravar equipe",
    });
  });
});
