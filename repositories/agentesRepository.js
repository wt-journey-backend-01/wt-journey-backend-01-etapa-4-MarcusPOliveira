const db = require('../db/db')

const findAll = async (filters = {}) => {
  const query = db('agentes').select('*')

  if (filters.cargo) {
    query.where('cargo', 'ilike', filters.cargo)
  }

  if (filters.sort) {
    const sortKey = filters.sort.replace('-', '')
    const direction = filters.sort.startsWith('-') ? 'desc' : 'asc'
    query.orderBy(sortKey, direction)
  }

  return await query
}

const findById = async (id) => {
  return await db('agentes').where('id', id).first()
}

const create = async (agente) => {
  const [created] = await db('agentes').insert(agente).returning('*')
  return created
}

const update = async (id, updated) => {
  const [updatedAgente] = await db('agentes')
    .where('id', id)
    .update(updated)
    .returning('*')

  return updatedAgente || null
}

const patch = async (id, partial) => {
  const [patchedAgente] = await db('agentes')
    .where('id', id)
    .update(partial)
    .returning('*')

  return patchedAgente || null
}

const remove = async (id) => {
  const deletedCount = await db('agentes').where('id', id).del()
  return deletedCount > 0
}

module.exports = {
  findAll,
  findById,
  create,
  update,
  patch,
  remove,
}
