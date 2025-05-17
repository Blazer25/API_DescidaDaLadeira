const mongoose = require("mongoose");
require("dotenv").config();

let isConnected = false;

const conectarMongo = async () => {
  try {
    if (isConnected) {
      console.log("Usando conexão existente com MongoDB");
      return mongoose;
    }

    let mongoUri;
    if (
      process.env.NODE_ENV === "development" &&
      process.env.USAR_MONGO_LOCAL === "true"
    ) {
      mongoUri = process.env.MONGODB_URI;
      console.info("Conectando ao MongoDB local");
    } else if (process.env.NODE_ENV === "producao") {
      mongoUri = process.env.MONGODB_URI_PROD;
      console.info("Conectando ao MongoDB de Produção");
    } else {
      mongoUri = process.env.MONGODB_URI_PROD;
      console.info("Conectando ao MongoDB de Teste");
    }

    if (!mongoUri) {
      throw new Error("URI de conexão MongoDB não configurada");
    }

    const options = {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      serverSelectionTimeoutMS: 5000,
      maxPoolSize: 10,
    };

    await mongoose.connect(mongoUri, options);

    isConnected = true;
    console.info("Conexão com o MongoDB estabelecida com sucesso");

    mongoose.connection.on("error", (err) => {
      console.error("Erro na conexão MongoDB:", err);
      isConnected = false;
    });

    mongoose.connection.on("disconnected", () => {
      console.warn("Desconectado do MongoDB");
      isConnected = false;
    });

    return mongoose;
  } catch (error) {
    console.error("Falha ao conectar com MongoDB:", error.message);
    isConnected = false;
    throw new Error(`Erro de conexão MongoDB: ${error.message}`);
  }
};

module.exports = conectarMongo;
