const Variant = require('../models/variantModel');

module.exports = {
    createVariant: async (req, res) => {
        try {
            const variantData = req.body;
            const variant = new Variant(variantData);
            await variant.save();
            res.status(201).json(variant);
        } catch (error) {
            console.error('Error creating variant:', error);
            res.status(500).json({ error: 'Internal Server Error' });
        }
    },

    getAllVariants: async (req, res) => {
        try {
            const variants = await Variant.find();
            res.status(200).json(variants);
        } catch (error) {
            console.error('Error fetching variants:', error);
            res.status(500).json({ error: 'Internal Server Error' });
        }
    },

    getVariantById: async (req, res) => {
        try {
            const variantId = req.params.variantId;
            const variant = await Variant.findById(variantId);
            if (!variant) {
                return res.status(404).json({ error: 'Variant not found' });
            }
            res.status(200).json(variant);
        } catch (error) {
            console.error('Error fetching variant:', error);
            res.status(500).json({ error: 'Internal Server Error' });
        }
    },

    updateVariant: async (req, res) => {
        try {
            const variantId = req.params.variantId;
            const variantData = req.body;

            const variant = await Variant.findById(variantId);
            if (!variant) {
                return res.status(404).json({ error: 'Variant not found' });
            }

            variant.name = variantData.name || variant.name;
            variant.sku = variantData.sku || variant.sku;
            variant.additionalCost = variantData.additionalCost || variant.additionalCost;
            variant.stockCount = variantData.stockCount || variant.stockCount;

            await variant.save();
            res.status(200).json(variant);
        } catch (error) {
            console.error('Error updating variant:', error);
            res.status(500).json({ error: 'Internal Server Error' });
        }
    },

    deleteVariant: async (req, res) => {
        try {
            const variantId = req.params.variantId;
            const variant = await Variant.findById(variantId);
            if (!variant) {
                return res.status(404).json({ error: 'Variant not found' });
            }

            await Variant.findByIdAndDelete(variantId);
            res.status(204).send();
        } catch (error) {
            console.error('Error deleting variant:', error);
            res.status(500).json({ error: 'Internal Server Error' });
        }
    }
};
