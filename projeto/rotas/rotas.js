const express = require("express");
const router = express.Router();

const { verificaToken } = require("../middlewares/token/token.js");

const controllerServidor = require("../controllers/servidor")
const controllerUsuario = require("../controllers/usuario");
const controllerAuth = require("../controllers/auth");
const controllerEquipe = require("../controllers/equipe");
const controllerCorrida = require("../controllers/corrida");
const controllerRanking = require("../controllers/ranking.js");
const uploadController = require("../controllers/upload.js");

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
router.post("/equipe", verificaToken, controllerEquipe.registrar)
router.post("/equipes/porFase", verificaToken, controllerEquipe.registrarPorFase)
router.post("/equipe/inativarAtivar/:codigoEquipe", verificaToken, controllerEquipe.inativarAtivar)
router.patch("/equipe/:codigoEquipe", verificaToken, controllerEquipe.alterar)
router.get("/equipes", verificaToken, controllerEquipe.listar)
router.get("/equipes/porFase", verificaToken, controllerEquipe.listarPorFase)

//rotas corridas
router.post("/corrida", verificaToken, controllerCorrida.registrar)
router.get("/corridas", verificaToken, controllerCorrida.listar)
router.delete("/corrida", verificaToken, controllerCorrida.deletar)
router.patch("/corrida/alterar-tempo-equipe", verificaToken, controllerCorrida.alterarTempoEquipe)

//rotas do ranking
router.get("/ranking", controllerRanking.listar)

//outras rotas
router.post("/gerar-url-upload-imagem", uploadController.gerarUrlUpload);

module.exports = router;
