import { configDotenv } from "dotenv";
import Products from "../routers/products/products-entity.js";
import Users from "../routers/users/users-entity.js";
import jwt from "jsonwebtoken";

configDotenv();


export const authMiddleware = async (req, res, next) => {
    try {
        const { authorization } = req.headers;
        const token = authorization.split(" ")[1];
        const { userId } = jwt.verify(token, process.env.SECRET);
        const user = await Users.findOne({ where: { id: userId } });

        if (!user) {
            return res.status(404).json({ data: "El usuario ingresado ya no se encuentra registrado" });
        }

        next();
    } catch (error) {
        console.log(error);
        return res.status(401).json({ data: "El token no es invalido" });
    }
};