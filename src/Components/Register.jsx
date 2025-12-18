import { useState, useContext } from "react";
import { Authcontext } from "../Context/Authcontext";
import { FiEye, FiEyeOff } from "react-icons/fi";
import { Link, useNavigate } from "react-router";
import Swal from "sweetalert2";
import UseAxious from "../Hooks/UseAxious";
const axiosSecure = UseAxious();

export default function Register() {
  const [showPass, setShowPass] = useState(false);
  const navigate = useNavigate();
  const { register } = useContext(Authcontext); 

 
  const handleRegister = async (e) => {
    e.preventDefault();

    const name = e.target.name.value;
    const email = e.target.email.value;
    const password = e.target.password.value;
    const imageFile = e.target.image.files[0];

 
    const passRegex = /^(?=.*[A-Z])(?=.*\d).{6,}$/;
    if (!passRegex.test(password)) {
      return Swal.fire({
        icon: "warning",
        title: "Weak Password",
        text: "Password must be 6+ chars with 1 uppercase & 1 number",
      });
    }

    try {
     
      const userCredential = await register(email, password, name, imageFile);
      const user = userCredential.user;

     
      const photoURL = imageFile ? URL.createObjectURL(imageFile) : "";

      await axiosSecure.post("/users", {
        name,
        email,
        role: "user",
        photoURL,
      });

   
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
        title: "Registration Failed",
        text: err.response?.data?.message || err.message,
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
          type="file"
          name="image"
          accept="image/*"
          className="file-input file-input-bordered w-full mb-3"
        />

     
        <input
          type="email"
          name="email"
          placeholder="Email"
          className="input input-bordered w-full mb-3"
          required
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
