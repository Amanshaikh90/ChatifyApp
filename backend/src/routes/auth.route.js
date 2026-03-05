import express from 'express';
import { signup, login, logout, updateProfile} from "../controllers/auth.controller.js";
import { protectRoute } from "../middleware/auth.middleware.js";
import { arcjetProtection } from "../middleware/arcjet.middleware.js";


const router = express.Router();

router.use(arcjetProtection);//we are using the arcjetProtection middleware for all the routes in this router, so that we can protect all the routes in this router from bots and other malicious requests, we can also use it for specific routes if we want to protect only specific routes, but in this case we want to protect all the routes in this router, so we are using it as a middleware for the router

router.post("/signup",signup);

router.post("/login",login);

router.post("/logout",logout);

router.put("/update-profile", protectRoute,updateProfile);

router.get("/check", protectRoute, (req, res) => res.status(200).json(req.user));


export default router;

