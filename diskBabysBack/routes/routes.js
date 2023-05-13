const express = require('express');

const userController = require('../controllers/user')
const { authenticateToken } = require('../middlewares/authentication');



const router = express.Router();

//rotas do usuario
router.get('/all', userController.getAllUsers)
router.post('/register', userController.registerUser)
router.post('/login', userController.loginUser)
router.get('/user', userController.getUser)
router.put('/user', authenticateToken, userController.putUser);
router.put('/user/picture', authenticateToken, userController.putPicture);
router.delete('/user/:id', authenticateToken, userController.deleteUser);


module.exports = router;