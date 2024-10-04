 // middlewares 
 const jwt = require('jsonwebtoken');
 
 const verifyToken = (req, res, next) => {
  
    // console.log(req.headers.authorization);
    if (!req.headers.authorization) {
      return res.status(401).send({ message: `Aucun token n\'est transmis vous n'/avez pas accès` });
    }
    const token = req.headers.authorization.split(' ')[1];
    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
      if (err) {
        return res.status(401).send({ message: `Aucun token n\'est transmis vous n'/avez pas accès` })
      }
      req.decoded = decoded;
      next();
    })
  }

  module.exports = verifyToken;
  