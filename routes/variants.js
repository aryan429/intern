const express = require('express');
const router = express.Router();
const variantController = require('../controllers/variantController');

router.post('/', variantController.createVariant);
router.get('/', variantController.getAllVariants);
router.get('/:variantId', variantController.getVariantById);
router.put('/:variantId', variantController.updateVariant);
router.delete('/:variantId', variantController.deleteVariant);

module.exports = router;
