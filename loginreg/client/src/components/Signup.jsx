import { Grid, Paper, TextField, Typography, Button } from "@mui/material";
import axios from "axios";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

const Signup = () => {
  const heading = { fontSize: "2.5rem", fontWeight: "600" };
  const row = { display: "flex", marginTop: "2rem" };
  const btnStyle = { 
    marginTop: "1rem", 
    fontSize: "1.2rem", 
    fontWeight: "400", 
    backgroundColor: "black", 
    color: "white" 
  };

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  

  const handleSignup = (e) => {
  e.preventDefault();

  axios.post("http://localhost:3001//api/auth/signup", { name, email, password })
    .then((result) => {
      console.log("Response from server:", result);
      if (result.status === 200 || result.status === 201) {
        console.log("User created successfully");
        navigate("/login");
      }
    })
    .catch((err) => {
      if (err.response && err.response.status === 400) {
        window.alert("Email already exists. Please use a different email");
      } else {
        console.error("Signup error:", err);
      }
    });
};


  return (
    <Grid
      container
      justifyContent="center"
      alignItems="center"
      style={{ minHeight: "100vh" }}
    >
      <Paper
        sx={{
          width: {
            xs: "80vw",
            sm: "50vw",
            md: "40vw",
            lg: "30vw",
            xl: "20vw",
          },
          height: "60vh",
          padding: "20px",
        }}
        elevation={3}
      >
        <Typography style={heading}>Signup</Typography>
        <form onSubmit={handleSignup}>
          <TextField 
            onChange={(e) => setName(e.target.value)} 
            name="name" 
            required 
            style={row} 
            label="Enter Name" 
          />
          <TextField 
            onChange={(e) => setEmail(e.target.value)} 
            name="email" 
            type="email"
            required 
            style={row} 
            label="Enter Email" 
          />
          <TextField 
            onChange={(e) => setPassword(e.target.value)} 
            name="password" 
            type="password" 
            required 
            style={row} 
            label="Enter Password" 
          />
          <Button type="submit" variant="contained" style={btnStyle}>
            Signup
          </Button>
        </form>
      </Paper>
    </Grid>
  );
};

export default Signup;

