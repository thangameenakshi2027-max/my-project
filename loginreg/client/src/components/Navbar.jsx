import {Link} from "react-router-dom";
import {AppBar ,Typography, Toolbar,Button} from "@mui/material";
const Navbar = () => {
  const button={marginRight:"20px",fontSize:"1.1rem",fontWeight:"400",padding:"0.3rem"};
  return (
    <AppBar sx={{bgcolor:'#cba181'}}>
      <Toolbar>
        <Typography variant="h4" sx={{flexGrow: 1}}>Barbie</Typography>
        <Button  style={button} color="success" variant="contained" to="/login"component={Link}>Login</Button>
        <Button  style={button} color="warning" variant="contained" to="/signup"component={Link}>Signup</Button>
        <Button  style={button} color="error"variant="contained" to="/Logout"component={Link}>Logout</Button>
      </Toolbar>
    </AppBar>
  )
}

export default Navbar;
