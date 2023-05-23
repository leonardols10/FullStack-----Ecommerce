const express = require('express');

const userController = require('../controllers/user')
const { authenticateToken } = require('../middlewares/authentication');
const productController = require('../controllers/product')



const router = express.Router();

//rotas do usuario
router.get('/all', userController.getAllUsers)
router.post('/register', userController.registerUser)
router.post('/login', userController.loginUser)
router.get('/user', userController.getUser)
router.put('/user', authenticateToken, userController.putUser);
router.put('/user/picture', authenticateToken, userController.putPicture);
router.delete('/user/:id', authenticateToken, userController.deleteUser);
// Rotas do produto
router.get('/user/shop', productController.getAllProducts)
router.get('/user/shop/:pid', productController.getProduct)
router.get('/user/shop/cart/:pid', productController.getProductForCart)
router.post('/product', productController.addProduct)
router.delete('/product/:pid', productController.deleteProduct)
router.put('/product', productController.putProduct)


module.exports = router;