const { executar } = require("../../../comandos/equipe/alterarEquipe");
const StatusError = require("../../../helpers/status/StatusError");
const { StatusOk } = require("../../../helpers/status/StatusOk");
const consultasEquipe = require("../../../servicos/mongo/consultas/equipes");
const repositoriosEquipe = require("../../../servicos/mongo/repositorios/equipes");

jest.mock("../../../helpers/status/StatusError");
jest.mock("../../../helpers/status/StatusOk");
jest.mock("../../../modelos/Equipe");
jest.mock("../../../servicos/mongo/consultas/equipes");
jest.mock("../../../servicos/mongo/repositorios/equipes");

describe("Testes da função executar", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("deve atualizar a equipe com sucesso quando os parâmetros forem válidos", async () => {
    StatusOk.mockImplementation((status) => status);

    consultasEquipe.listarEquipePeloCodigo.mockResolvedValue({
      codigo: "123",
      nome: "Equipe Antiga",
      integrantes: [{ RA: "001", RA_Atual: "001", nome: "Membro 1" }],
      quantidadeIntegrantes: 1,
    });

    repositoriosEquipe.atualizarEquipe.mockResolvedValue(true);

    const dados = {
      codigoEquipe: "123",
      nomeEquipe: "Equipe Atualizada",
      dadosIntegrantes: [
        { RA: "001", RA_Atual: "001", nome: "Membro Atualizado" },
      ],
    };

    const resultado = await executar(dados);

    expect(StatusOk).toHaveBeenCalledWith({
      data: null,
      status: 201,
      mensagem: "Equipe atualizada com sucesso!",
    });
    expect(resultado).toEqual({
      data: null,
      status: 201,
      mensagem: "Equipe atualizada com sucesso!",
    });
  });

  it("deve lançar um StatusError quando o códigoEquipe não for uma string", async () => {
    const dados = {
      codigoEquipe: 123,
      nomeEquipe: "Equipe Teste",
      dadosIntegrantes: [],
    };

    StatusError.mockImplementation((message, status) => ({ message, status }));

    const resultado = await executar(dados);

    expect(resultado).toEqual({
      erro: true,
      status: 400,
      mensagem: 'Código da equipe é obrigatório e deve ser do tipo "texto".',
    });
  });

  it("deve lançar um StatusError quando o nomeEquipe não for uma string", async () => {
    const dados = {
      codigoEquipe: "123",
      nomeEquipe: 123,
      dadosIntegrantes: [],
    };

    StatusError.mockImplementation((message, status) => ({ message, status }));

    const resultado = await executar(dados);

    expect(resultado).toEqual({
      erro: true,
      status: 400,
      mensagem: 'Nome da equipe deve ser do tipo "texto".',
    });
  });

  it("deve lançar um StatusError quando dadosIntegrantes não for um array", async () => {
    const dados = {
      codigoEquipe: "123",
      nomeEquipe: "Equipe Teste",
      dadosIntegrantes: {},
    };

    StatusError.mockImplementation((message, status) => ({ message, status }));

    const resultado = await executar(dados);

    expect(resultado).toEqual({
      erro: true,
      status: 400,
      mensagem: 'Dados dos integrantes deve ser do tipo "array".',
    });
  });

  it("deve lançar um StatusError quando dadosIntegrantes contiver dados inválidos", async () => {
    const dados = {
      codigoEquipe: "123",
      nomeEquipe: "Equipe Teste",
      dadosIntegrantes: [{ RA: 123, RA_Atual: "001" }],
    };

    StatusError.mockImplementation((message, status) => ({ message, status }));

    const resultado = await executar(dados);

    expect(resultado).toEqual({
      erro: true,
      status: 400,
      mensagem: 'O RA do 1° integrante deve ser do tipo "texto".',
    });
  });

  it("deve lançar um StatusError quando a equipe não for encontrada", async () => {
    consultasEquipe.listarEquipePeloCodigo.mockResolvedValue(null);

    const dados = {
      codigoEquipe: "123",
      nomeEquipe: "Equipe Teste",
      dadosIntegrantes: [],
    };

    StatusError.mockImplementation((message, status) => ({ message, status }));

    const resultado = await executar(dados);

    expect(resultado).toEqual({
      erro: true,
      status: 404,
      mensagem: "Equipe não encontrada para ser editada!",
    });
  });

  it("deve lançar um StatusError quando a quantidade de integrantes for inválida", async () => {
    consultasEquipe.listarEquipePeloCodigo.mockResolvedValue({
      codigo: "123",
      nome: "Equipe Antiga",
      integrantes: [{ RA: "001", RA_Atual: "001", nome: "Membro 1" }],
      quantidadeIntegrantes: 1,
    });

    const dados = {
      codigoEquipe: "123",
      nomeEquipe: "Equipe Atualizada",
      dadosIntegrantes: [
        { RA: "001", RA_Atual: "001", nome: "Membro Atualizado" },
        { RA: "002", RA_Atual: "002", nome: "Novo Membro" },
      ],
    };

    StatusError.mockImplementation((message, status) => ({ message, status }));

    const resultado = await executar(dados);

    expect(resultado).toEqual({
      erro: true,
      status: 400,
      mensagem:
        "Foram passados mais dados de integrantes do que essa equipe possui!",
    });
  });

  it("deve lançar um StatusError quando ocorrer um erro ao atualizar a equipe", async () => {
    consultasEquipe.listarEquipePeloCodigo.mockResolvedValue({
      codigo: "123",
      nome: "Equipe Antiga",
      integrantes: [{ RA: "001", RA_Atual: "001", nome: "Membro 1" }],
      quantidadeIntegrantes: 1,
    });

    repositoriosEquipe.atualizarEquipe.mockRejectedValue(
      new StatusError("Erro ao atualizar equipe", 500)
    );

    const dados = {
      codigoEquipe: "123",
      nomeEquipe: "Equipe Atualizada",
      dadosIntegrantes: [
        { RA: "001", RA_Atual: "001", nome: "Membro Atualizado" },
      ],
    };

    const resultado = await executar(dados);

    expect(resultado).toEqual({
      erro: true,
      status: 500,
      mensagem: "Erro ao atualizar equipe",
    });
  });
});
