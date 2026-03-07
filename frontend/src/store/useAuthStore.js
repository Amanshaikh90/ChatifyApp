import { create } from "zustand";

export const useAuthStore = create((set) => ({
    authUser: { name: "john", _id: 123, age: 25 },
    isloading: false,

    login: () => {
        console.log("Login function called");
        set({ isLoggedIn: true });
    },
}));
// This file defines a Zustand store for authentication. It includes an `authUser` state to track the authenticated user and a `login` function that currently just logs a message to the console.