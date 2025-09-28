import React from "react";
import { useManualForm } from "../hooks/useManualForm"; 

export default function LoginPage() {
  const { userData, handleChange, handleSubmit } = useManualForm();

  return (
    <div style={styles.container}>
      <h2>Login</h2>
      <form onSubmit={(e) => handleSubmit(e, "http://localhost:3000/login")} style={styles.form}>
        <input
          type="email"
          name="email"
          placeholder="Email"
          value={userData.email || ""}
          onChange={handleChange}
          required
          style={styles.input}
        />
        <input
          type="password"
          name="password"
          placeholder="Password"
          value={userData.password || ""}
          onChange={handleChange}
          required
          style={styles.input}
        />
        <button type="submit" style={styles.button}>
          Login
        </button>
      </form>
    </div>
  );
}

const styles = {
  container: { 
    width: "100vw", 
    minHeight: "100vh", 
    display: "flex", 
    flexDirection: "column", 
    alignItems: "center", 
    justifyContent: "center",
    padding: "2rem",
    boxSizing: "border-box"
  },
  form: {
    display: "flex",
    flexDirection: "column",
    width: "100%",
    maxWidth: "400px"
  },
  input: { 
    margin: "0.5rem 0", 
    padding: "12px", 
    width: "100%", 
    borderRadius: "6px", 
    border: "1px solid #ccc",
    boxSizing: "border-box"
  },
  button: { 
    marginTop: "1rem", 
    padding: "12px 20px", 
    background: "#007bff", 
    color: "#fff", 
    border: "none", 
    borderRadius: "6px", 
    cursor: "pointer",
    width: "100%"
  },
};