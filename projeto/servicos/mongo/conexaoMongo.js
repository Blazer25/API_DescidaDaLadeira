const mongoose = require("mongoose");
require("dotenv").config();

const conectarMongo = async () => {
  try {
    const DBUSER = process.env.DB_USER;
    const DBPASS = process.env.DB_PASS;
    const MONGOURI = `mongodb+srv://${DBUSER}:${DBPASS}@clustereugenio.dixqwjn.mongodb.net/?retryWrites=true&w=majority`;

    await mongoose.connect(MONGOURI);

    console.log("Conexão com o MongoDB estabelecida com sucesso");
  } catch (error) {
    console.error("Erro ao conectar com o MongoDB:", error);
    throw new Error(error);
  }
};

module.exports = conectarMongo;
