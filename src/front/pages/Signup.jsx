import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

export const Signup = () => {

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const navigate = useNavigate();
  const backendUrl = import.meta.env.VITE_BACKEND_URL;

  const handleSubmit = async (event) => {
    event.preventDefault();

    const resp = await fetch(`${backendUrl}/api/register`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: email,
        password: password,
      }),
    });

     const data = await resp.json();

    if (resp.ok) {
      navigate("/login");
    } else {
      alert(data.msg);
    }
  };

  return (
    <div className="container d-flex justify-content-center align-items-center min-vh-100">
      <div className="card shadow p-4" style={{ maxWidth: "420px", width: "100%" }}>
        <h2 className="text-center mb-4">Create account</h2>

        <form onSubmit={handleSubmit}>
          
          <div className="mb-3">
            <label className="form-label">Email</label>
            <input 
            type="email" 
            className="form-control" 
            placeholder="Enter your email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}/>
          </div>

          <div className="mb-3">
            <label className="form-label">Password</label>
            <div className="input-group">
            <input 
              type={showPassword ? "text" : "password"}
              className="form-control" 
              placeholder="Enter your password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}/>
              
              <button
                className="btn btn-outline-secondary"
                type="button"
                onClick={() => setShowPassword(!showPassword)}>
                <i className={showPassword ? "fas fa-eye-slash" : "fas fa-eye"}></i>
              </button>
            </div>
          </div>

          <button 
          type="submit" 
          className="btn btn-primary w-100">Sign up</button>
        </form>

        <p className="text-center mt-3">
         Already have an account? <a href="/login">Login</a>
        </p>

      </div>
    </div>
  );
};