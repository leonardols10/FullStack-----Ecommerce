const User = require('../models/user');
const { all } = require('../routes/routes');
const salvarArquivo = require('../util/save');
var fs = require('fs');
var fsp = require('fs').promises;
const validator = require('validator');


exports.getAllUsers = async (req, res, next) =>{
    try{
        const [allUsers] = await User.fetchAll();
        for (var user of allUsers) {
            user.picture =  "data:image/jpeg;base64," + await fsp.readFile("../backend/assets/users/"+user.picture, 'base64');
        }
        res.status(200).json(allUsers);

    } catch{
        console.log('Error');
    }
};

exports.registerUser = async (req, res, next) =>{
    const email = req.body.email;
    const password = req.body.password;
    const name = req.body.name;
    const phone = req.body.phone;
    const address = req.body.address;
    const role = req.body.role;

    const picture = "defaultProfilePic.jpg";
    if (!validator.isEmail(email)) {
        return res.status(400).json({ message: 'Endereço de email inválido.' });
      }
    
    try{
        const userDetails = {
            email:email,
            password:password,
            name:name,
            phone:phone,
            address:address,
            role:role,
            picture:picture
        };
        console.log(userDetails,"user details")
        const postUser = await User.post(userDetails);
        return res.status(201).json({ message: 'Usuário criado.' });
    } catch{
        console.log('Erro');
        return res.status(500).json({ message: 'Erro ao criar usuário.' });
    }
};

exports.loginUser = async (req, res, next) =>{
    const email = req.params.email;
    const password = req.params.password;
    try{
        const userDetails = {
            email:email,
            password:password,
        };
        const login = await User.find(userDetails);
        const [loginTwo] = await User.find(userDetails);
        if(login[0].length>0){ 
            const path = "../backend/assets/users/"+loginTwo[0].picture;
            fs.readFile(path, 'base64', function (err, result) {
                if(err)
                    console.log(err);
                loginTwo[0].picture = "data:image/jpeg;base64,"+ result;
                res.status(202).json(loginTwo);
            });
        }
        else{
            res.status(404).json(loginTwo);
        }
        
    } catch{
        console.log('Erro');
    }
};

exports.getUser = async (req, res, next) =>{ // login pronto
    const email = req.body.email;
    const password = req.body.password;
    const role = req.body.role;
    try{
        const userDetails = {
            email:email,
            password:password,
            role:role,
        };
        const [userFound] = await User.find(userDetails);
        res.status(200).json(userFound);
        
    } catch{
        console.log('Erro');
    }
};

exports.putUser = async (req, res, next) =>{
    const id = req.body.id;
    const email = req.body.email;
    const password = req.body.password;
    const role = req.body.role;
    const picture = req.body.picture;

    try{
        const userDetails = {
            id:id,
            email:email,
            password:password,
            role:role,
            picture:picture
        };
        if (req.body.picture == null || req.body.picture == undefined || req.body.picture == "") {
            var putResponse = await User.updateWithoutPicture(userDetails);
            res.sendStatus(200);
        }
        else {
            var putResponse = await User.updateWithPicture(userDetails);
            res.sendStatus(200);
        }

    } catch{
        console.log('Erro');
    }
};

exports.deleteUser = async (req, res, next) =>{
    try{
        const deleteResponse = await User.delete(req.params.id);
        res.status(200).json(deleteResponse);
    } catch{
        console.log('Error');
    }
};

exports.putPicture = async (req, res, next) => {
    const id = req.body.id;
    const picture = req.body.picture;
    try {
        console.log(id);
        //console.log(picture);
        FileSave.saveUserPicture(id,picture);
        res.send("OK").status(200);
    } catch (error) {
        console.log('Erro:  ' + error);
        res.send("Erro").status(400);
    }
}