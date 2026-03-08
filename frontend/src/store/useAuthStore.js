import { create } from "zustand";
import { axiosInstance } from "../lib/axios";
import axios from "axios";
import toast from "react-hot-toast";

export const useAuthStore = create((set,get) => ({
    authUser: null,
    isCheckingAuth: true,
    isSigningUp: false,

    checkAuth: async () => {
        try {
            const res = await axiosInstance.get("/auth/check");
            set({ authUser: res.data });

        } catch (error) {
            console.log("Error in authCheck: ",error);
            set({authUser:null});
        } finally {
            set({ isCheckingAuth: false});
        }
    },

    signup: async(data) => {
        set({isSigningUp: true})
        try{
            const res = await axiosInstance.post("/auth/signup",data);
            set({authUser: res.data})

            //toastify success

            toast.success("Account created successfully!")

        } catch(error){
            toast.error(error.response.data.message)
        } finally{
            set({isSignUp:false})
        }
    }
}));
// This file defines a Zustand store for authentication. It includes an `authUser` state to track the authenticated user and a `login` function that currently just logs a message to the console.