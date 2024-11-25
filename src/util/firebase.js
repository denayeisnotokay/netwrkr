// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics, isSupported } from "firebase/analytics";
import { getAuth } from "firebase/auth";

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyBz02G-nPkhvg8HTQsmr6D0Qg8na1UuV7c",
    authDomain: "netwrkr-7bd18.firebaseapp.com",
    projectId: "netwrkr-7bd18",
    storageBucket: "netwrkr-7bd18.firebasestorage.app",
    messagingSenderId: "626126003506",
    appId: "1:626126003506:web:89b3ca37963bb576a38b2b",
    measurementId: "G-PH70X8H05W"
}

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
let analytics = undefined;
isSupported().then((value) => {
    if (value) {
        analytics = getAnalytics(app);
    }
});
export const auth = getAuth(app);

export const getMessage = (code) => {
    console.log(code);
    switch (code) {
        case "auth/argument-error":
            return "There was an error with one of the provided arguments.";
        case "auth/requires-recent-login":
            return "Please logout, log back in, and try again.";
        case "auth/wrong-password":
            return "Incorrect password";
        case "auth/user-token-expired":
            return "Your token has expired. Please logout and re-login.";
        case "auth/user-cancelled":
            return "Login process was stopped by you.";
        case "auth/user-not-found":
            return "This account does not exist.";
        case "auth/user-disabled":
            return "Your account has been disabled.";
        case "auth/user-mismatch":
            return "The credential given does not correspond to your account.";
        case "auth/user-signed-out":
            return "You are signed out. Please log back in.";
        case "auth/weak-password":
            return "Your password is too weak. It must be at least six characters long.";
        case "auth/invalid-email":
            return  "The inputted email address is invalid. Please try again with a valid email address.";
        case "auth/internal-error":
            return "An error occurred on our end. Please try again soon.";
        case "auth/timeout":
            return "Authentication has timed out. Please try again.";
        case "auth/email-already-in-use":
            return "An account under the inputted email address already exists. Try logging in, or use a different email address."
        case "auth/unverified-email":
            return "You have not verified your email address yet. Please do this before logging in.";
        case "auth/too-many-requests":
            return "Access to this account has been temporarily disabled due to many failed login attempts. You can immediately restore it by resetting your password or you can try again later.";
        case "auth/invalid-credential":
            return "The inputted email or password is incorrect.";
        default:
            return "Sorry! We ran into an error we don't recognize! Please try again later.";
    }
}

export default function () {}