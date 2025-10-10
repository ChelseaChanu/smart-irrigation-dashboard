import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function AuthPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const [showPassword, setShowPassword] = useState(false); 
  const navigate = useNavigate();

  // Redirect if already logged in
  useEffect(() => {
    if (localStorage.getItem("authToken")) {
      navigate("/dashboard");
    }
  }, [navigate]);

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!email || !password || (!isLogin && !username)) {
      alert("Please fill all required fields");
      return;
    }

    const savedUsers = JSON.parse(localStorage.getItem("users") || "{}");

    if (isLogin) {
      if (!savedUsers[email] || savedUsers[email].password !== password) {
        alert("Invalid email or password");
        return;
      }
      localStorage.setItem("authToken", "user_logged_in");
      localStorage.setItem("userEmail", email);
      localStorage.setItem("username", savedUsers[email].username);
    } else {
      if (savedUsers[email]) {
        alert("User already exists with this email");
        return;
      }
      savedUsers[email] = { password, username };
      localStorage.setItem("users", JSON.stringify(savedUsers));
      localStorage.setItem("authToken", "user_logged_in");
      localStorage.setItem("userEmail", email);
      localStorage.setItem("username", username);
    }

    navigate("/dashboard");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#060C1A] p-4">
      <div className="bg-[#0E1421] p-8 rounded-2xl shadow-lg w-full max-w-sm">
        <h2 className="text-2xl font-bold mb-6 text-white text-center">
          {isLogin ? "Login" : "Sign Up"}
        </h2>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          {!isLogin && (
            <input
              type="text"
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full px-4 py-2 rounded-xl bg-[#121B2F] text-white placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#742BEC]"
            />
          )}

          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-4 py-2 rounded-xl bg-[#121B2F] text-white placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#742BEC]"
          />

          <div className="relative w-full">
            <input
              type={showPassword ? "text" : "password"} 
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2 rounded-xl bg-[#121B2F] text-white placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#742BEC]"
            />
            <img
              src={showPassword ? "assets/password-open.png" : "assets/password-open.png"}
              alt="toggle password"
              className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 cursor-pointer"
              onClick={() => setShowPassword(!showPassword)}
            />
          </div>

          <button
            type="submit"
            className="bg-[#742BEC] text-white py-2 rounded-xl hover:bg-[#5a22b5] transition-colors"
          >
            {isLogin ? "Login" : "Sign Up"}
          </button>
        </form>

        <p
          className="mt-4 text-center text-sm text-[#742BEC] cursor-pointer hover:underline"
          onClick={() => setIsLogin(!isLogin)}
        >
          {isLogin
            ? "Don't have an account? Sign Up"
            : "Already have an account? Login"}
        </p>
      </div>
    </div>
  );
}