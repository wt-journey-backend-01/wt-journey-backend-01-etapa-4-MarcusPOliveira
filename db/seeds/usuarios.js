const bcrypt = require('bcrypt');

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> } 
 */
exports.seed = async function(knex) {
  // Deletes ALL existing entries
  await knex('usuarios').del();
  
  // Hash passwords for seed data
  const hashedPassword1 = await bcrypt.hash('AdminPass123!', 10);
  const hashedPassword2 = await bcrypt.hash('UserPass456@', 10);
  
  await knex('usuarios').insert([
    {
      nome: 'Administrador Sistema',
      email: 'admin@policia.gov.br',
      senha: hashedPassword1
    },
    {
      nome: 'João Silva Santos',
      email: 'joao.santos@policia.gov.br', 
      senha: hashedPassword2
    }
  ]);
};
