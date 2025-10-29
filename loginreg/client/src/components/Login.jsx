import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom"; 
import { Grid, Paper, TextField, Typography, Button } from "@mui/material";

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

  const paperStyle = {
    padding: 30,
    height: "auto",
    width: 350,
    margin: "100px auto",
    borderRadius: 15,
    backgroundColor: "#fff",
    boxShadow: "0px 4px 15px rgba(0,0,0,0.1)", 
  };

  const btnStyle = {
    margin: "20px 0",
    padding: "10px",
    fontWeight: "bold",
    fontSize: "16px",
  };

  return (
    <Grid
      container
      justifyContent="center"
      alignItems="center"
      sx={{
        minHeight: "100vh",
        backgroundColor: "#d95c78", 
      }}
    >
      <Paper elevation={3} style={paperStyle}>
        <Grid align="center">
          <Typography
            variant="h4"
            gutterBottom
            sx={{ fontWeight: "bold", color: "#e91e63" }}
          >
            Welcome Back 👋
          </Typography>
          <Typography variant="subtitle1" color="textSecondary">
            Please login to continue
          </Typography>
        </Grid>

        <form onSubmit={handleLogin} style={{ marginTop: "30px" }}>
          <TextField
            label="Email"
            placeholder="Enter your email"
            type="email"
            fullWidth
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            margin="normal"
          />
          <TextField
            label="Password"
            placeholder="Enter your password"
            type="password"
            fullWidth
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            margin="normal"
          />

          <Button
            type="submit"
            color="primary"
            variant="contained"
            fullWidth
            style={btnStyle}
          >
            LOGIN
          </Button>

          <Typography align="center" sx={{ mt: 2 }}>
            Don’t have an account?{" "}
            <Button
              color="secondary"
              onClick={() => navigate("/signup")}
              sx={{ textTransform: "none" }}
            >
              SIGN UP
            </Button>
          </Typography>
        </form>
      </Paper>
    </Grid>
  );
};

export default Login;
