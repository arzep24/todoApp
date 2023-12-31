import { useState } from "react";
import {useCookies} from "react-cookie";

function Auth() {
  const [cookies, setCookie, removeCookie] = useCookies(null);
  const [isLogIn, setIsLogIn] = useState(true);
  const [email,setEmail] = useState(null);
  const [password, setPassword] = useState(null);
  const [confirmPassword, setConfirmPassword] = useState(null);
  const [error, setError] = useState(null);

  const viewLogin = (status) => {
    setError(null);
    setIsLogIn(status);
  }
  const handleSubmit = async (e, endpoint) => 
  {
    
    e.preventDefault();
    try {
    if  (!isLogIn && password !== confirmPassword)
    {
      setError("Make sure passwords match!");
      return;
    }else if(email  && password ){
      setError(null);
      const response = await fetch(`${import.meta.env.VITE_REACT_APP_SERVERURL}/${endpoint}`, {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({email, password})
      });
      const data = await response.json();
      console.log(data.detail);
      if(data.detail){
        setError(data.detail);
        return;
      } else {
        setCookie('Email',data.email);
        setCookie('AuthToken', data.token);
        window.location.reload();
      }
    }else {
      console.log("Ingresa algo!");
      setError("Make sure that email and password are valid!");
      return;
    }
    }catch(err) {
      console.error(err);
    }
  } 
  return (
      <div className="auth-container">
        <div className="auth-container-box">
          <form action="">
            <h2>{isLogIn? "Please Log In": "Please Sign Up"}</h2>
            <input 
              type="email" 
              placeholder="email@something.com" 
              onChange={(e) => setEmail(e.target.value)}/>
            <input 
              type="password" 
              placeholder="Password" 
              onChange={(e) => setPassword(e.target.value)}/>
            {!isLogIn && <input 
              type="password" 
              placeholder="Confirm Password"
              onChange={(e) => setConfirmPassword(e.target.value)}/>}
            <input 
              type="submit" 
              className="create" 
              value={isLogIn?"Log In":"Sign Up"} 
              onClick={(e) => handleSubmit(e, isLogIn? 'login':'signup')}/>
            {error && <p>{error}</p>}
          </form>
          <div className="auth-options">
            <button 
              onClick={() => viewLogin(false)}
              style={{backgroundColor: isLogIn? 'rgb(255,255,255)':'rgb(188,188,188)'}}
            >Sign Up</button>
            <button 
              onClick={() => viewLogin(true)}
              style={{backgroundColor: !isLogIn? 'rgb(255,255,255)':'rgb(188,188,188)'}}
              >Log In</button>
          </div>
        </div>
      </div>
    );
  }
  
  export default Auth;
