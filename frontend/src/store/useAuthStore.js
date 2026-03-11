import { create } from "zustand";
import { axiosInstance } from "../lib/axios";
import axios from "axios";
import toast from "react-hot-toast";


export const useAuthStore = create((set,get) => ({
    authUser: null,
    isCheckingAuth: true,
    isSigningUp: false,
    isLoggingIn: false,

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
    },

    login: async(data) => {
        set({isLoggingIn: true})
        try{
            const res = await axiosInstance.post("/auth/login",data);
            set({authUser: res.data})

            //toastify success

            toast.success("Logged in successfully!")

        } catch(error){
            toast.error(error.response.data.message)
        } finally{
            set({isLoggingIn:false})
        }
    },

    logout: async () => {
        try {
            await axiosInstance.post("/auth/logout");
            set({authUser: null});
            toast.success("Logged out successfully!")
        } catch (error){
            toast.error("Error logging out");
            console.log("Logout error: ", error);
        }
    },

    updateProfile: async (data) => {
        try{
            const res = await axiosInstance.put("/auth/update-profile",data);
            set({ authUser: res.data });
            toastsuccess("Profile updated successfully");
        } catch (error) {
            console.log("Error in update profile:", error);
            toast.error(error.response.data.message);
        }
    }, 



}));
// This file defines a Zustand store for authentication. It includes an `authUser` state to track the authenticated user and a `login` function that currently just logs a message to the console.