const express = require("express");
const router = express.Router();

const { verificaToken } = require("../middlewares/token/token.js");

const controllerServidor = require("../controllers/servidor")
const controllerUsuario = require("../controllers/usuario");
const controllerAuth = require("../controllers/auth");
const controllerEquipe = require("../controllers/equipe");
const controllerCorrida = require("../controllers/corrida");

// Rota padrão de verificação
router.get("/", controllerServidor.getHealth);
router.get("/versao", controllerServidor.getVersao);

//Rotas de autenticação
router.post("/auth/registrar", controllerAuth.registrar);
router.post("/auth/login", controllerAuth.login);
router.get("/auth/verificar-token", controllerAuth.verificarToken);

// Rotas de usuário
router.get("/usuario/:usuario", verificaToken, controllerUsuario.listar);

//rotas equipes
router.post("/equipe", controllerEquipe.registrar)
router.patch("/equipe/:codigoEquipe", verificaToken, controllerEquipe.alterar)
router.get("/equipes", verificaToken, controllerEquipe.listar)
router.post("/equipe/inativar/:codigoEquipe", verificaToken, controllerEquipe.inativar)

//rotas corridas
router.post("/corrida", verificaToken, controllerCorrida.registrar)
router.get("/corridas", verificaToken, controllerCorrida.listar)
router.delete("/corrida", verificaToken, controllerCorrida.deletar)


module.exports = router;
