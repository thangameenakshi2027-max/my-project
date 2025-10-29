import { Grid, Paper, TextField, Typography, Button, Box, Link as MuiLink } from "@mui/material";
import { styled } from '@mui/material/styles';
import axios from "axios";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

// Custom styled components for Barbie theme
const BarbiePaper = styled(Paper)(({ theme }) => ({
  background: 'linear-gradient(135deg, #FFC0CB, #FF69B4)', // Pink gradient
  padding: '40px',
  borderRadius: '20px',
  boxShadow: '0px 10px 30px rgba(255, 105, 180, 0.4)', // Pink shadow
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
  '&::before': { // Subtle glitter effect
    content: '""',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: 'url("data:image/svg+xml,%3Csvg width=\'10\' height=\'10\' viewBox=\'0 0 10 10\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cg fill=\'%23FFFFFF\' fill-opacity=\'0.2\' fill-rule=\'evenodd\'%3E%3Ccircle cx=\'1\' cy=\'1\' r=\'1\'/%3E%3C/g%3E%3C/svg%3E")',
    opacity: 0.3,
    pointerEvents: 'none',
  },
}));

const BarbieHeading = styled(Typography)(({ theme }) => ({
  fontFamily: "'Lobster', cursive", // A playful, script-like font
  fontSize: '3.5rem',
  color: '#FFFFFF',
  textShadow: '3px 3px 6px rgba(0,0,0,0.3)',
  marginBottom: '10px',
  letterSpacing: '2px',
}));

const BarbieSubheading = styled(Typography)(({ theme }) => ({
  fontFamily: "'Comic Sans MS', cursive", // Another playful option or 'Arial', sans-serif
  fontSize: '1.2rem',
  color: '#FFFFFF',
  marginBottom: '30px',
  fontStyle: 'italic',
}));

const BarbieTextField = styled(TextField)(({ theme }) => ({
  '& .MuiOutlinedInput-root': {
    borderRadius: '10px',
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    '& fieldset': {
      borderColor: '#FF69B4', // Pink border
    },
    '&:hover fieldset': {
      borderColor: '#FF1493', // Darker pink on hover
    },
    '&.Mui-focused fieldset': {
      borderColor: '#FF1493', // Darker pink on focus
      borderWidth: '2px',
    },
  },
  '& .MuiInputBase-input': {
    color: '#333',
    padding: '12px 15px',
  },
  '& .MuiInputLabel-root': {
    color: '#FF69B4', // Pink label
    '&.Mui-focused': {
      color: '#FF1493', // Darker pink label on focus
    },
  },
  marginBottom: '20px',
}));

const BarbieButton = styled(Button)(({ theme }) => ({
  background: 'linear-gradient(45deg, #FF1493 30%, #FF69B4 90%)', // Darker pink button gradient
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
    background: 'linear-gradient(45deg, #FF69B4 30%, #FF1493 90%)', // Reverse gradient on hover
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
  const navigate = useNavigate();

  const handleSignup = (e) => {
    e.preventDefault();

    axios.post("http://localhost:3001/api/auth/signup", { name, email, password })
      .then((result) => {
        console.log("Response from server:", result);
        if (result.status === 200 || result.status === 201) {
          window.alert("Signup successful! Welcome to the Dream World!");
          navigate("/login");
        }
      })
      .catch((err) => {
        if (err.response && err.response.status === 400 && err.response.data.message === "Email already exists") {
          // Assuming your server sends a specific message for existing email
          window.alert("Email already exists. Please try logging in or use a different email.");
        } else {
          console.error("Signup error:", err);
          window.alert("An error occurred during signup. Please try again later.");
        }
      });
  };

  return (
    <BackgroundGrid container>
      <BarbiePaper elevation={10}> {/* Increased elevation for more pop */}
        <BarbieHeading>SIGN UP!</BarbieHeading>
        <BarbieSubheading>Welcome to the Dream World!</BarbieSubheading>

        <form onSubmit={handleSignup} style={{ width: '100%' }}>
          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <BarbieTextField
              onChange={(e) => setName(e.target.value)}
              name="name"
              required
              fullWidth
              label="Dreamer Name"
              variant="outlined"
            />
            <BarbieTextField
              onChange={(e) => setEmail(e.target.value)}
              name="email"
              type="email"
              required
              fullWidth
              label="Dream Email"
              variant="outlined"
            />
            <BarbieTextField
              onChange={(e) => setPassword(e.target.value)}
              name="password"
              type="password"
              required
              fullWidth
              label="Secret Password"
              variant="outlined"
            />
            <BarbieButton type="submit" variant="contained" fullWidth>
              Join the Dream!
            </BarbieButton>
          </Box>
        </form>
        <Typography sx={{ mt: 3, color: 'white', fontSize: '0.9rem' }}>
            Already have an account? {' '}
            <MuiLink href="/login" sx={{ color: '#FFD700', fontWeight: 'bold', textDecoration: 'none', '&:hover': { textDecoration: 'underline' } }}>
                Login
            </MuiLink>
        </Typography>
      </BarbiePaper>
    </BackgroundGrid>
  );
};

export default Signup;