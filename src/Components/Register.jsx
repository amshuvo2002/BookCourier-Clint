import { useState, useContext } from "react";
import { Authcontext } from "../Context/Authcontext";
import { FiEye, FiEyeOff } from "react-icons/fi";
import { Link, useNavigate } from "react-router";
import Swal from "sweetalert2";
import { updateProfile } from "firebase/auth";
import { FcGoogle } from "react-icons/fc";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { db } from "../Firebase/Firebase.init";

export default function Register() {
  const [showPass, setShowPass] = useState(false);
  const { register, googleLogin, setUser } = useContext(Authcontext); // FIXED
  const navigate = useNavigate();

  // Google Login
  const handleGoogleLogin = async () => {
    try {
      const result = await googleLogin();
      const user = result.user;

      const userRef = doc(db, "users", user.uid);
      const userSnap = await getDoc(userRef);

      if (!userSnap.exists()) {
        await setDoc(userRef, {
          name: user.displayName,
          email: user.email,
          role: "user",
          photoURL: user.photoURL,
        });
      }

      await Swal.fire({
        icon: "success",
        title: "Google Login Successful!",
        text: "Welcome back!",
        timer: 2000,
        showConfirmButton: false,
      });

      navigate("/");
    } catch (err) {
      Swal.fire({
        icon: "error",
        title: "Google Login Failed!",
        text: err.message,
      });
    }
  };

  // Main Register Handler
  const handleRegister = async (e) => {
    e.preventDefault();

    const name = e.target.name.value;
    const email = e.target.email.value;
    const password = e.target.password.value;
    const image = e.target.image.files[0];

    // Password check
    const passRegex = /^(?=.*[A-Z])(?=.*\d).{6,}$/;
    if (!passRegex.test(password)) {
      return Swal.fire({
        icon: "warning",
        title: "Weak Password!",
        text: "Password must be 6+ chars with 1 uppercase & 1 number.",
      });
    }

    try {
      // register from context
      const userCredential = await register(email, password, name, image);
      const user = userCredential.user;

      const photoURL = image ? URL.createObjectURL(image) : "";

      await updateProfile(user, { displayName: name, photoURL });

      // Save user to Firestore
      await setDoc(doc(db, "users", user.uid), {
        name,
        email,
        role: "user",
        photoURL,
      });

      // Update context
      setUser({ ...user, displayName: name, photoURL });

      await Swal.fire({
        icon: "success",
        title: "Registration Successful!",
        text: `Welcome, ${name}!`,
        timer: 2000,
        showConfirmButton: false,
      });

      navigate("/");
    } catch (err) {
      Swal.fire({
        icon: "error",
        title: "Registration Failed!",
        text: err.message,
      });
    }
  };

  return (
    <div className="w-full max-w-sm mx-auto border mb-10 p-6 mt-10 rounded-xl shadow-lg">
      <h2 className="text-2xl font-bold mb-6 text-center text-primary">Register</h2>

      <form onSubmit={handleRegister}>
        <input
          type="text"
          name="name"
          placeholder="Full Name"
          className="input input-bordered w-full mb-3"
          required
        />
        <input
          type="email"
          name="email"
          placeholder="Email"
          className="input input-bordered w-full mb-3"
          required
        />
        <input
          type="file"
          name="image"
          accept="image/*"
          className="file-input file-input-bordered w-full mb-3"
        />

        <div className="relative mb-4">
          <input
            type={showPass ? "text" : "password"}
            name="password"
            placeholder="Password"
            className="input input-bordered w-full pr-10"
            required
          />
          <span
            onClick={() => setShowPass(!showPass)}
            className="absolute right-3 top-3 cursor-pointer text-xl text-gray-500"
          >
            {showPass ? <FiEyeOff /> : <FiEye />}
          </span>
        </div>

        <button type="submit" className="btn btn-primary w-full mb-3">
          Register
        </button>

        <button
          type="button"
          onClick={handleGoogleLogin}
          className="btn btn-outline w-full flex items-center justify-center gap-2"
        >
          <FcGoogle className="text-2xl" /> Continue with Google
        </button>

        <p className="text-center mt-6 text-sm">
          Already have an account?{" "}
          <Link to="/login" className="text-primary font-semibold hover:underline">
            Login
          </Link>
        </p>
      </form>
    </div>
  );
}
