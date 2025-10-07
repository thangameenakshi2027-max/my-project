import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom"; 


const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
   const navigate = useNavigate(); 

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("/api/auth/login", {
        email,
        password,
      });

      localStorage.setItem("token", res.data.token);
      alert("Login successful");
      navigate("/home");
      
    } catch (err) {
      if (err.response) {
        alert(err.response.data.message || "Login failed");
      } else if (err.request) {
        alert("No response from server. Check if backend is running.");
      } else {
        alert("Error: " + err.message);
      }
    }
  };

  return (
    <form onSubmit={handleLogin}>
      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
      />
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
      />
      <button type="submit">Login</button>
    </form>
  );
};

export default Login;
