const Equipe = require("../../../modelos/Equipe");
const EquipePorFase = require("../../../modelos/EquipePorFase");

const listarTodasEquipes = async ({ filtros }) => {
  try {
    let filtro = {};
    if (filtros) {
      if (filtros.ativas) {
        filtro["ativa"] = true;
      }
      if (filtros.nome) {
        filtro["nome"] = { $regex: filtros.nome, $options: "i" };
      }
    }
    return await Equipe.find(filtro, { _id: 0 }).sort({ nome: 1 });
  } catch (error) {
    throw new Error(error.message);
  }
};

const listarEquipePeloCodigo = async ({ codigo }) => {
  try {
    return await Equipe.findOne({ codigo }, { _id: 0 });
  } catch (error) {
    throw new Error(error.message);
  }
};

const listarTodasEquipesPorFase = async ({ filtros = {} }) => {
  try {
    return await EquipePorFase.find(filtros, { _id: 0 }).sort({ insercao: 1 });
  } catch (error) {
    throw new Error(error.message);
  }
};

module.exports = {
  listarTodasEquipes,
  listarEquipePeloCodigo,
  listarTodasEquipesPorFase,
};
