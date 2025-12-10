import React, { useState, useEffect } from "react";
import { Authcontext } from "./Authcontext";
import { auth } from "../Firebase/Firebase.init";
import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  onAuthStateChanged, 
  signOut, 
  updateProfile, 
  GoogleAuthProvider, 
  signInWithPopup 
} from "firebase/auth";

const Authprovider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true); // track loading

  // -----------------------------
  // Register with Email + Password + Photo File
  // -----------------------------
  const register = async (email, password, name, photoFile) => {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);

    let photoURL = photoFile ? URL.createObjectURL(photoFile) : "";

    await updateProfile(userCredential.user, { displayName: name, photoURL });

    setUser({ ...userCredential.user, displayName: name, photoURL });

    return userCredential;
  };

  // -----------------------------
  // Login with Email + Password
  // -----------------------------
  const login = (email, password) => signInWithEmailAndPassword(auth, email, password);

  // -----------------------------
  // Google Login
  // -----------------------------
  const googleLogin = async () => {
    const provider = new GoogleAuthProvider();
    const result = await signInWithPopup(auth, provider);
    setUser(result.user);
    return result;
  };

  // -----------------------------
  // Logout
  // -----------------------------
  const logout = async () => {
    await signOut(auth);
    setUser(null);
  };

  // -----------------------------
  // Listen to auth state changes
  // -----------------------------
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  return (
    <Authcontext.Provider value={{ 
      user, 
      setUser, 
      loading, 
      register, 
      login, 
      signIn: login, 
      googleLogin, 
      logout 
    }}>
      {children}
    </Authcontext.Provider>
  );
};

export default Authprovider;
