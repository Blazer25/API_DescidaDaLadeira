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
    if (process.env.NODE_ENV === 'development' && process.env.USAR_MONGO_LOCAL === 'true') {
      mongoUri = process.env.MONGODB_URI;
      console.log("Conectando ao MongoDB local");
    } else if (process.env.NODE_ENV === 'test') {
      mongoUri = process.env.MONGODB_URI_TEST || process.env.MONGODB_URI;
      console.log("Conectando ao MongoDB de teste");
    } else {
      const dbUser = process.env.DB_USER;
      const dbPass = process.env.DB_PASS;
      const dbCluster = process.env.DB_CLUSTER;
      
      mongoUri = `mongodb+srv://${dbUser}:${dbPass}@${dbCluster}.mongodb.net/?retryWrites=true&w=majority`;
      console.log("Conectando ao MongoDB Atlas");
    }

    if (!mongoUri) {
      throw new Error("URI de conexão MongoDB não configurada");
    }

    const options = {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      serverSelectionTimeoutMS: 5000,
      maxPoolSize: 10
    };

    await mongoose.connect(mongoUri, options);
    
    isConnected = true;
    console.log("Conexão com o MongoDB estabelecida com sucesso");
    
    mongoose.connection.on('error', (err) => {
      console.error('Erro na conexão MongoDB:', err);
      isConnected = false;
    });
    
    mongoose.connection.on('disconnected', () => {
      console.warn('Desconectado do MongoDB');
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