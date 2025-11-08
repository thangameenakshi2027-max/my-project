import { Grid, Paper, TextField, Typography, Button, Box, Link as MuiLink } from "@mui/material";
import { styled } from '@mui/material/styles';
import axios from "axios";
import { useState } from "react";
import { useNavigate } from "react-router-dom";



const BarbiePaper = styled(Paper)(({ theme }) => ({
  background: 'linear-gradient(135deg, #FFC0CB, #FF69B4)',
  padding: '40px',
  borderRadius: '20px',
  boxShadow: '0px 10px 30px rgba(255, 105, 180, 0.4)',
  textAlign: 'center',
  maxWidth: '450px',
  width: '90%',
  minHeight: '500px',
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  alignItems: 'center',
  position: 'relative',
  overflow: 'hidden',
}));

const BarbieHeading = styled(Typography)(() => ({
  fontFamily: "'Lobster', cursive",
  fontSize: '3.5rem',
  color: '#FFFFFF',
  textShadow: '3px 3px 6px rgba(0,0,0,0.3)',
  marginBottom: '10px',
  letterSpacing: '2px',
}));

const BarbieSubheading = styled(Typography)(() => ({
  fontFamily: "'Comic Sans MS', cursive",
  fontSize: '1.2rem',
  color: '#FFFFFF',
  marginBottom: '30px',
  fontStyle: 'italic',
}));

const BarbieTextField = styled(TextField)(() => ({
  '& .MuiOutlinedInput-root': {
    borderRadius: '10px',
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    '& fieldset': { borderColor: '#FF69B4' },
    '&:hover fieldset': { borderColor: '#FF1493' },
    '&.Mui-focused fieldset': {
      borderColor: '#FF1493',
      borderWidth: '2px',
    },
  },
  '& .MuiInputBase-input': {
    color: '#333',
    padding: '12px 15px',
  },
  '& .MuiInputLabel-root': {
    color: '#FF69B4',
    '&.Mui-focused': { color: '#FF1493' },
  },
  marginBottom: '20px',
}));

const BarbieButton = styled(Button)(() => ({
  background: 'linear-gradient(45deg, #FF1493 30%, #FF69B4 90%)',
  color: 'white',
  fontWeight: 'bold',
  padding: '12px 30px',
  borderRadius: '10px',
  marginTop: '20px',
  boxShadow: '0 5px 15px rgba(255, 20, 147, 0.4)',
  transition: 'transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out',
  '&:hover': {
    transform: 'scale(1.03)',
    boxShadow: '0 8px 20px rgba(255, 20, 147, 0.6)',
    background: 'linear-gradient(45deg, #FF69B4 30%, #FF1493 90%)',
  },
  fontSize: '1.2rem',
  letterSpacing: '1px',
}));

const BackgroundGrid = styled(Grid)({
  minHeight: "100vh",
  backgroundPosition: 'center',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
});



const Signup = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [qrCode, setQrCode] = useState("");
  const navigate = useNavigate();

  const handleSignup = async (e) => {
    e.preventDefault();

    try {
      const res = await axios.post("http://localhost:3001/api/auth/signup", {
        name,
        email,
        password,
      });

      console.log("Response from server:", res.data);

     
      if (res.data && res.data.qrCode) {
        alert("Signup successful! 🎉 Your QR code will appear below.");
        setQrCode(res.data.qrCode); 
        
        
        setTimeout(() => navigate("/login"), 60000);
      } else {
        
         alert("Signup successful, but QR code was not received. Please contact support.");
         
         setTimeout(() => navigate("/login"), 60000);
      }

    } catch (err) {
      console.error("Signup error:", err);
      if (err.response) {
        
        alert(err.response.data.message || "An unexpected error occurred during signup.");
      } else {
        alert("Could not connect to server. Check if the backend is running at http://localhost:3001.");
      }
    }
  };

  return (
    <BackgroundGrid container>
      <BarbiePaper elevation={10}>
        <BarbieHeading>SIGN UP!</BarbieHeading>
        <BarbieSubheading>Welcome to the page!</BarbieSubheading>

        <form onSubmit={handleSignup} style={{ width: '100%' }}>
          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <BarbieTextField
              onChange={(e) => setName(e.target.value)}
              name="name"
              required
              fullWidth
              label="Name"
              variant="outlined"
              value={name}
            />
            <BarbieTextField
              onChange={(e) => setEmail(e.target.value)}
              name="email"
              type="email"
              required
              fullWidth
              label="Email"
              variant="outlined"
              value={email}
            />
            <BarbieTextField
              onChange={(e) => setPassword(e.target.value)}
              name="password"
              type="password"
              required
              fullWidth
              label="Secret Password"
              variant="outlined"
              value={password}
            />
            <BarbieButton type="submit" variant="contained" fullWidth>
              Signup!
            </BarbieButton>
          </Box>
        </form>

        
        {qrCode && (
          <div style={{ marginTop: "30px", textAlign: "center" }}>
            <Typography variant="h6" color="white">
              Your QR Code
            </Typography>
            <img
              src={qrCode}
              alt="User QR"
              width="200"
              style={{ borderRadius: "10px", marginTop: "10px" }}
            />
            <Typography variant="body2" color="white" sx={{ mt: 1 }}>
              Scan this to view your details
            </Typography>
          </div>
        )}

        <Typography sx={{ mt: 3, color: 'white', fontSize: '0.9rem' }}>
          Already have an account?{" "}
          <MuiLink
            href="/login"
            sx={{
              color: '#FFD700',
              fontWeight: 'bold',
              textDecoration: 'none',
              '&:hover': { textDecoration: 'underline' },
            }}
          >
            Login
          </MuiLink>
        </Typography>
      </BarbiePaper>
    </BackgroundGrid>
  );
};

export default Signup;