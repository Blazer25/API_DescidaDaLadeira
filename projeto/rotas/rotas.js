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
router.post("/equipe/registrar", controllerEquipe.registrar)
router.patch("/equipe/alterar/:codigoEquipe", verificaToken, controllerEquipe.alterar)
router.get("/equipe/listar", verificaToken, controllerEquipe.listar)

//rotas corridas
router.post("/corrida/registrar", verificaToken, controllerCorrida.registrar)


module.exports = router;
