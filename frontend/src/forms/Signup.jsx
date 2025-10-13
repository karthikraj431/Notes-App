import React, { useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";

const Signup = () => {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault(); 
    try {
      const response = await axios.post("https://notes-app-backend-7fac.onrender.com/api/auth/register", {
        name,
        email,
        password,
      });

      if (response.data.success) {
        alert(response.data.message);
        navigate("/login");
      }
    } catch (error) {
      console.log("Axios signup error:", error);
      alert(error.response?.data?.message || "Signup failed");
    }
  };

  return (

    <div className="flex justify-center items-center h-screen bg-gray-100">
  <form onSubmit={handleSubmit} className="bg-white p-8 rounded shadow-md w-96 flex flex-col gap-4">
    <h2 className="text-2xl font-bold text-center mb-4">Sign Up</h2>
    <input type="text" placeholder="Name" value={name} onChange={(e) => setName(e.target.value)} className="p-2 border rounded"/>
    <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} className="p-2 border rounded"/>
    <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} className="p-2 border rounded"/>
    <button type="submit" className="bg-blue-600 text-white p-2 rounded hover:bg-blue-700 transition">Sign Up</button>
    <p className="text-center text-sm text-gray-500">Already a user? <Link to="/login" className="text-blue-600 hover:underline">Login</Link></p>
  </form>
</div>
  );
};

export default Signup;


