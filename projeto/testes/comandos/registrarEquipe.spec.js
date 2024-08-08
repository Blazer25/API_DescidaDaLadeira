const registrarEquipe = require('../../comandos/equipe/registrarEquipe');
const StatusError = require("../../helpers/status/StatusError");
const { StatusOk } = require("../../helpers/status/StatusOk");

// Mock das dependências
jest.mock('uuid', () => ({
  v4: jest.fn(() => 'mock-uuid')
}));

jest.mock('../../modelos/Equipe', () => {
  return jest.fn().mockImplementation(() => ({
    save: jest.fn()
  }));
});

jest.mock('../../helpers/status/StatusError');
jest.mock('../../helpers/status/StatusOk');

describe('Testes da função executar', () => {
  
  beforeEach(() => {
    jest.clearAllMocks(); // Limpa mocks antes de cada teste
  });

  it('deve registrar a equipe com sucesso quando os parâmetros forem válidos', async () => {
    // Mock do StatusOk
    StatusOk.mockImplementation((status) => status);

    // Dados válidos
    const dados = {
      nome: 'Equipe Teste',
      quantidadeIntegrantes: 3,
      integrantes: [
        { nome: 'Membro 1', RA: '123' },
        { nome: 'Membro 2', RA: '456' },
        { nome: 'Membro 3', RA: '789' }
      ]
    };

    // Chama a função
    const resultado = await registrarEquipe.executar(dados);

    // Verifica se StatusOk foi chamado corretamente
    expect(StatusOk).toHaveBeenCalledWith({
      data: null,
      status: 201,
      mensagem: "Equipe registrada com sucesso!",
    });

    // Verifica se a função retornar o valor esperado
    expect(resultado).toEqual({
      data: null,
      status: 201,
      mensagem: "Equipe registrada com sucesso!",
    });
  });

  it('deve lançar um StatusError quando o nome estiver ausente', async () => {
    const dados = {
      nome: '',
      quantidadeIntegrantes: 3,
      integrantes: [
        { nome: 'Membro 1', RA: '123' },
        { nome: 'Membro 2', RA: '456' },
        { nome: 'Membro 3', RA: '789' }
      ]
    };

    StatusError.mockImplementation((message, status) => ({ message, status }));

    const resultado = await registrarEquipe.executar(dados);

    expect(resultado).toEqual({
      erro: true,
      status: 400,
      mensagem: "Preencha todos os campos obrigatórios (nome, integrantes e quantidade de integrantes)."
    });
  });

  it('deve lançar um StatusError quando a quantidade de integrantes estiver fora do intervalo permitido', async () => {
    const dados = {
      nome: 'Equipe Teste',
      quantidadeIntegrantes: 6,
      integrantes: [
        { nome: 'Membro 1', RA: '123' },
        { nome: 'Membro 2', RA: '456' },
        { nome: 'Membro 3', RA: '789' },
        { nome: 'Membro 4', RA: '101' },
        { nome: 'Membro 5', RA: '102' },
        { nome: 'Membro 6', RA: '103' }
      ]
    };

    StatusError.mockImplementation((message, status) => ({ message, status }));

    const resultado = await registrarEquipe.executar(dados);

    expect(resultado).toEqual({
      erro: true,
      status: 400,
      mensagem: "A quantidade integrantes da equipe deve ser um número inteiro entre 1 e 5."
    });
  });

  it('deve lançar um StatusError quando ocorrer um erro ao criar a equipe', async () => {
    // Mock da função criarEquipe
    const criarEquipe = jest.fn(() => {
      throw new StatusError('Erro ao criar equipe', 400);
    });
    
    const dados = {
      nome: 'Equipe Teste',
      quantidadeIntegrantes: 3,
      integrantes: [
        { nome: 'Membro 1', RA: '123' },
        { nome: 'Membro 2', RA: '456' },
        { nome: 'Membro 3', RA: '789' }
      ]
    };

    // Substituindo a implementação da função criarEquipe
    const resultado = await registrarEquipe.executar(dados);

    expect(resultado).toEqual({
      erro: true,
      status: 400,
      mensagem: 'Erro ao criar equipe'
    });
  });

  it('deve lançar um StatusError quando ocorrer um erro ao gravar a equipe', async () => {
    // Mock da função gravarEquipe
    const gravarEquipe = jest.fn(() => {
      throw new StatusError('Erro ao gravar equipe', 500);
    });

    const dados = {
      nome: 'Equipe Teste',
      quantidadeIntegrantes: 3,
      integrantes: [
        { nome: 'Membro 1', RA: '123' },
        { nome: 'Membro 2', RA: '456' },
        { nome: 'Membro 3', RA: '789' }
      ]
    };

    // Substituindo a implementação da função gravarEquipe
    jest.spyOn(registrarEquipe, 'gravarEquipe').mockImplementation(gravarEquipe);

    const resultado = await registrarEquipe.executar(dados);

    expect(resultado).toEqual({
      erro: true,
      status: 500,
      mensagem: 'Erro ao gravar equipe'
    });
  });

});
