const jwt = require('jsonwebtoken');

function authenticateToken(req, res, next) {
  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.split(' ')[1];
  if (token == null) {
    return res.status(401).json({ error: 'Token de autenticação não fornecido.' });
  }
  console.log(token)

  jwt.verify(token, '1234123213213', (err, user) => {
    if (err) {
      return res.status(403).json({ error: 'Falha na autenticação do token.' });
    }
    req.user = user;
    next();
  });
}

module.exports = { authenticateToken };
