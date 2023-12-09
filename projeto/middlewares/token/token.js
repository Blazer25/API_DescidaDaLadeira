require("dotenv").config();
const jwt = require("jsonwebtoken");

const verificaToken = (req, res, next) => {
  const authorizationHeader = req.headers.authorization || null;
  
  const token = authorizationHeader ? authorizationHeader : null;

  if (!token) {
    return res.status(401).json({ mensagem: "Usuário não autorizado" });
  }

  try {
    const secret = process.env.JWT_SECRET;

    jwt.verify(token, secret);

    next();
  } catch (error) {
    console.log(error);

    return res.status(401).json({ mensagem: "Token inválido" });
  }
};

module.exports = {
  verificaToken,
};
