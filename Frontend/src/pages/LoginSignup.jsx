import React from "react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function LoginSignup() {
  const [signState, setSignState] = React.useState("Sign In");
  const [name, setName] = React.useState("");
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const navigate = useNavigate();
  const { login } = useAuth();

  const toggleSignState = () => {
    setSignState((currentState) => {
      const newState = currentState === "Sign In" ? "Sign Up" : "Sign In";
      setName("");
      setEmail("");
      setPassword("");
      return newState;
    });
  };

  const clearForm = () => {
    setName("");
    setEmail("");
    setPassword("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const url =
      signState === "Sign Up"
        ? "http://localhost:5000/api/auth/register"
        : "http://localhost:5000/api/auth/login";

    const payload =
      signState === "Sign Up"
        ? {
            name: name.trim(),
            username: name.trim(),
            email: email.trim(),
            password,
          }
        : { email: email.trim(), password };

    try {
      const res = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(payload),
      });

      let data = null;
      try {
        data = await res.json();
      } catch (e) {
        data = null;
      }

      if (!res.ok) {
        toast.error(data?.message || `Request failed (${res.status})`);
        return;
      }

      console.log("Authenticated user:", data.user);

      // ✅ If Sign Up → Clear form + Success Toast
      if (signState === "Sign Up") {
        toast.success("Account created successfully 🎉");
        clearForm();
        login(data.user);
        navigate("/");
      } else {
        toast.success("Login successful 🎉");
        login(data.user);
        navigate("/");
      }
    } catch (err) {
      toast.error("Server error. Please try again.");
    }
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center">
      <h3 className="mb-5">{signState}</h3>

      <form onSubmit={handleSubmit} className="flex w-80 flex-col space-y-6">
        <div className="tablet:space-y-4 font-poppinsRegular flex flex-col space-y-3">
          {signState === "Sign Up" && (
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              type="text"
              placeholder="Your Name"
              required
              className="laptop:text-base rounded-sm border-2 p-2 text-sm outline-none"
            />
          )}

          <input
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            type="email"
            placeholder="Email"
            required
            className="laptop:text-base rounded-sm border-2 p-2 text-sm outline-none"
          />

          <input
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            type="password"
            placeholder="Password"
            required
            className="laptop:text-base rounded-sm border-2 p-2 text-sm outline-none"
          />
        </div>

        <button
          type="submit"
          className="laptop:py-3 rounded-sm bg-blue-600 py-2 hover:bg-blue-700"
        >
          <p className="laptop:text-base text-sm text-white">{signState}</p>
        </button>

        <div className="laptop:text-sm text-xs">
          {signState === "Sign In" ? (
            <p>
              New to Bislig iCenter?{" "}
              <span
                onClick={toggleSignState}
                className="cursor-pointer text-blue-600 underline"
              >
                Sign Up
              </span>
            </p>
          ) : (
            <p>
              Already have an Account?{" "}
              <span
                onClick={toggleSignState}
                className="cursor-pointer text-blue-600 underline"
              >
                Sign In
              </span>
            </p>
          )}
        </div>
      </form>
    </div>
  );
}

export default LoginSignup;
