import Product from '../src/models/Product';

describe('Product Model', () => {
  describe('Create Product', () => {
    it('should create a product with all fields', async () => {
      const product = await Product.create({
        name: 'Smartphone Samsung Galaxy',
        description: 'Smartphone Android com 128GB',
        price: 1299.99,
        category: 'eletrônicos',
        sku: 'SM-GALAXY-001',
        stock: 50
      });

      expect(product.name).toBe('Smartphone Samsung Galaxy');
      expect(product.price).toBe(1299.99);
      expect(product.stock).toBe(50);
    });

    it('should fail if SKU is duplicate', async () => {
      await Product.create({
        name: 'Product 1',
        description: 'Test',
        price: 99.99,
        category: 'eletrônicos',
        sku: 'UNIQUE-SKU-001',
        stock: 10
      });

      await expect(
        Product.create({
          name: 'Product 2',
          description: 'Test',
          price: 99.99,
          category: 'eletrônicos',
          sku: 'UNIQUE-SKU-001',
          stock: 10
        })
      ).rejects.toThrow();
    });

    it('should validate category enum', async () => {
      await expect(
        Product.create({
          name: 'Invalid Category',
          description: 'Test',
          price: 99.99,
          category: 'invalid-category',
          sku: 'INVALID-001',
          stock: 10
        })
      ).rejects.toThrow();
    });
  });

  describe('Product Queries', () => {
    beforeEach(async () => {
      await Product.create({
        name: 'Notebook Dell',
        description: 'Notebook com Intel i5',
        price: 2999.99,
        category: 'eletrônicos',
        sku: 'DELL-NB-001',
        stock: 10
      });

      await Product.create({
        name: 'Camiseta Básica',
        description: 'Camiseta de algodão',
        price: 49.99,
        category: 'roupas',
        sku: 'CAM-BAS-001',
        stock: 100
      });
    });

    it('should find all products', async () => {
      const products = await Product.find();
      expect(products.length).toBeGreaterThanOrEqual(2);
    });

    it('should filter products by category', async () => {
      const products = await Product.find({ category: 'eletrônicos' });
      expect(products.length).toBeGreaterThan(0);
      expect(products[0].category).toBe('eletrônicos');
    });

    it('should filter products by price range', async () => {
      const products = await Product.find({
        price: { $gte: 100, $lte: 3000 }
      });
      expect(products.length).toBeGreaterThan(0);
    });

    it('should search products by text', async () => {
      const products = await Product.find({
        $text: { $search: 'Notebook' }
      });
      expect(products.length).toBeGreaterThan(0);
    });
  });

  describe('Product Updates', () => {
    let productId: string;

    beforeEach(async () => {
      const product = await Product.create({
        name: 'Test Product',
        description: 'Test description',
        price: 99.99,
        category: 'eletrônicos',
        sku: 'TEST-UPDATE-001',
        stock: 10
      });
      productId = product._id.toString();
    });

    it('should update product price', async () => {
      const updated = await Product.findByIdAndUpdate(
        productId,
        { price: 199.99 },
        { new: true }
      );

      expect(updated?.price).toBe(199.99);
    });

    it('should update product stock', async () => {
      const updated = await Product.findByIdAndUpdate(
        productId,
        { stock: 25 },
        { new: true }
      );

      expect(updated?.stock).toBe(25);
    });

    it('should update multiple fields', async () => {
      const updated = await Product.findByIdAndUpdate(
        productId,
        { price: 299.99, stock: 50, description: 'Updated description' },
        { new: true }
      );

      expect(updated?.price).toBe(299.99);
      expect(updated?.stock).toBe(50);
      expect(updated?.description).toBe('Updated description');
    });
  });

  describe('Product Deletion', () => {
    it('should delete a product', async () => {
      const product = await Product.create({
        name: 'Product to Delete',
        description: 'Test',
        price: 99.99,
        category: 'outros',
        sku: 'DELETE-001',
        stock: 1
      });

      const productId = product._id;
      await Product.findByIdAndDelete(productId);

      const deleted = await Product.findById(productId);
      expect(deleted).toBeNull();
    });

    it('should return null when deleting non-existent product', async () => {
      const fakeId = '507f1f77bcf86cd799439011';
      const result = await Product.findByIdAndDelete(fakeId);
      expect(result).toBeNull();
    });
  });
});
