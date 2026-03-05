import jwt from "jsonwebtoken";
import User from "../../models/User.js";
import { ENV } from "../lib/env.js";

export const protectRoute = async (req, res, next) => {
    try {
        const token = req.cookies.jwt;
        if(!token) return res.status(401).json({message: "Unauthorized, no token provided"});

        const decoded = jwt.verify(token, ENV.JWT_SECRET);
        if(!decoded) return res.status(401).json({message: "Unauthorized, invalid token"});

        const user = await User.findById(decoded.userId).select("-password");//we are selecting all the fields of the user except the password field, because we don't want to send the password field in the response, even if it's hashed, it's a good practice to not send the password field in the response
        if(!user) return res.status(404).json({message: "User not found"});

        req.user = user;//we are attaching the user object to the request object, so that we can access the user object in the next middleware or in the route handler, we can access it by req.user
        next();

    } catch (error) {
        console.error("Error in protectRoute middleware: ", error);
        return res.status(500).json({message: "Internal Server Error"});
    }
};