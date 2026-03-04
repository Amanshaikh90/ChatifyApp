import { generateTocken } from "../utils/generateToken.js";
import User from "../models/User.js";
import bcrypt from "bcrypt.js";
export const signup = async (req,res) => {
    const {fullName, email, password} = req.body//got the email and password from the request body, which is sent by the frontend when the user tries to sign up ,got by the middleware in server.js
    try {
        ////check if all fields are provided and everything is valid//////////////////////////////////////////////
        if(!fullName || !email || !password){
            return res.status(400).json({message: "All fields are required"});
        }

        if(password.length < 6){
            return res.status(400).json({message: "Password must be at least 6 characters"});
        }

        //check if emails valid: regex
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if(!emailRegex.test(email)){
            return res.status(400).json({message: "Invalid email address"});
        }

        const user = await User.findOne({email});

        if(user) return res.status(400).json({message: "Email already exists"})
        /////////////////////////////////////////////////////////////////////////////////////////////////////////




        //Now pswrd hashing of the user//////////////////////////////////////////////////////
        const salt = await bcrypt.genSalt(10)//like if we want the hashed password to be of 10 letters, we can specify it here, default is 10
        const hashedPassword = await bcrypt.hash(password,salt)
        ////////////////////////////////////////////////////////////////////////////////////


        ///Now we will create a new user with the hashed password and save it to the database, and also generate a JWT token for the user and send it back in the response////////////////////////////
        const newUser = new User({
            fullName,
            email,
            password: hashedPassword
        })

        if(newUser){
            generateTocken(newUser._id, res);
            await newUser.save();

            res.status(201).json({
                _id: newUser._id,
                fullName: newUser.fullName,
                email: newUser.email,
                profilePic: newUser.profilePic,
            });

            //todo : send welcome email to the user
        }
        else{
            res.status(400).json({message: "Invalid user data"})
        }
        ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

    } catch (error) {
        console.log("Error in signup controller: " + error.message);
        res.status(500).json({message: " Internal Server error"});
    }
};