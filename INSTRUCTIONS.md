# Instruções de Configuração - API Departamento de Polícia

Este documento fornece instruções claras para configurar e executar a API de gerenciamento de agentes e casos policiais com PostgreSQL e autenticação JWT (Etapa 4).

## 📋 Pré-requisitos

- **Node.js** (versão 16 ou superior)
- **Docker** e **Docker Compose**
- **Git**

## 🚀 Configuração Inicial

### 1. Clone e Instale Dependências

```bash
# Clone o repositório
git clone <seu-repositorio>
cd wt-journey-backend-01-etapa-3-marcuspoliveira

# Instale as dependências
npm install
```

### 2. Configuração do Ambiente

O arquivo `.env` já está configurado com as variáveis necessárias:

```env
POSTGRES_USER=postgres
POSTGRES_PASSWORD=postgres
POSTGRES_DB=policia_db
NODE_ENV=development
JWT_SECRET=your_super_secure_jwt_secret_key_change_in_production_2024
```

**⚠️ IMPORTANTE**: 
- Use exatamente estes valores para compatibilidade com os testes
- **NUNCA** commite o `JWT_SECRET` em produção - use um valor seguro e aleatório

## 🐘 Configuração do Banco de Dados PostgreSQL

### 1. Subir o Banco com Docker

```bash
# Iniciar o container PostgreSQL
docker-compose up -d

# Verificar se está rodando
docker ps
```

O PostgreSQL estará disponível em:
- **Host**: localhost
- **Porta**: 5432
- **Database**: policia_db
- **Usuário**: postgres
- **Senha**: postgres

### 2. Executar Migrations

```bash
# Criar as tabelas no banco de dados
npx knex migrate:latest
```

**Tabelas criadas:**
- `agentes`: id, nome, dataDeIncorporacao, cargo, created_at, updated_at
- `casos`: id, titulo, descricao, status, agente_id (foreign key), created_at, updated_at
- `usuarios`: id, nome, email (unique), senha (hashed), created_at, updated_at

### 3. Rodar Seeds (Dados Iniciais)

```bash
# Popular o banco com dados de exemplo
npx knex seed:run
```

**Dados inseridos:**
- 2 agentes (Maria Santos - delegado, Pedro Oliveira - inspetor) via `agentes.js`
- 2 casos (Furto de veículo, Vandalismo em escola) via `casos.js`
- 2 usuários (Admin Sistema, João Silva Santos) com senhas hasheadas via `usuarios.js`

## 🏃‍♂️ Executando a Aplicação

### Desenvolvimento (com auto-reload)
```bash
npm run dev
```

### Produção
```bash
npm start
```

A API estará disponível em: **http://localhost:3000**

## 🔐 Sistema de Autenticação (Etapa 4)

### Como Funciona
A API agora utiliza **autenticação JWT** para proteger os endpoints. Todos os endpoints de agentes e casos requerem um token válido.

### Fluxo de Autenticação
1. **Registrar usuário** → `POST /auth/register`
2. **Fazer login** → `POST /auth/login` (recebe access_token)
3. **Usar token** → Incluir `Authorization: Bearer <token>` nos headers
4. **Logout** → `POST /auth/logout`

### Endpoints de Autenticação

**Autenticação (Acesso público):**
- `POST /auth/register` - Registrar novo usuário
- `POST /auth/login` - Fazer login (retorna JWT token)
- `POST /auth/logout` - Fazer logout

**Gerenciamento de usuários (Requer autenticação):**
- `DELETE /users/:id` - Deletar usuário
- `GET /usuarios/me` - **[BONUS]** Obter perfil do usuário autenticado

### Endpoints Protegidos (Requer JWT Token)

**Agentes:**
- `GET /agentes` - Listar agentes 🔒
- `GET /agentes/:id` - Buscar agente por ID 🔒
- `POST /agentes` - Criar agente 🔒
- `PUT /agentes/:id` - Atualizar agente completo 🔒
- `PATCH /agentes/:id` - Atualizar agente parcial 🔒
- `DELETE /agentes/:id` - Remover agente 🔒
- `GET /agentes/:id/casos` - **[BONUS]** Listar casos de um agente específico 🔒

**Casos:**
- `GET /casos` - Listar casos 🔒
- `GET /casos/:id` - Buscar caso por ID 🔒
- `POST /casos` - Criar caso 🔒
- `PUT /casos/:id` - Atualizar caso completo 🔒
- `PATCH /casos/:id` - Atualizar caso parcial 🔒
- `DELETE /casos/:id` - Remover caso 🔒

## 📚 Documentação da API

Acesse a documentação Swagger em: **http://localhost:3000/docs/**

## 🔧 Comandos Úteis

### Gerenciar Banco de Dados

```bash
# Verificar status das migrations
npx knex migrate:status

# Reverter última migration
npx knex migrate:rollback

# Recriar seeds
npx knex seed:run

# [BONUS] Reset completo do banco (rollback + migrate + seed)
npm run db:reset

# Parar container do banco
docker-compose down

# Parar e remover volumes (apaga dados)
docker-compose down -v
```

