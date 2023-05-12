const db = require('../util/database');
const FileSave = require('../util/save');

module.exports = class User{
    constructor(id,email,password,role){
        this.id=id;
        this.email=email;
        this.password=password;
        this.role=role;
    }

    static find(email, password) {
        return db.execute('SELECT * FROM user WHERE email = ? AND password = ?', [email, password])
          .then(result => {
            if (result[0].length > 0) {
              return result[0][0];
            } else {
              return null;
            }
          })
          .catch(err => {
            console.error('Erro ao encontrar o usuário:', err);
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

    static findByPhone(phone) {
        console.log("Procurando por telefone:", phone);
        return db.execute('SELECT * FROM user WHERE phone = ?', [phone])
          .then(result => {
            if (result[0].length > 0) {
              console.log("Telefone encontrado:", result[0][0]);
              return result[0][0];
            } else {
              console.log("Telefone não encontrado.");
              return null;
            }
          })
          .catch(err => {
            console.error("Erro ao procurar por telefone:", err);
            throw err;
          });
      }
      

    static findByEmail(email) {
        console.log("Procurando por email:", email);
        return db.execute('SELECT * FROM user WHERE email = ?', [email])
          .then(result => {
            if (result[0].length > 0) {
              console.log("Email encontrado:", result[0][0]);
              return result[0][0];
            } else {
              console.log("Email não encontrado.");
              return null;
            }
          })
          .catch(err => {
            console.error("Erro ao procurar por email:", err);
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
