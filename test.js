
const sqlite3 = require('sqlite3').verbose();


let db = new sqlite3.Database('./src/database/database.db', (err) => {
    if (err) {
      console.error('Erro ao abrir o banco de dados', err.message);
    } else {
      console.log('Conexão bem sucedida com o banco de dados SQLite');
    }
  });