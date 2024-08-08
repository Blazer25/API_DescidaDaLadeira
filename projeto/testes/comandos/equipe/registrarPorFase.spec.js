const {
  executar,
} = require("../../../comandos/equipe/registrarPorFase");
const StatusError = require("../../../helpers/status/StatusError");
const { StatusOk } = require("../../../helpers/status/StatusOk");
const EquipePorFase = require("../../../modelos/EquipePorFase");

jest.mock("uuid", () => ({
  v4: jest.fn(() => "mock-uuid"),
}));
jest.mock("../../../helpers/status/StatusError");
jest.mock("../../../helpers/status/StatusOk");
jest.mock("../../../modelos/EquipePorFase");

describe("Testes da função executar", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("deve registrar a equipe por fase com sucesso", async () => {
    const dados = {
      equipes: [
        { codigo: "equipe1", nome: "Equipe 1" },
        { codigo: "equipe2", nome: "Equipe 2" },
      ],
      fase: "fase1",
    };

    EquipePorFase.prototype.save = jest.fn();
    StatusOk.mockImplementation(({ data, status, mensagem }) => ({
      data,
      status,
      mensagem,
    }));

    const resultado = await executar(dados);

    expect(resultado).toEqual({
      data: null,
      status: 201,
      mensagem: "Equipe por fase registrada com sucesso!",
    });
  });

  it("deve lançar um StatusError quando parâmetros são inválidos", async () => {
    const dados = {
      equipes: [],
      fase: 123,
    };

    StatusError.mockImplementation((message, status) => ({ message, status }));

    const resultado = await executar(dados);

    expect(resultado).toEqual({
      erro: true,
      status: 400,
      mensagem: "O campo fase é obrigatório e deve ser do tipo texto",
    });
  });

  it("deve lançar um StatusError quando a quantidade de equipes excede o limite", async () => {
    const dados = {
      equipes: [
        { codigo: "equipe1", nome: "Equipe 1" },
        { codigo: "equipe2", nome: "Equipe 2" },
        { codigo: "equipe3", nome: "Equipe 3" },
        { codigo: "equipe4", nome: "Equipe 4" },
      ],
      fase: "fase1",
    };

    StatusError.mockImplementation((message, status) => ({ message, status }));

    const resultado = await executar(dados);

    expect(resultado).toEqual({
      erro: true,
      status: 400,
      mensagem: "A quantidade de equipes deve ser menor ou igual a 3.",
    });
  });

  it("deve lançar um StatusError quando ocorrer um erro ao salvar a equipe por fase", async () => {
    const dados = {
      equipes: [
        { codigo: "equipe1", nome: "Equipe 1" },
        { codigo: "equipe2", nome: "Equipe 2" },
      ],
      fase: "fase1",
    };

    const mockSave = jest.fn(() => {
      throw new StatusError("Erro ao salvar equipe por fase", 500);
    });

    const EquipePorFase = require("../../../modelos/EquipePorFase");
    EquipePorFase.mockImplementation(() => ({
      save: mockSave,
    }));

    const resultado = await executar(dados);

    expect(resultado).toEqual({
      erro: true,
      status: 500,
      mensagem: "Erro ao salvar equipe por fase",
    });
  });
});
