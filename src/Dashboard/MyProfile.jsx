import React, { useContext, useState, useEffect } from "react";
import { Authcontext } from "../Context/Authcontext";
import { updateProfile } from "firebase/auth";
import { auth } from "../Firebase/Firebase.init";
import Swal from "sweetalert2";

const Profile = () => {
  const { user } = useContext(Authcontext);
  const [name, setName] = useState("");
  const [photoFile, setPhotoFile] = useState(null);
  const [photoPreview, setPhotoPreview] = useState("");

  useEffect(() => {
    if (user) {
      setName(user.displayName || "");
      setPhotoPreview(user.photoURL || "");
    }
  }, [user]);

  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    setPhotoFile(file);
    if (file) {
      setPhotoPreview(URL.createObjectURL(file));
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      let photoURL = photoPreview;
      if (photoFile) {
        
        photoURL = URL.createObjectURL(photoFile);
      }

      await updateProfile(auth.currentUser, {
        displayName: name,
        photoURL: photoURL,
      });

      Swal.fire({
        icon: "success",
        title: "Profile Updated!",
        text: "Your name and photo have been updated.",
      });

      window.location.reload();

    } catch (err) {
      Swal.fire({
        icon: "error",
        title: "Update Failed!",
        text: err.message,
      });
    }
  };

  return (
    <div className="max-w-md text-black mx-auto border p-6 mt-10 rounded-xl shadow">
      <h2 className="text-2xl font-bold mb-4 text-center">My Profile</h2>

      <form onSubmit={handleUpdate} className="flex flex-col gap-4">
        <div className="flex  flex-col items-center">
          <img
            src={photoPreview || "https://i.ibb.co/4pDNDk1/avatar.png"}
            alt="profile"
            className="w-24 h-24 rounded-full border mb-2 object-cover"
          />
          <input type="file" onChange={handlePhotoChange} className="file-input bg-white file-input-bordered w-full" />
        </div>

        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Full Name"
          className="input bg-white input-bordered w-full"
          required
        />

        <button className="btn btn-primary w-full">Update Profile</button>
      </form>

      <div className="mt-6 text-center">
        <p><strong>Email:</strong> {user?.email}</p>
      </div>
    </div>
  );
};

export default Profile;
