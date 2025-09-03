const express = require('express');
const authController = require('../controllers/authController');
const authMiddleware = require('../middlewares/authMiddleware');

const router = express.Router();

/**
 * @swagger
 * /users/{id}:
 *   delete:
 *     summary: Deletar usuário
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID do usuário
 *     responses:
 *       204:
 *         description: Usuário deletado com sucesso
 *       400:
 *         description: ID inválido
 *       401:
 *         description: Token inválido ou expirado
 *       404:
 *         description: Usuário não encontrado
 */
router.delete('/:id', authMiddleware, authController.deleteUser);

module.exports = router;