const { verificaToken } = require("../../middlewares/token/token");
const jwt = require("jsonwebtoken");
require("dotenv").config();

jest.mock("jsonwebtoken", () => ({
  verify: jest.fn(),
}));

describe("Testes do middleware verificaToken", () => {
  let req, res, next;

  beforeEach(() => {
    req = {
      headers: {},
    };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    next = jest.fn();
  });

  it("deve chamar verificar o token corretamente", () => {
    const token = "valid-token";
    req.headers.authorization = token;
    const secret = process.env.JWT_SECRET;

    jwt.verify.mockImplementation((token, secret, callback) => {
      callback(null); // Simula token válido
    });

    verificaToken(req, res, next);

    expect(jwt.verify).toHaveBeenCalledWith(token, secret);
  });

  it("deve retornar 401 se o token estiver ausente", () => {
    req.headers.authorization = null;

    verificaToken(req, res, next);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({
      mensagem: "Usuário não autorizado",
    });
    expect(next).not.toHaveBeenCalled();
  });

  it("deve retornar 401 se o token for inválido", () => {
    const token = "invalid-token";
    req.headers.authorization = token;
    const secret = process.env.JWT_SECRET;

    jwt.verify.mockImplementation((token, secret, callback) => {
      callback(new Error("Invalid token")); // Simula token inválido
    });

    verificaToken(req, res, next);

    expect(jwt.verify).toHaveBeenCalledWith(token, secret);
    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({ mensagem: "Token inválido" });
    expect(next).not.toHaveBeenCalled();
  });
});
