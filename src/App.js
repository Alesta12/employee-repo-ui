import React, { useState } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useNavigate,
  useLocation,
} from "react-router-dom";
import "./App.css";

// Register Page
function Register() {
  const [formData, setFormData] = useState({
    email: "",
    name: "",
    phoneNumber: "",
  });
  const [loading, setLoading] = useState(false); // loading state
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true); // start loading
    try {
      const response = await fetch(
        "https://employee-repo.onrender.com/employee-management/register",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        }
      );
      if (response.ok) {
        navigate("/verify-otp", { state: { email: formData.email } });
      } else {
        alert("Failed to register");
      }
    } catch (error) {
      console.error(error);
      alert("Error registering");
    } finally {
      setLoading(false); // stop loading
    }
  };

  return (
    <div className="container">
      <h2>Employee Registration</h2>
      <form onSubmit={handleSubmit} className="form">
        <input
          type="text"
          name="name"
          placeholder="Full Name"
          value={formData.name}
          onChange={handleChange}
          required
        />
        <input
          type="email"
          name="email"
          placeholder="Email"
          value={formData.email}
          onChange={handleChange}
          required
        />
        <input
          type="text"
          name="phoneNumber"
          placeholder="Phone Number"
          value={formData.phoneNumber}
          onChange={handleChange}
          required
        />

        <button type="submit" disabled={loading}>
          {loading ? <span className="spinner"></span> : "Register"}
        </button>
      </form>
    </div>
  );
}

// Verify OTP Page
function VerifyOtp() {
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const email = location.state?.email || "";

  const handleVerify = async () => {
    setLoading(true);
    try {
      const response = await fetch(
        `https://employee-repo.onrender.com/employee-management/authenticate-otp?otp=${otp}&email=${email}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
        }
      );

      if (response.ok) {
        const employee = await response.json(); // parse JSON Employee object
        if (employee?.email) {
          navigate("/success", { state: employee }); // pass full employee object
        } else {
          alert("Invalid OTP");
        }
      } else {
        alert("Invalid OTP");
      }
    } catch (error) {
      console.error(error);
      alert("Error verifying OTP");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container">
      <h2>Verify OTP</h2>
      <input
        type="text"
        placeholder="Enter OTP"
        value={otp}
        onChange={(e) => setOtp(e.target.value)}
      />
      <button onClick={handleVerify} disabled={loading}>
        {loading ? <span className="spinner"></span> : "Verify"}
      </button>
    </div>
  );
}

// Success Page
function Success() {
  const location = useLocation();
  const employee = location.state; // full Employee object from backend

  return (
    <div className="container">
      <h2>Registration Successful</h2>
      <div className="details">
        <p>
          <strong>Name:</strong> {employee?.name}
        </p>
        <p>
          <strong>Email:</strong> {employee?.email}
        </p>
        <p>
          <strong>Phone Number:</strong> {employee?.phoneNumber}
        </p>
      </div>
    </div>
  );
}

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Register />} />
        <Route path="/verify-otp" element={<VerifyOtp />} />
        <Route path="/success" element={<Success />} />
      </Routes>
    </Router>
  );
}

export default App;
