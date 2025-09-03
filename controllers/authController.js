const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const usuariosRepository = require('../repositories/usuariosRepository');
const { registerSchema, loginSchema } = require('../schemas');

class AuthController {
  async register(req, res) {
    try {
      // Validar dados de entrada
      const validatedData = registerSchema.parse(req.body);
      const { nome, email, senha } = validatedData;

      // Verificar se email já existe
      const emailExists = await usuariosRepository.emailExists(email);
      if (emailExists) {
        return res.status(400).json({
          error: 'Email já está em uso'
        });
      }

      // Hash da senha
      const hashedPassword = await bcrypt.hash(senha, 10);

      // Criar usuário
      const usuario = await usuariosRepository.create({
        nome,
        email,
        senha: hashedPassword
      });

      res.status(201).json({
        message: 'Usuário criado com sucesso',
        usuario: {
          id: usuario.id,
          nome: usuario.nome,
          email: usuario.email
        }
      });

    } catch (error) {
      if (error.name === 'ZodError') {
        return res.status(400).json({
          error: 'Dados inválidos',
          details: error.errors ? error.errors.map(err => ({
            field: err.path ? err.path.join('.') : 'unknown',
            message: err.message
          })) : [{ message: error.message }]
        });
      }
      
      console.error('Erro no registro:', error);
      res.status(500).json({
        error: 'Erro interno do servidor'
      });
    }
  }

  async login(req, res) {
    try {
      // Validar dados de entrada
      const validatedData = loginSchema.parse(req.body);
      const { email, senha } = validatedData;

      // Buscar usuário por email
      const usuario = await usuariosRepository.findByEmail(email);
      if (!usuario) {
        return res.status(401).json({
          error: 'Credenciais inválidas'
        });
      }

      // Verificar senha
      const senhaValida = await bcrypt.compare(senha, usuario.senha);
      if (!senhaValida) {
        return res.status(401).json({
          error: 'Credenciais inválidas'
        });
      }

      // Gerar JWT token
      const jwtSecret = process.env.JWT_SECRET || 'fallback_secret_key_for_tests';
      const token = jwt.sign(
        { 
          id: usuario.id, 
          email: usuario.email,
          nome: usuario.nome
        },
        jwtSecret,
        { expiresIn: '24h' }
      );

      res.status(200).json({
        access_token: token
      });

    } catch (error) {
      if (error.name === 'ZodError') {
        return res.status(400).json({
          error: 'Dados inválidos',
          details: error.errors ? error.errors.map(err => ({
            field: err.path ? err.path.join('.') : 'unknown',
            message: err.message
          })) : [{ message: error.message }]
        });
      }

      console.error('Erro no login:', error);
      res.status(500).json({
        error: 'Erro interno do servidor'
      });
    }
  }

  async logout(req, res) {
    try {
      // Para JWT stateless, logout é principalmente do lado do cliente
      // Aqui podemos apenas retornar sucesso
      res.status(200).json({
        message: 'Logout realizado com sucesso'
      });

    } catch (error) {
      console.error('Erro no logout:', error);
      res.status(500).json({
        error: 'Erro interno do servidor'
      });
    }
  }

  async deleteUser(req, res) {
    try {
      const { id } = req.params;
      const userId = parseInt(id, 10);

      if (isNaN(userId)) {
        return res.status(400).json({
          error: 'ID deve ser um número válido'
        });
      }

      // Verificar se usuário existe
      const usuario = await usuariosRepository.findById(userId);
      if (!usuario) {
        return res.status(404).json({
          error: 'Usuário não encontrado'
        });
      }

      // Deletar usuário
      await usuariosRepository.delete(userId);

      res.status(204).send();

    } catch (error) {
      console.error('Erro ao deletar usuário:', error);
      res.status(500).json({
        error: 'Erro interno do servidor'
      });
    }
  }

  async getProfile(req, res) {
    try {
      // req.user é definido pelo middleware de autenticação
      const usuario = await usuariosRepository.findById(req.user.id);
      
      if (!usuario) {
        return res.status(404).json({
          error: 'Usuário não encontrado'
        });
      }

      res.status(200).json({
        usuario: {
          id: usuario.id,
          nome: usuario.nome,
          email: usuario.email,
          created_at: usuario.created_at,
          updated_at: usuario.updated_at
        }
      });

    } catch (error) {
      console.error('Erro ao buscar perfil:', error);
      res.status(500).json({
        error: 'Erro interno do servidor'
      });
    }
  }
}

module.exports = new AuthController();