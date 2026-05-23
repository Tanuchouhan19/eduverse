const express = require('express')
const { getProducts, getMyProducts, addProduct, getProduct, updateProduct, deleteProduct } = require('../controllers/productController')
const protect = require('../middleware/authMiddleware')


const router = express.Router()


router.get("/",getProducts)
router.post("/",protect, addProduct)
router.get("/mine",protect, getMyProducts)
router.get("/:id",getProduct)
router.put("/:id", protect ,  updateProduct)
router.delete("/:id", protect ,  deleteProduct)


module.exports = router  