### Conectar diretamente ao PostgreSQL

```bash
# Via Docker
docker exec -it policia_db_container psql -U postgres -d policia_db

# Comandos úteis no psql:
# \dt - listar tabelas
# \d agentes - mostrar estrutura da tabela agentes
# SELECT * FROM agentes; - mostrar todos os agentes
# \q - sair
```

## 🧪 Testando a API com Autenticação

### 1. Registrar um novo usuário
```bash
curl -X POST http://localhost:3000/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "nome": "João Silva",
    "email": "joao@policia.gov.br",
    "senha": "MinhaSenh@123!"
  }'
```

**Requisitos da senha:**
- Mínimo 8 caracteres
- Pelo menos 1 letra minúscula
- Pelo menos 1 letra maiúscula  
- Pelo menos 1 número
- Pelo menos 1 caractere especial (@$!%*?&)

### 2. Fazer login e obter token JWT
```bash
curl -X POST http://localhost:3000/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "joao@policia.gov.br",
    "senha": "MinhaSenh@123!"
  }'
```

**Resposta esperada (Status 200):**
```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

### 3. Usar o token para acessar endpoints protegidos
```bash
# Armazenar o token (substitua pelo token real)
TOKEN="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."

# Criar um agente (agora requer autenticação)
curl -X POST http://localhost:3000/agentes \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{
    "nome": "João Silva",
    "dataDeIncorporacao": "2020-03-15",
    "cargo": "delegado"
  }'

# Criar um caso (agora requer autenticação)
curl -X POST http://localhost:3000/casos \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{
    "titulo": "Roubo de banco",
    "descricao": "Assalto ao banco central",
    "status": "aberto",
    "agente_id": 1
  }'

# Listar casos de um agente (agora requer autenticação)
curl -X GET http://localhost:3000/agentes/1/casos \
  -H "Authorization: Bearer $TOKEN"
```

### 4. Obter perfil do usuário (Bonus)
```bash
curl -X GET http://localhost:3000/usuarios/me \
  -H "Authorization: Bearer $TOKEN"
```

### 5. Fazer logout
```bash
curl -X POST http://localhost:3000/auth/logout \
  -H "Authorization: Bearer $TOKEN"
```

### Testando Erros de Autenticação

**Sem token (deve retornar 401):**
```bash
curl -X GET http://localhost:3000/agentes
# Retorna: {"error":"Token de acesso não fornecido"}
```

**Token inválido (deve retornar 401):**
```bash
curl -X GET http://localhost:3000/agentes \
  -H "Authorization: Bearer token_invalido"
# Retorna: {"error":"Token inválido"}
```

**Email já em uso (deve retornar 400):**
```bash
curl -X POST http://localhost:3000/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "nome": "Outro Usuário",
    "email": "joao@policia.gov.br",
    "senha": "OutraSenh@456!"
  }'
# Retorna: {"error":"Email já está em uso"}
```

## ❗ Solução de Problemas

### Erro de conexão com o banco
1. Verifique se o Docker está rodando: `docker ps`
2. Verifique se o container está healthy: `docker-compose ps`
3. Reinicie o container: `docker-compose restart`

### Tabelas não encontradas
1. Execute as migrations: `npx knex migrate:latest`
2. Verifique se as migrations foram aplicadas: `npx knex migrate:status`

### Dados não aparecem
1. Execute os seeds: `npx knex seed:run`
2. Verifique no banco: `docker exec policia_db_container psql -U postgres -d policia_db -c "SELECT * FROM agentes;"`

### Porta 3000 em uso
1. Mate processos na porta: `lsof -ti:3000 | xargs kill -9`
2. Ou mude a porta no `server.js`

## 📝 Notas Importantes

### Banco de Dados
- **IDs são auto-incrementais**: Não envie ID no corpo das requisições POST
- **Foreign Keys**: Casos devem referenciar agentes existentes
- **Formato de data**: Use YYYY-MM-DD para dataDeIncorporacao
- **Status válidos**: "aberto" ou "solucionado"
- **Cargos válidos**: "delegado" ou "inspetor"

### Autenticação e Segurança
- **JWT Token**: Válido por 24 horas após login
- **Header obrigatório**: `Authorization: Bearer <token>` em endpoints protegidos
- **Senhas**: Armazenadas com hash bcrypt (salt 10)
- **Validação de email**: Deve ser único no sistema
- **Status codes importantes**:
  - `200`: Login bem-sucedido
  - `400`: Email já em uso ou dados inválidos
  - `401`: Token inválido/expirado ou credenciais inválidas

### Usuarios Padrão (Seeds)
```
Email: admin@policia.gov.br
Senha: AdminPass123!

Email: joao.santos@policia.gov.br  
Senha: UserPass456@
```