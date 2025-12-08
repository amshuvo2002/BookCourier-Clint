import { useState, useContext } from "react";
import { Authcontext } from "../Context/Authcontext"; 
import { FiEye, FiEyeOff } from "react-icons/fi";
import { Link, useNavigate, useLocation } from "react-router";
import Swal from "sweetalert2";
import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { auth } from "../Firebase/Firebase.init"; 
import { FcGoogle } from "react-icons/fc";

export default function Login() {
  const [showPass, setShowPass] = useState(false);
  const { signIn } = useContext(Authcontext);
  const navigate = useNavigate();
  const location = useLocation();  // ⭐ added
  const from = location.state?.from?.pathname || "/"; // ⭐ added

  const googleProvider = new GoogleAuthProvider();

  // GOOGLE LOGIN
  const handleGoogleLogin = async () => {
    try {
      await signInWithPopup(auth, googleProvider);
      Swal.fire({
        icon: "success",
        title: "Google Login Successful!",
        text: "Welcome back!",
      });
      navigate(from, { replace: true }); // ⭐ redirect back
    } catch (err) {
      Swal.fire({
        icon: "error",
        title: "Google Login Failed!",
        text: err.message,
      });
    }
  };

  // EMAIL/PASSWORD LOGIN
  const handleLogin = async (e) => {
    e.preventDefault();
    const email = e.target.email.value;
    const password = e.target.password.value;

    try {
      await signIn(email, password);
      Swal.fire({
        icon: "success",
        title: "Login Successful!",
        text: "Welcome back!",
      });
      navigate(from, { replace: true }); // ⭐ redirect back
    } catch (err) {
      Swal.fire({
        icon: "error",
        title: "Login Failed!",
        text: err.message,
      });
    }
  };

  return (
    <div className="w-full max-w-sm mx-auto border mb-10 p-6 mt-10 rounded-xl">
      <h2 className="text-xl font-bold mb-4 text-center">Login</h2>

      <form onSubmit={handleLogin}>
        <input
          type="email"
          name="email"
          placeholder="Email"
          className="input input-bordered w-full mb-3"
          required
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

        <button className="btn btn-primary w-full mb-3">Login</button>

        <button
          type="button"
          onClick={handleGoogleLogin}
          className="btn btn-outline w-full flex items-center gap-2 justify-center"
        >
          <FcGoogle className="text-2xl" /> Login with Google
        </button>

        <p className="text-center mt-4 text-sm">
          Don't have an account?{" "}
          <Link to="/register" className="text-blue-600 font-semibold">
            Register
          </Link>
        </p>
      </form>
    </div>
  );
}
