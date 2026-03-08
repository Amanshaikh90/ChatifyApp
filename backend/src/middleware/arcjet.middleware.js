import aj from "../lib/arcjet.js";
import { isSpoofedBot } from "@arcjet/inspect";

export const arcjetProtection = async (req,res,next) => {
    try{
        const decision = await aj.protect(req);
        if(decision.isDenied()){
            if(decision.reason.isRateLimit()){
                return res.status(429).json({message: "Rate limit exceed. Please try again later."});
            }
            else if(decision.reason.isBot()){
                return res.status(403).json({message: "Bot access denied."});
            }
            else{
                return res.status(403).json({message: "Access denied."});
            }
        }

        // Optional: Check if the request is from a spoofed bot (e.g. a bot pretending to be a search engine crawler)
        if(isSpoofedBot(req)){
            return res.status(403).json({
                error: "Spoofed bot detected",
                message: "Spoofed bot access denied."
            });
        }

        // If the request is allowed, proceed to the next middleware or route handler
        next();
        
    } catch (error) {
        console.error("Arcjet protection error:", error);
        return res.status(500).json({message: "Internal server error."});
    }
}