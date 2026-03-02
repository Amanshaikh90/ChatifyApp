import express from 'express';

const router = express.Router();

router.get("/signup",(req,res) => {
    res.send("Signup endoint");
});

router.get("/login",(req,res) => {
    res.send("Login endpoint");
});

router.get("/logout",(req,res) => {
    res.send("Logout endoint");
});


export default router;

