import { generateToken } from "../lib/utils.js"; 
import User from "../../models/User.js"; 
import bcrypt from "bcryptjs";
import { ENV } from "../lib/env.js";
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
            /*generateTocken(newUser._id, res);
            await newUser.save();*/

            //Persist user first, then issue auth cookie, to avoid issuing cookie if there is an error while saving user to database
            const savedUser = await newUser.save();//first saving the user in database
            generateTocken(savedUser._id,res);//then generating the token and sending it in the response, we can also send the user data in the response if we want to, but for now we will just send the token in the response

            res.status(201).json({
                _id: newUser._id,
                fullName: newUser.fullName,
                email: newUser.email,
                profilePic: newUser.profilePic,
            });

            //todo : send welcome email to the user

            try {
                await sendWelcomeEmail(savedUser.email, savedUser.fullName, ENV.CLIENT_URL);
            } catch (error) {
                console.error("Error sending welcome email:", error);
            }

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

export const login = async(req,res) => {
    const {email,password} = req.body;
    try{
        const user = await User.findOne({email});

        if(!user) return res.status(400).json({message: "Invalid credentials"});//never tell the client which one is wrong email or password, just say invalid credentials

        const isPasswordCorrect = await bcrypt.compare(password,user.password);
        if(!isPasswordCorrect) return res.status(400).json({message: "Invalid credentials"});

        generateToken(user._id,res)

        res.status(200).json({
            _id: user._id,
            fullName: user.fullName,
            email:user.email,
            profilePic: user.profilePic,
        })

    } catch (error) {
        console.log("Error in login controller: " + error.message);
        res.status(500).json({message: "Internal Server error"});
    }
}

export const logout = (_,res) => {
    res.cookie("jwt" ,"",{maxAge:0});//to delete the cookie we set the maxAge to 0, and set the value to empty string)
    res.status(200).json({message:"Logged out successfully"});
};

export const updateProfile = async (req, res) => {
    try {
        const { profilePic } = req.body;
        if(!profilePic) return res.status(400).json({ message: "Profile pic is required" });

        const userId = req.user._id;//we can access the user object in the request object because we have attached the user object to the request object in the protectRoute middleware, which is used to protect this route, so only authenticated users can access this route

        const uploadResponse = await cloudinary.uploader.upload(profilePic);//we are uploading the profile pic to cloudinary and getting the response which contains the url of the uploaded image

        const updatedUser = await User.findByIdAndUpdate(userId, { profilePic: uploadResponse.secure_url }, { new: true });

        res.status(200).json(updatedUser);
    } catch (error) {
        console.error("Error updating profile:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
};