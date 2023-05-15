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

      static findByPhoneLogged(phone, userId) {
        console.log("Procurando por telefone:", phone);
        return db.execute('SELECT * FROM user WHERE phone = ? AND id <> ?', [phone, userId])
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
      
      static findByEmailLogged(email, userId) {
        console.log("Procurando por email:", email);
        return db.execute('SELECT * FROM user WHERE email = ? AND id <> ?', [email, userId])
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
      

      static updateWithoutPicture(user) {
        try {
            return db.execute(
                'UPDATE user SET email = ?, password = ?, role = ?, name = ?, address = ?, phone = ? WHERE id = ?',
                [user.email, user.password, user.role, user.name, user.address, user.phone, user.id]
            ).then(([result]) => {
                if (result.affectedRows === 0) {
                    throw new Error('Nenhum registro de usuário foi atualizado.');
                }
                return true;
            });
        } catch (error) {
            throw new Error('Erro ao atualizar o usuário: ' + error.message);
        }
    }
    
    

    static updateWithPicture(user) {
      try {
          var path = FileSave.saveUserPicture(user.id, user.picture);
  
          return db.execute(
              'UPDATE user SET email = ?, password = ?, role = ?, picture = ?, name = ?, address = ?, phone = ? WHERE id = ?',
              [user.email, user.password, user.role, path, user.name, user.address, user.phone, user.id]
          );
      } catch (error) {
          throw error;
      }
  }
  

    static update(user){
        return db.execute('update user set email = ?, password = ?, role = ? where id = ?', [user.email,user.password,user.role, user.id]);
    }

    static delete(id){
        return db.execute('delete from user where id = ?', [id]);
    }
    
};
