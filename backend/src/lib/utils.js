import jwt from "jsonwebtoken";

export const generateToken = (userId, res) => {
    const token = jwt.sign({userId}, process.env.JWT_SECRET, {
        expiresIn: "7d",
    });

    res.cookie("jwt", token, {
        maxAge: 7 * 24 * 60 * 60 * 1000, //7 days
        httpOnly: true,//prevent XSS attacks: cross-site scripting
        sameSite: "strict",//CSRF attacks
        secure: process.env.NODE_ENV === "development" ? false : true, //only send cookie over HTTPS in production
    });

    return token;
};

/*
The ID Card (userId): You take the user's unique ID and put it inside the pass so the server knows exactly who this is later.

The Secret Seal (JWT_SECRET): You "sign" the pass with a secret key that only your server knows. If a hacker tries to change the ID on the card, the signature won't match, and the server will reject it.

The Expiry Date (7d): Just like a gym membership, this pass is only valid for 7 days. After that, the user must log in again to get a new one.

2. Giving it to the User (res.cookie)

Instead of just handing the token to the user, you put it in a Cookie. A cookie is a tiny storage box in the browser that automatically gets sent back to the server every time the user makes a request.

maxAge: This tells the browser exactly how long to keep the cookie (7 days in milliseconds).

httpOnly: true: This is a major security feature. It hides the cookie from JavaScript. This means a hacker can't write a malicious script to "steal" the pass from the user's browser.

sameSite: "strict": This ensures the cookie is only sent to your website. It prevents "Cross-Site Request Forgery" (CSRF), which is like someone tricking you into signing a check you didn't mean to sign.

secure: This checks if you are in "Production" (live on the internet) or "Development" (on your Mac). If live, it forces the pass to be sent only over encrypted (HTTPS) connections.
*/