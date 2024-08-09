const { StatusOk } = require("../../helpers/status/StatusOk");

describe("Testes da função StatusOk", () => {
  it("deve retornar um objeto com os valores padrão quando nenhum parâmetro é fornecido", () => {
    const resultado = StatusOk({});

    expect(resultado).toEqual({
      data: null,
      status: 200,
      mensagem: "Sucesso!",
    });
  });

  it("deve retornar um objeto com valores fornecidos", () => {
    const dados = {
      data: { info: "teste" },
      status: 201,
      mensagem: "Criado com sucesso!",
    };

    const resultado = StatusOk(dados);

    expect(resultado).toEqual(dados);
  });

  it("deve retornar um objeto com valores padrão para parâmetros não fornecidos", () => {
    const resultado = StatusOk({
      data: { info: "teste" },
    });

    expect(resultado).toEqual({
      data: { info: "teste" },
      status: 200,
      mensagem: "Sucesso!",
    });
  });

  it("deve retornar um objeto com mensagem padrão se apenas o status for fornecido", () => {
    const resultado = StatusOk({
      status: 404,
    });

    expect(resultado).toEqual({
      data: null,
      status: 404,
      mensagem: "Sucesso!",
    });
  });
});
