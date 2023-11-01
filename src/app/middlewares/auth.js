import jwt from "jsonwebtoken";
import { promisify } from "util"
import authConfig from "../../config/auth"

export default async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    res
    .status(401)
    .json({ error: "Token invalid" });
  }

  const [, token] = authHeader.split(" ");

  try{
   const decoded = await promisify(jwt.verify)(token, authConfig.secret);
    console.log("decoded", decoded)
   return next()
  }catch(error){
    return res.status(401).json({
      error: "Token invalid" 
    })
  }
};
