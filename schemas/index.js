const { z } = require('zod')

const agenteSchema = z.object({
  nome: z.string().min(1, "Campo 'nome' é obrigatório"),
  dataDeIncorporacao: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, {
    message: 'Data de incorporação deve estar no formato AAAA-MM-DD',
  }),
  cargo: z.enum(['delegado', 'inspetor'], {
    message: "Cargo deve ser 'delegado' ou 'inspetor'",
  }),
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
  email: z.string().min(1, "Campo 'email' é obrigatório").email("Email deve ter um formato válido"),
  senha: z.string().min(1, "Campo 'senha' é obrigatório"),
}).strict()

// Schema de registro mais rigoroso
const registerSchema = z.object({
  nome: z.string({
    required_error: "Campo 'nome' é obrigatório",
    invalid_type_error: "Campo 'nome' deve ser uma string"
  }).min(1, "Nome não pode ser vazio")
    .refine(val => val.trim().length > 0, "Nome não pode ser apenas espaços"),
  email: z.string({
    required_error: "Campo 'email' é obrigatório", 
    invalid_type_error: "Campo 'email' deve ser uma string"
  }).min(1, "Email não pode ser vazio")
    .email("Email deve ter um formato válido")
    .refine(val => val.trim().length > 0, "Email não pode ser apenas espaços"),
  senha: z.string({
    required_error: "Campo 'senha' é obrigatório",
    invalid_type_error: "Campo 'senha' deve ser uma string"  
  }).min(8, "Senha deve ter no mínimo 8 caracteres")
    .regex(/(?=.*[a-z])/, "Senha deve conter pelo menos uma letra minúscula")
    .regex(/(?=.*[A-Z])/, "Senha deve conter pelo menos uma letra maiúscula")
    .regex(/(?=.*\d)/, "Senha deve conter pelo menos um número")
    .regex(/(?=.*[@$!%*?&])/, "Senha deve conter pelo menos um caractere especial (@$!%*?&)")
}).strict()

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
