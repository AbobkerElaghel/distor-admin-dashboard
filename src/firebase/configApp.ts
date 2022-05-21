// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";

// import { getAnalytics } from "firebase/analytics";

const firebaseConfig = {
    apiKey: "AIzaSyDcQPOdyt6tKYnnTcWaaGHc6NAHzbjrsiE",
    authDomain: "al-distor-org.firebaseapp.com",
    projectId: "al-distor-org",
    storageBucket: "al-distor-org.appspot.com",
    messagingSenderId: "17612612435",
    appId: "1:17612612435:web:ae0f679a5ff166116f37a6",
    measurementId: "G-06ZL0FMHQJ"
};

const app = initializeApp(firebaseConfig);
// const analytics = getAnalytics(app);

export default app;