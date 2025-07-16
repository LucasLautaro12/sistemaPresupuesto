import "dotenv/config";
import jwt from "jsonwebtoken";
/* import { TOKEN_SECRET } from "../config.js"; */

const TOKEN_SECRET = process.env.TOKEN_SECRET;

export const auth = (req, res, next) => {
  console.log('Verificando TOKEN')
  const { token } = req.cookies;
  if (!token)
    return res.status(401).json({ message: "No token, authorization denied" });
  jwt.verify(token, TOKEN_SECRET, (err, user) => {
    if (err) return res.status(401).json({ message: "Invalid token" });
    req.user = user;
    next();
  });
};