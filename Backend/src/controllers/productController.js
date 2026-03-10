import ProductModel from "../models/productModel.js";

export const addProduct = async (req, res) => {
    try {
        const { barcode, productName, category, quantity, saleprice, purchasePrice, unit  } = req.body
        const doc = new ProductModel({
            barcode,
            productName,
            category,
            quantity,
            saleprice,
            purchasePrice,
            unit
        })
        const result = await doc.save()
        res.status(200).json(result)
    } catch (error) {
        res.status(500).json({ success: false, message: 'Internal Server Error' });
    }
}

// ---------- GET ALL PRODUCTS ------------------------

export const getAllProducts = async(req, res)=>{
    try {
        const show = await ProductModel.find()
        res.status(200).json(show)
    } catch (error) {
        console.log("Can't fetch all products", error)
    }
}

// -------------- COUNT ALL PRODUCTS ---------------

export const countProducts = async(req, res)=>{
    try {
        const result = await ProductModel.countDocuments()
        res.status(200).json(result)
    } catch (error) {
        console.log(error)
    }
}

// ------------------------- DELTEING BY ID ----------------------

export const deleteProduct = async(req, res) =>{
    try {
        const response = await ProductModel.findByIdAndDelete(req.params.id, req.body)
        res.status(200).json(response)
    } catch (error) {
        console.log(error)
    }
}

// ---------------- setting up the update funtion ---------------------

export const updateProductById = async(req, res)=>{
    try {
        const response = await ProductModel.findByIdAndUpdate(req.params.id, req.body)
        res.status(200).json(response)
    } catch (error) {
        console.log(error)
    }
}


// find by barcode

export const searchByBarcode = async(req, res)=>{
    try {
        const barcode = req.params.barcode
        const product = await ProductModel.findOne({ barcode });
        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }
        return res.status(200).json(product);
        
    } catch (error) {
        
        console.error('Error finding product by barcode:', error);
        return res.status(500).json({ message: 'Server error' });
    }
}