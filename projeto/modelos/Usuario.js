const mongoose = require('mongoose');

const Usuario = mongoose.model('Usuario', {
  login: String,
  senha: String,  
})

module.exports = Usuario
