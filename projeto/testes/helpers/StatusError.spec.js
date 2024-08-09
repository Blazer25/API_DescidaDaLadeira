const StatusError = require("../../helpers/status/StatusError");

describe("Testes da classe StatusError", () => {
  it("deve criar uma instância com a mensagem e status corretos", () => {
    const mensagem = "Erro de validação";
    const status = 400;

    const erro = new StatusError(mensagem, status);

    expect(erro).toBeInstanceOf(StatusError);
    expect(erro.message).toBe(mensagem);
    expect(erro.status).toBe(status);
    expect(erro.name).toBe("StatusError");
  });

  it("deve criar uma instância com status padrão se não for especificado", () => {
    const mensagem = "Erro interno";

    const erro = new StatusError(mensagem);

    expect(erro).toBeInstanceOf(StatusError);
    expect(erro.message).toBe(mensagem);
    expect(erro.status).toBe(500); // Status padrão
    expect(erro.name).toBe("StatusError");
  });
});
