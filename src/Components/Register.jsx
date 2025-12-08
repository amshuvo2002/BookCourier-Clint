import { useState, useContext } from "react";
import { Authcontext } from "../Context/Authcontext";
import { FiEye, FiEyeOff } from "react-icons/fi";
import { Link, useNavigate } from "react-router";
import Swal from "sweetalert2";
import { updateProfile, GoogleAuthProvider, } from "firebase/auth";
import { FcGoogle } from "react-icons/fc";

export default function Register() {
  const [showPass, setShowPass] = useState(false);
  const { register, googleLogin, setUser } = useContext(Authcontext);
  const navigate = useNavigate();
  const googleProvider = new GoogleAuthProvider();

  // 🔹 Google Login Handler
  const handleGoogleLogin = async () => {
    try {
      await googleLogin(); // context update inside
      Swal.fire({
        icon: "success",
        title: "Google Login Successful!",
        text: `Welcome!`,
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

  // 🔹 Main Register Handler
  const handleRegister = async (e) => {
    e.preventDefault();
    const name = e.target.name.value;
    const email = e.target.email.value;
    const password = e.target.password.value;
    const image = e.target.image.files[0];

    const passRegex = /^(?=.*[A-Z])(?=.*\d).{6,}$/;
    if (!passRegex.test(password)) {
      return Swal.fire({
        icon: "warning",
        title: "Weak Password!",
        text: "Password must be 6 chars with 1 uppercase & 1 number.",
      });
    }

    try {
      const userCredential = await register(email, password, name, image);
      const user = userCredential.user;

      // Image URL
      let photoURL = image ? URL.createObjectURL(image) : "";

      // Update Firebase profile
      await updateProfile(user, { displayName: name, photoURL });

      // ✅ Update context instantly
      setUser({ ...user, displayName: name, photoURL });

      Swal.fire({
        icon: "success",
        title: "Registration Successful!",
        text: `Welcome, ${name}`,
      });

      navigate("/"); // redirect to home
    } catch (err) {
      Swal.fire({
        icon: "error",
        title: "Registration Failed!",
        text: err.message,
      });
    }
  };

  return (
    <div className="w-full max-w-sm mx-auto border mb-10 p-6 mt-10 rounded-xl">
      <h2 className="text-xl font-bold mb-4 text-center">Register</h2>

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

        <div className="relative mb-3">
          <input
            type={showPass ? "text" : "password"}
            name="password"
            placeholder="Password"
            className="input input-bordered w-full pr-10"
            required
          />
          <span
            onClick={() => setShowPass(!showPass)}
            className="absolute right-3 top-3 cursor-pointer text-xl"
          >
            {showPass ? <FiEyeOff /> : <FiEye />}
          </span>
        </div>

        <button className="btn btn-primary w-full mb-3">Register</button>

        <button
          type="button"
          onClick={handleGoogleLogin}
          className="btn w-full flex items-center justify-center gap-2 mt-2"
        >
          <FcGoogle className="text-2xl" /> Continue with Google
        </button>

        <p className="text-center mt-4 text-sm">
          Already have an account?{" "}
          <Link to="/login" className="text-blue-600 font-semibold">
            Login
          </Link>
        </p>
      </form>
    </div>
  );
}
