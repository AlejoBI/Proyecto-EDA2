import jwt from 'jsonwebtoken';
import { SECRET_ACCESS_TOKEN } from "../server/config.js";

export const authRequired = (req, res, next) => {
    const { token } = req.cookies;
    if (!token) return res.status(401).json({ message: "No autorizado" });

    jwt.verify(token, SECRET_ACCESS_TOKEN, (error, user) => {
        if (error) return res.status(403).json({ message: "Token invalido" });
        req.user = user;
        next();
    });

}