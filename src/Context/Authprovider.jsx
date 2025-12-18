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
  const [loading, setLoading] = useState(true); 


  const register = async (email, password, name, photoFile) => {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);

    let photoURL = photoFile ? URL.createObjectURL(photoFile) : "";

    await updateProfile(userCredential.user, { displayName: name, photoURL });

    setUser({ ...userCredential.user, displayName: name, photoURL });

    return userCredential;
  };


  const login = (email, password) => signInWithEmailAndPassword(auth, email, password);


  const googleLogin = async () => {
    const provider = new GoogleAuthProvider();
    const result = await signInWithPopup(auth, provider);
    setUser(result.user);
    return result;
  };

 
  const logout = async () => {
    await signOut(auth);
    setUser(null);
  };


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
