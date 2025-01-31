import jwt from "jsonwebtoken";
import Veterinarian from "../models/Veterinarian.js";


const chechAuth = async (req, res, next) => {
    let token;

    if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
        try {
            token = req.headers.authorization.split(' ')[1]

            const decored = jwt.verify(token, process.env.JWT_SECRET)
            req.veterinarian = await Veterinarian.findById(decored.id).select(
                "-password"
            )
            return next();
        } catch (error) {
            const e = new Error('Invalid token');
            return res.status(403).json({ msg: e.messege })
        }
    }
    if (!token) {
        const e = new Error("Invalid Token or doesn't exist");
        res.status(403).json({ msg: e.message })
    }

    
}

export default chechAuth;