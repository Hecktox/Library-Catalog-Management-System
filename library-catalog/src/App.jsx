import { useState, useEffect } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Login from "./components/Login";
import SignUp from "./components/SignUp";
import Catalog from "./components/Catalog";
import Dashboard from "./components/Dashboard";
import Employees from "./components/Employees";
import Checkout from "./components/Checkout";
import "./App.css";
import axios from "axios";

function App() {
  const [user, setUser] = useState(null);
  const [message, setMessage] = useState("");

  const testConnection = async () => {
    try {
      const response = await axios.get("http://localhost:8080/api/test");
      setMessage(response.data.message);
    } catch (error) {
      console.error("Connection test failed:", error);
      setMessage("Error connecting to backend");
    }
  };

  useEffect(() => {
    testConnection();
  }, []);

  return (
    <Router>
      <div className="App">
        <h1>Library Catalog Management System</h1>
        {message && <p>{message}</p>}
        <Routes>
          <Route
            path="/"
            element={
              user ? <Dashboard user={user} /> : <Login setUser={setUser} />
            }
          />
          <Route path="/signup" element={<SignUp setUser={setUser} />} /> {}
          <Route path="/catalog" element={<Catalog />} />
          <Route path="/employees" element={<Employees />} />
          <Route path="/checkout" element={<Checkout />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
