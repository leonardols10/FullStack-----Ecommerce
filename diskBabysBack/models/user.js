const db = require('../util/database');
const FileSave = require('../util/save');

module.exports = class User{
    constructor(id,email,password,role){
        this.id=id;
        this.email=email;
        this.password=password;
        this.role=role;
    }

    static find(user){
        return db.execute('select * from user where email = ? and password = ?',[user.email,user.password])
            .then(result => {
                console.log("Ok")
                return result[0];
            })
            .catch(err => {
                console.error("Erro ao encontrar o usuario:", err);
                throw err;
            });
    }
    

    static fetchAll() {
        return db.execute('SELECT * FROM user');
    }
    
    static post(user) {
        console.log("Posting user with data:");
        console.log(user);
        return db.execute('Insert into user (email, password, role, picture, name, phone,address) Values (?,?,?,?,?,?,?)', [user.email,user.password,user.role,user.picture, user.name, user.phone, user.address])
            .then(result => {
                console.log("Usuario criado com sucesso ID:", result[0].insertId);
                return result[0].insertId;
            })
            .catch(err => {
                console.error("Erro ao criar um usuario", err);
                throw err;
            });
    }
    

    static updateWithoutPicture(user)
    {
        return db.execute('update user set email = ? , password = ?, role = ? where id = ?',[user.email,user.password,user.role, user.id]);
    }

    static updateWithPicture(user)
    {
       
        try{
            var path = FileSave.saveUserPicture(user.id, user.picture);

            return db.execute('update user set email = ? , password = ?, role = ?,  picture = ? where id = ?',[user.email, user.password,user.role, path, user.id]);
        } catch (error) {
            
        }
    }

    static update(user){
        return db.execute('update user set email = ?, password = ?, role = ? where id = ?', [user.email,user.password,user.role, user.id]);
    }

    static delete(id){
        return db.execute('delete from user where id = ?', [id]);
    }
    
};
