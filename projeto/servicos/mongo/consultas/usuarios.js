const Usuario = require("../../../modelos/Usuario");

const verificaExistenciaUsuarioPeloLogin = async ({ login }) => {
  try {
    const resultado = await Usuario.findOne({ login });
    if (resultado) {
      return resultado;
    } else {
      return null;
    }
  } catch (error) {
    throw new Error(error.message);
  }
};

module.exports = {
  verificaExistenciaUsuarioPeloLogin,
};
