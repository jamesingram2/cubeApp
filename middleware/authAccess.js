const jwt = require("jsonwebtoken");
const authAccess = (req, res, next) => {
   const token = req.cookies.access_token;
   if (!token) {
      res.redirect("/users/login");
   }
   try {
      const decodedObject = jwt.verify(token, process.env.SECRET);
      next();
   } catch (err) {
      res.redirect("/login");
   }
};
module.exports = authAccess;
