const express = require('express')
const app = express()
const PORT = 3000

const agentesRoutes = require('./routes/agentesRoutes')
const casosRoutes = require('./routes/casosRoutes')
const authRoutes = require('./routes/authRoutes')
const usersRoutes = require('./routes/usersRoutes')
const usuariosRoutes = require('./routes/usuariosRoutes')
const errorHandler = require('./utils/errorHandler')

const setupSwagger = require('./docs/swagger')

app.use(express.json())

setupSwagger(app)

app.use('/auth', authRoutes)
app.use('/users', usersRoutes)
app.use('/usuarios', usuariosRoutes)
app.use(agentesRoutes)
app.use(casosRoutes)
app.use(errorHandler)

app.listen(PORT, () => {
  console.log(
    `Servidor do Departamento de Polícia rodando em localhost:${PORT}`
  )
})
