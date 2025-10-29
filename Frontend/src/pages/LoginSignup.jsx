import React from "react";

function LoginSignup() {
  const [signState, setSignState] = React.useState("Sign In");
  const [name, setName] = React.useState("");
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");

  const toggleSignState = () => {
    setSignState((currentState) => {
      const newState = currentState === "Sign In" ? "Sign Up" : "Sign In";
      if (newState === "Sign Up") {
        setName("");
        setEmail("");
        setPassword("");
      }
      return newState;
    });
    setError(false);
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center">
      <h3 className="mb-5">{signState}</h3>
      <form className="flex w-80 flex-col space-y-6">
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

        <div className="flex justify-between">
          <div className="flex items-center space-x-1">
            <input
              type="checkbox"
              className="laptop:size-4 size-3 cursor-pointer checked:border-none checked:text-black focus:ring-transparent"
            />
            <label className="laptop:text-sm text-xs" htmlFor="">
              Remember Me
            </label>
          </div>
          <p className="laptop:text-sm cursor-pointer text-xs">Need Help?</p>
        </div>

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
