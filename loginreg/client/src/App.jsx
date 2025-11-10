import { useState } from 'react'
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Login from './components/Login.jsx';
import Signup from './components/Signup.jsx';
import Home from './components/Home.jsx';
import Navbar from './components/Navbar.jsx';
import Dashboard from './components/Dashboard.jsx';
import CrudFormPage from "./components/CrudFormPage";



function App() {
  const [isLoggedIn, setIsLoggedIn]=useState(false);
  const [count, setCount] = useState(0);

  return (
    
      <BrowserRouter>
      <div></div>
       <Navbar isLoggedIn={isLoggedIn}
        onLogin={()  => setIsLoggedIn(true)}
        onLogout={() => setIsLoggedIn(false)
    
        
        }></Navbar>
        <Routes>
          <Route path="/login" element={<Login />}/>
          <Route path="/signup" element={<Signup />}/>
          <Route path="/home" element={<Home/>}/>
           <Route path="/dashboard" element={<Dashboard/>}/>
          
           
        </Routes>
      </BrowserRouter>
    
  );
}

export default App;
