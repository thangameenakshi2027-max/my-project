import { Button } from "@mui/material";
import { useNavigate } from "react-router-dom";

const Header = () => {
  const navigate = useNavigate();

  const headerStyle = {
    background: "linear-gradient(90deg, #f2c7b3, #f7a8b8)",
    color: "#3d2b2b",
    padding: "25px 50px",
    width:1300,
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    fontWeight: "bold",
    fontSize: "1.6rem",
    boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
     position:"static"
  };

  const buttonStyle = {
    borderRadius: "20px",
    marginLeft: "10px",
    fontWeight: "600",
    padding: "6px 18px",
    
  };  
  

  return (
    <div style={headerStyle}>
      <div>Barbie</div>
      <div>
        <Button
          variant="contained"
          color="success"
          style={buttonStyle}
          onClick={() => navigate("/login")}
        >
          LOGIN
        </Button>
        <Button
          variant="contained"
          color="warning"
          style={buttonStyle}
          onClick={() => navigate("/signup")}
        >
          SIGNUP
        </Button>
      </div>
    </div>
  );
};

export default Header;
