import sql from './db.js'

const createTableQuery = `
  CREATE TABLE Usuario (
    UsuarioID INTEGER PRIMARY KEY,
    Nome VARCHAR(100) NOT NULL,
    Login VARCHAR(50) NOT NULL UNIQUE,
    Senha VARCHAR(255) NOT NULL
);
`;

// Executando a consulta
sql.unsafe(createTableQuery)
  .then(() => {
    console.log('Tabela criada');
  })
  .catch(error => {
    console.error('Erro ao criar a tabela:', error);
  });