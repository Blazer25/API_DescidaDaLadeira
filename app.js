const express = require("express");
const cors = require("cors");

const rotas = require("./projeto/rotas/rotas.js");
const conexaoMongo = require("./projeto/servicos/mongo/conexaoMongo.js");

const PORTA = process.env.PORTA ? Number(process.env.PORTA) : 3000;
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());
app.use("/", rotas);

conexaoMongo().then(() => {
  app.listen(PORTA);
  console.log(`Servidor online na porta ${PORTA}`);
}).catch((error) => {
  process.exit(1);
});
