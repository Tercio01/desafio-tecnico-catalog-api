/**
 * @swagger
 * /api/products:
 *   get:
 *     summary: Listar todos os produtos
 *     tags: [Products]
 *     parameters:
 *       - in: query
 *         name: category
 *         schema:
 *           type: string
 *         description: Filtrar por categoria
 *       - in: query
 *         name: minPrice
 *         schema:
 *           type: number
 *         description: Preço mínimo
 *       - in: query
 *         name: maxPrice
 *         schema:
 *           type: number
 *         description: Preço máximo
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: Buscar por nome ou descrição
 *     responses:
 *       200:
 *         description: Lista de produtos
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Product'
 *   post:
 *     summary: Criar novo produto (Admin)
 *     tags: [Products]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - description
 *               - price
 *               - category
 *               - sku
 *               - stock
 *             properties:
 *               name:
 *                 type: string
 *                 example: Smartphone Samsung Galaxy
 *               description:
 *                 type: string
 *                 example: Smartphone Android com 128GB
 *               price:
 *                 type: number
 *                 example: 1299.99
 *               category:
 *                 type: string
 *                 example: eletrônicos
 *               sku:
 *                 type: string
 *                 example: SM-GALAXY-001
 *               stock:
 *                 type: integer
 *                 example: 50
 *     responses:
 *       201:
 *         description: Produto criado com sucesso
 *       401:
 *         description: Não autenticado
 *       403:
 *         description: Sem permissão (apenas admin)
 */

/**
 * @swagger
 * /api/products/{id}:
 *   get:
 *     summary: Buscar produto por ID
 *     tags: [Products]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID do produto
 *     responses:
 *       200:
 *         description: Produto encontrado
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   $ref: '#/components/schemas/Product'
 *       404:
 *         description: Produto não encontrado
 *   put:
 *     summary: Atualizar produto (Admin)
 *     tags: [Products]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               description:
 *                 type: string
 *               price:
 *                 type: number
 *               category:
 *                 type: string
 *               sku:
 *                 type: string
 *               stock:
 *                 type: integer
 *     responses:
 *       200:
 *         description: Produto atualizado
 *       401:
 *         description: Não autenticado
 *       403:
 *         description: Sem permissão
 *       404:
 *         description: Produto não encontrado
 *   delete:
 *     summary: Deletar produto (Admin)
 *     tags: [Products]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Produto deletado
 *       401:
 *         description: Não autenticado
 *       403:
 *         description: Sem permissão
 *       404:
 *         description: Produto não encontrado
 */
