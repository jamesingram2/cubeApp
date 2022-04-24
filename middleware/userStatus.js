const jwt = require("jsonwebtoken");
const userStatus = async (req, res, next) => {
   const token = await req.cookies.access_token;
   if (!token) {
      console.log("User is not logged in");
      req.isLoggedIn = false;
   }

   try {
      const decodedObject = jwt.verify(token, process.env.SECRET);
      console.log("User is logged in");
      req.isLoggedIn = true;
   } catch (err) {
      console.log("Error: User is not logged in");
      req.isLoggedIn = false;
   }
   next();
};
module.exports = userStatus;
