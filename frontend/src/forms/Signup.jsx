import React, { useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useAuth } from "../context/ContextProvider";

const Signup = () => {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { login } = useAuth();

  const API_URL = import.meta.env.VITE_API_URL; // ✅ Correct for Vite

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const { data } = await axios.post(`${API_URL}/api/auth/register`, {
        name,
        email,
        password,
      });

      if (data.success) {
        localStorage.setItem("token", data.token);
        login(data.user);
        toast.success(data.message);
        navigate("/");
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.log("Signup error:", error);
      toast.error(error.response?.data?.message || "Signup failed");
    }
  };

  return (
    <div className="flex justify-center items-center h-screen bg-gray-100">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-8 rounded shadow-md w-96 flex flex-col gap-4"
      >
        <h2 className="text-2xl font-bold text-center mb-4">Sign Up</h2>
        <input
          type="text"
          placeholder="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="p-2 border rounded"
          required
        />
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="p-2 border rounded"
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="p-2 border rounded"
          required
        />
        <button
          type="submit"
          className="bg-blue-600 text-white p-2 rounded hover:bg-blue-700 transition"
        >
          Sign Up
        </button>
        <p className="text-center text-sm text-gray-500">
          Already a user?{" "}
          <Link to="/login" className="text-blue-600 hover:underline">
            Login
          </Link>
        </p>
      </form>
    </div>
  );
};

export default Signup;



// import React, { useState } from "react";
// import axios from "axios";
// import { Link, useNavigate } from "react-router-dom";
// import { toast } from "react-toastify";
// import { useAuth } from "../context/ContextProvider";

// const Signup = () => {
//   const navigate = useNavigate();
//   const [name, setName] = useState("");
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");
//   const { login } = useAuth();
//   const API_URL = process.env.REACT_APP_API_URL;

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     try {
//       const { data } = await axios.post(`${API_URL}/api/auth/register`, { name, email, password });

//       if (data.success) {
//         localStorage.setItem("token", data.token);
//         login(data.user);
//         toast.success(data.message);
//         navigate("/");
//       } else {
//         toast.error(data.message);
//       }
//     } catch (error) {
//       console.log("Signup error:", error);
//       toast.error(error.response?.data?.message || "Signup failed");
//     }
//   };

//   return (
//     <div className="flex justify-center items-center h-screen bg-gray-100">
//       <form onSubmit={handleSubmit} className="bg-white p-8 rounded shadow-md w-96 flex flex-col gap-4">
//         <h2 className="text-2xl font-bold text-center mb-4">Sign Up</h2>
//         <input type="text" placeholder="Name" value={name} onChange={(e) => setName(e.target.value)} className="p-2 border rounded" required />
//         <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} className="p-2 border rounded" required />
//         <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} className="p-2 border rounded" required />
//         <button type="submit" className="bg-blue-600 text-white p-2 rounded hover:bg-blue-700 transition">Sign Up</button>
//         <p className="text-center text-sm text-gray-500">
//           Already a user? <Link to="/login" className="text-blue-600 hover:underline">Login</Link>
//         </p>
//       </form>
//     </div>
//   );
// };

// export default Signup;



// import React, { useState } from "react";
// import axios from "axios";
// import { Link, useNavigate } from "react-router-dom";
// import { toast } from "react-toastify";
// import { useAuth } from "../context/ContextProvider";

// const Signup = () => {
//   const navigate = useNavigate();
//   const { login } = useAuth(); // access auth context
//   const [name, setName] = useState("");
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     try {
//       const response = await axios.post("https://notes-app-backend-7fac.onrender.com/api/auth/register",
//   { name, email, password }
// );


//       if (response.data.success) {
//         // Save token to localStorage
//         localStorage.setItem("token", response.data.token);
//         // Update auth context
//         login(response.data.user);
//         toast.success("Signup successful!");
//         navigate("/"); // redirect to home
//       }
//     } catch (error) {
//       console.log("Signup error:", error.response?.data || error.message);
//       toast.error(error.response?.data?.message || "Signup failed");
//     }
//   };

//   return (
//     <div className="flex justify-center items-center h-screen bg-gray-100">
//       <form
//         onSubmit={handleSubmit}
//         className="bg-white p-8 rounded shadow-md w-96 flex flex-col gap-4"
//       >
//         <h2 className="text-2xl font-bold text-center mb-4">Sign Up</h2>
//         <input
//           type="text"
//           placeholder="Name"
//           value={name}
//           onChange={(e) => setName(e.target.value)}
//           className="p-2 border rounded"
//           required
//         />
//         <input
//           type="email"
//           placeholder="Email"
//           value={email}
//           onChange={(e) => setEmail(e.target.value)}
//           className="p-2 border rounded"
//           required
//         />
//         <input
//           type="password"
//           placeholder="Password"
//           value={password}
//           onChange={(e) => setPassword(e.target.value)}
//           className="p-2 border rounded"
//           required
//         />
//         <button
//           type="submit"
//           className="bg-blue-600 text-white p-2 rounded hover:bg-blue-700 transition"
//         >
//           Sign Up
//         </button>
//         <p className="text-center text-sm text-gray-500">
//           Already a user?{" "}
//           <Link to="/login" className="text-blue-600 hover:underline">
//             Login
//           </Link>
//         </p>
//       </form>
//     </div>
//   );
// };

// export default Signup;




// import React, { useState } from "react";
// import axios from "axios";
// import { Link, useNavigate } from "react-router-dom";

// const Signup = () => {
//   const navigate = useNavigate();
//   const [name, setName] = useState("");
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");

//   const handleSubmit = async (e) => {
//     e.preventDefault(); 
//     try {
//       const response = await axios.post("https://notes-app-backend-7fac.onrender.com/api/auth/register", {
//         name,
//         email,
//         password,
//       });

//       if (response.data.success) {
//         alert(response.data.message);
//         navigate("/login");
//       }
//     } catch (error) {
//       console.log("Axios signup error:", error);
//       alert(error.response?.data?.message || "Signup failed");
//     }
//   };

//   return (

//     <div className="flex justify-center items-center h-screen bg-gray-100">
//   <form onSubmit={handleSubmit} className="bg-white p-8 rounded shadow-md w-96 flex flex-col gap-4">
//     <h2 className="text-2xl font-bold text-center mb-4">Sign Up</h2>
//     <input type="text" placeholder="Name" value={name} onChange={(e) => setName(e.target.value)} className="p-2 border rounded"/>
//     <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} className="p-2 border rounded"/>
//     <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} className="p-2 border rounded"/>
//     <button type="submit" className="bg-blue-600 text-white p-2 rounded hover:bg-blue-700 transition">Sign Up</button>
//     <p className="text-center text-sm text-gray-500">Already a user? <Link to="/login" className="text-blue-600 hover:underline">Login</Link></p>
//   </form>
// </div>
//   );
// };

// export default Signup;


