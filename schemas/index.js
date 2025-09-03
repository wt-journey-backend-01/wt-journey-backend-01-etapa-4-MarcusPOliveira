const { z } = require('zod')

const agenteSchema = z.object({
  nome: z.string().min(1, "Campo 'nome' é obrigatório"),
  dataDeIncorporacao: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, {
    message: 'Data de incorporação deve estar no formato AAAA-MM-DD',
  }),
  cargo: z.string().min(1, "Campo 'cargo' é obrigatório"),
})

const agenteSchemaComId = agenteSchema.extend({
  id: z
    .number()
    .int()
    .positive("Campo 'id' deve ser um número inteiro positivo"),
})

const casoSchema = z.object({
  titulo: z.string().min(1, "Campo 'titulo' é obrigatório"),
  descricao: z.string().min(1, "Campo 'descricao' é obrigatório"),
  status: z.enum(['aberto', 'solucionado'], {
    message: "Status deve ser 'aberto' ou 'solucionado'",
  }),
  agente_id: z
    .number()
    .int()
    .positive("Campo 'agente_id' deve ser um número inteiro positivo"),
})

const casoSchemaComId = casoSchema.extend({
  id: z
    .number()
    .int()
    .positive("Campo 'id' deve ser um número inteiro positivo"),
})

// Validação de senha forte
const passwordSchema = z
  .string()
  .min(8, "Senha deve ter no mínimo 8 caracteres")
  .regex(/(?=.*[a-z])/, "Senha deve conter pelo menos uma letra minúscula")
  .regex(/(?=.*[A-Z])/, "Senha deve conter pelo menos uma letra maiúscula") 
  .regex(/(?=.*\d)/, "Senha deve conter pelo menos um número")
  .regex(/(?=.*[@$!%*?&])/, "Senha deve conter pelo menos um caractere especial (@$!%*?&)")

const usuarioSchema = z.object({
  nome: z.string().min(1, "Campo 'nome' é obrigatório"),
  email: z.string().email("Email deve ter um formato válido"),
  senha: passwordSchema,
})

const usuarioSchemaComId = usuarioSchema.extend({
  id: z
    .number()
    .int()
    .positive("Campo 'id' deve ser um número inteiro positivo"),
})

const loginSchema = z.object({
  email: z.string().email("Email deve ter um formato válido"),
  senha: z.string().min(1, "Campo 'senha' é obrigatório"),
})

const registerSchema = usuarioSchema

module.exports = {
  agenteSchema,
  agenteSchemaComId,
  casoSchema,
  casoSchemaComId,
  usuarioSchema,
  usuarioSchemaComId,
  loginSchema,
  registerSchema,
  passwordSchema,
}
