const db = require('../db/db');

class UsuariosRepository {
  async findAll() {
    return await db('usuarios').select('id', 'nome', 'email', 'created_at', 'updated_at');
  }

  async findById(id) {
    return await db('usuarios')
      .select('id', 'nome', 'email', 'created_at', 'updated_at')
      .where('id', id)
      .first();
  }

  async findByEmail(email) {
    return await db('usuarios')
      .select('id', 'nome', 'email', 'senha', 'created_at', 'updated_at')
      .where('email', email)
      .first();
  }

  async create(userData) {
    const [usuario] = await db('usuarios')
      .insert(userData)
      .returning(['id', 'nome', 'email', 'created_at', 'updated_at']);
    return usuario;
  }

  async update(id, userData) {
    const [usuario] = await db('usuarios')
      .where('id', id)
      .update({
        ...userData,
        updated_at: new Date()
      })
      .returning(['id', 'nome', 'email', 'created_at', 'updated_at']);
    return usuario;
  }

  async delete(id) {
    return await db('usuarios')
      .where('id', id)
      .del();
  }

  async emailExists(email, excludeId = null) {
    const query = db('usuarios').where('email', email);
    if (excludeId) {
      query.whereNot('id', excludeId);
    }
    const usuario = await query.first();
    return !!usuario;
  }
}

module.exports = new UsuariosRepository();