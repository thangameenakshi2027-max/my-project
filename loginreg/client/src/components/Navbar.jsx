import { useEffect, useState } from "react";
import { Button } from "@mui/material";
import { useLocation, useNavigate } from "react-router-dom";

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [username, setUsername] = useState("");

  useEffect(() => {
    const storedUser = localStorage.getItem("username");
    if (storedUser) {
      setUsername(storedUser);
    }
  }, []);

 
  if (location.pathname === "/login" || location.pathname === "/signup") {
    return null;
  }

  const headerStyle = {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "12px 40px",
    background: "linear-gradient(to right, #f8b7b7, #fcd5ce)",
    boxShadow: "0px 4px 10px rgba(0,0,0,0.1)",
    borderRadius: "0 0 10px 10px",
    width: "100%",
    position: "fixed",
    top: 0,
    left: 0,
    zIndex: 2000,
    boxSizing: "border-box",
  };

  const buttonStyle = {
    marginLeft: "12px",
    borderRadius: "20px",
    fontWeight: "bold",
  };

  return (
    <div style={headerStyle}>
     
      <div style={{ fontWeight: "bold", fontSize: "22px" }}>
        {username || "Bochan"}
      </div>

     
      {location.pathname === "/" && !username && (
        <div
          style={{
            position: "absolute",
            left: "50%",
            transform: "translateX(-50%)",
            fontWeight: "bold",
            fontSize: "18px",
            color: "#7b1fa2",
          }}
        >
          Welcome to the Page 💖
        </div>
      )}

     
      <div style={{ display: "flex", alignItems: "center" }}>
       
        {location.pathname === "/" && !username && (
          <>
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
          </>
        )}

       
        {location.pathname === "/add-form" && (
          <Button
            variant="contained"
            color="secondary"
            style={{
              ...buttonStyle,
              marginRight: "10px",
              position: "relative",
              right: 0,
            }}
            onClick={() => navigate(-1)}
          >
            BACK
          </Button>
        )}
      </div>
    </div>
  );
};

export default Navbar;
