const { agenteSchema, agenteSchemaComId } = require('../schemas')
const agentesRepository = require('../repositories/agentesRepository')

const getAll = async (req, res) => {
  const { cargo, sort } = req.query

  if (cargo) {
    const cargosValidos = ['delegado', 'inspetor']
    if (!cargosValidos.includes(cargo.toLowerCase())) {
      return res.status(400).json({
        status: 400,
        message: 'Cargo inválido no filtro',
        errors: [
          { cargo: 'Cargo não reconhecido. Use "delegado" ou "inspetor"' },
        ],
      })
    }
  }

  if (sort) {
    const validSortFields = ['dataDeIncorporacao']
    const sortKey = sort.replace('-', '')

    if (!validSortFields.includes(sortKey)) {
      return res.status(400).json({
        status: 400,
        message: 'Campo de ordenação inválido',
        errors: [
          {
            sort: 'Campo sort deve ser "dataDeIncorporacao" ou "-dataDeIncorporacao"',
          },
        ],
      })
    }
  }

  const agentes = await agentesRepository.findAll({ cargo, sort })
  res.json(agentes)
}

const getById = async (req, res) => {
  const { id } = req.params
  const idNum = parseInt(id)
  
  if (isNaN(idNum)) {
    return res.status(400).json({ message: 'ID inválido' })
  }
  
  const agente = await agentesRepository.findById(idNum)

  if (!agente) return res.status(404).json({ message: 'Agente não encontrado' })

  res.status(200).json(agente)
}

const create = async (req, res) => {
  const parsed = agenteSchema.safeParse(req.body)

  if (!parsed.success) {
    const formattedErrors = parsed.error.issues.map((issue) => ({
      [issue.path[0]]: issue.message,
    }))
    return res.status(400).json({
      status: 400,
      message: 'Parâmetros inválidos',
      errors: formattedErrors,
    })
  }

  try {
    const novoAgente = await agentesRepository.create(parsed.data)
    res.status(201).json(novoAgente)
  } catch (error) {
    res.status(500).json({ message: 'Erro interno do servidor' })
  }
}

const put = async (req, res, next) => {
  try {
    const { id } = req.params
    const idNum = parseInt(id)
    
    if (isNaN(idNum)) {
      return res.status(400).json({ message: 'ID inválido' })
    }
    
    const parsed = agenteSchemaComId.safeParse({ ...req.body, id: idNum })

    if (!parsed.success) {
      const errors = parsed.error.issues.map((issue) => ({
        [issue.path[0]]: issue.message,
      }))
      return res.status(400).json({
        status: 400,
        message: 'Parâmetros inválidos',
        errors,
      })
    }

    if (parsed.data.id !== idNum) {
      return res.status(400).json({
        status: 400,
        message: 'ID no corpo da requisição deve ser igual ao ID da URL',
        errors: [{ id: 'ID inconsistente com o parâmetro da URL' }],
      })
    }

    const updated = await agentesRepository.update(idNum, parsed.data)
    if (!updated) {
      return res.status(404).json({ message: 'Agente não encontrado' })
    }

    res.json(updated)
  } catch (err) {
    next(err)
  }
}

const patch = async (req, res) => {
  try {
    const idNum = parseInt(req.params.id)
    
    if (isNaN(idNum)) {
      return res.status(400).json({ message: 'ID inválido' })
    }
    
    const partialSchema = agenteSchema.partial()
    const parsed = partialSchema.safeParse(req.body)
    
    if (!parsed.success) {
      const errors = parsed.error.issues.map((issue) => ({
        [issue.path[0]]: issue.message,
      }))
      return res.status(400).json({
        status: 400,
        message: 'Parâmetros inválidos',
        errors,
      })
    }

    const updated = await agentesRepository.patch(idNum, parsed.data)
    if (!updated)
      return res.status(404).json({ message: 'Agente não encontrado' })

    res.json(updated)
  } catch (error) {
    res.status(500).json({ message: 'Erro interno do servidor' })
  }
}

const remove = async (req, res) => {
  const idNum = parseInt(req.params.id)
  
  if (isNaN(idNum)) {
    return res.status(400).json({ message: 'ID inválido' })
  }
  
  const deleted = await agentesRepository.remove(idNum)
  if (!deleted)
    return res.status(404).json({ message: 'Agente não encontrado' })

  res.status(204).send()
}

const getCasos = async (req, res) => {
  const { id } = req.params
  const agentId = parseInt(id)
  
  if (isNaN(agentId)) {
    return res.status(400).json({ message: 'ID inválido' })
  }

  // Verify agent exists
  const agente = await agentesRepository.findById(agentId)
  if (!agente) {
    return res.status(404).json({ message: 'Agente não encontrado' })
  }

  // Get cases for this agent using repository filter
  const casosRepository = require('../repositories/casosRepository')
  const agentCases = await casosRepository.findAll({ agente_id: agentId })

  res.json(agentCases)
}

module.exports = {
  getAll,
  getById,
  create,
  put,
  patch,
  remove,
  getCasos,
}
