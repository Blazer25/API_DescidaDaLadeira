const { executar } = require("../../../comandos/equipe/inativarAtivarEquipe");
const StatusError = require("../../../helpers/status/StatusError");
const { StatusOk } = require("../../../helpers/status/StatusOk");
const repositorioEquipes = require("../../../servicos/mongo/repositorios/equipes");
const consultarEquipe = require("../../../servicos/mongo/consultas/equipes");

jest.mock("../../../helpers/status/StatusError");
jest.mock("../../../helpers/status/StatusOk");
jest.mock("../../../servicos/mongo/repositorios/equipes");
jest.mock("../../../servicos/mongo/consultas/equipes");

describe("Testes da função executar", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("deve inativar a equipe com sucesso quando a equipe está ativa", async () => {
    StatusOk.mockImplementation((status) => status);

    consultarEquipe.listarEquipePeloCodigo.mockResolvedValue({
      codigo: "123",
      nome: "Equipe Teste",
      ativa: true,
    });

    repositorioEquipes.inativarAtivarEquipe.mockResolvedValue(true);

    const dados = {
      codigoEquipe: "123",
    };

    const resultado = await executar(dados);

    expect(StatusOk).toHaveBeenCalledWith({
      data: null,
      status: 200,
      mensagem: "Equipe inativada com sucesso!",
    });
    expect(resultado).toEqual({
      data: null,
      status: 200,
      mensagem: "Equipe inativada com sucesso!",
    });
  });

  it("deve ativar a equipe com sucesso quando a equipe está inativa", async () => {
    StatusOk.mockImplementation((status) => status);

    consultarEquipe.listarEquipePeloCodigo.mockResolvedValue({
      codigo: "123",
      nome: "Equipe Teste",
      ativa: false,
    });

    repositorioEquipes.inativarAtivarEquipe.mockResolvedValue(true);

    const dados = {
      codigoEquipe: "123",
    };

    const resultado = await executar(dados);

    expect(StatusOk).toHaveBeenCalledWith({
      data: null,
      status: 200,
      mensagem: "Equipe ativada com sucesso!",
    });
    expect(resultado).toEqual({
      data: null,
      status: 200,
      mensagem: "Equipe ativada com sucesso!",
    });
  });

  it("deve lançar um StatusError quando o códigoEquipe não for uma string", async () => {
    const dados = {
      codigoEquipe: 123,
    };

    StatusError.mockImplementation((message, status) => ({ message, status }));

    const resultado = await executar(dados);

    expect(resultado).toEqual({
      erro: true,
      status: 400,
      mensagem: 'Código da equipe é obrigatório e deve ser do tipo "texto".',
    });
  });

  it("deve lançar um StatusError quando a equipe não for encontrada", async () => {
    consultarEquipe.listarEquipePeloCodigo.mockResolvedValue(null);

    const dados = {
      codigoEquipe: "123",
    };

    StatusError.mockImplementation((message, status) => ({ message, status }));

    const resultado = await executar(dados);

    expect(resultado).toEqual({
      erro: true,
      status: 404,
      mensagem: "Equipe não encontrada para ser inativada ou ativada!",
    });
  });

  it("deve lançar um StatusError quando ocorre um erro ao inativar ou ativar a equipe", async () => {
    consultarEquipe.listarEquipePeloCodigo.mockResolvedValue({
      codigo: "123",
      nome: "Equipe Teste",
      ativa: true,
    });

    repositorioEquipes.inativarAtivarEquipe.mockRejectedValue(
      new StatusError("Erro ao inativar/ativar equipe", 500)
    );

    const dados = {
      codigoEquipe: "123",
    };

    const resultado = await executar(dados);

    expect(resultado).toEqual({
      erro: true,
      status: 500,
      mensagem: "Erro ao inativar/ativar equipe",
    });
  });
});
