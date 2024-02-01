const Product = require('../models/productModel');
const Variant = require('../models/variantModel');
const mongoose=require("mongoose")
module.exports = {
    createProduct: async (req, res) => {
        try {
            const { name, description, price, variants } = req.body;

            const product = new Product({
                name,
                description,
                price,
                variants: []
            });

            if (variants && variants.length > 0) {
                for (const variantData of variants) {
                    const variant = new Variant(variantData);
                    await variant.save();
                    product.variants.push(variant._id);
                }
            }

            await product.save();
            res.status(201).json(product);
        } catch (error) {
            console.error('Error creating product:', error);
            res.status(500).json({ error: 'Internal Server Error' });
        }
    },

    getAllProducts: async (req, res) => {
        try {
            const products = await Product.find().populate('variants');
            res.status(200).json(products);
        } catch (error) {
            console.error('Error fetching products:', error);
            res.status(500).json({ error: 'Internal Server Error' });
        }
    },

    getProductById: async (req, res) => {
        try {
            const productId = req.params.productId;
            const product = await Product.findById(productId).populate('variants');
            if (!product) {
                return res.status(404).json({ error: 'Product not found' });
            }
            res.status(200).json(product);
        } catch (error) {
            console.error('Error fetching product:', error);
            res.status(500).json({ error: 'Internal Server Error' });
        }
    },

    updateProduct: async (req, res) => {
        try {
            const productId = req.params.productId;
            const { name, description, price, variants } = req.body;

            const product = await Product.findById(productId);
            if (!product) {
                return res.status(404).json({ error: 'Product not found' });
            }

            product.name = name || product.name;
            product.description = description || product.description;
            product.price = price || product.price;

            if (variants && variants.length > 0) {
                product.variants = [];
                for (const variantData of variants) {
                    const variant = new Variant(variantData);
                    await variant.save();
                    product.variants.push(variant._id);
                }
            }

            await product.save();
            res.status(200).json(product);
        } catch (error) {
            console.error('Error updating product:', error);
            res.status(500).json({ error: 'Internal Server Error' });
        }
    },

    deleteProduct: async (req, res) => {
        try {
            const productId = req.params.productId;
            const product = await Product.findById(productId);
            if (!product) {
                return res.status(404).json({ error: 'Product not found' });
            }

            await Product.findByIdAndDelete(productId);
            res.status(204).send();
        } catch (error) {
            console.error('Error deleting product:', error);
            res.status(500).json({ error: 'Internal Server Error' });
        }
    },
    searchProducts: async (req, res) => {
        try {
            const searchTerm = req.query.term;
            // console.log('Search Term:', searchTerm);

            const regex = new RegExp(searchTerm, 'i');
            const priceFilter = isNaN(searchTerm) ? {} : { price: searchTerm };
            const products = await Product.find({
                $or: [
                    { name: { $regex: regex } },
                    { description: { $regex: regex } },
                    { 'variants.name': { $regex: regex } },
                    priceFilter
                ]
            }).populate('variants');

            res.status(200).json(products);
        } catch (error) {
            if (error instanceof mongoose.Error.CastError) {
                console.error('CastError in searchProducts:', error.message);
                res.status(400).json({ error: 'Invalid data format in search term' });
            } else {
                console.error('Error searching products:', error);
                res.status(500).json({ error: 'Internal Server Error' });
            }
        }
    }

};
