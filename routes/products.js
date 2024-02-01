const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');

router.post('/', productController.createProduct);
router.get('/', productController.getAllProducts);
router.put('/:productId', productController.updateProduct);
router.delete('/:productId', productController.deleteProduct);
router.get('/search', productController.searchProducts);
router.get('/:productId', productController.getProductById);

module.exports = router;
