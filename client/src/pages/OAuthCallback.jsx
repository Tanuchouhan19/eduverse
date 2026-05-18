import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { useAuth } from "../context/AuthContext";
import Loader from "../components/Loader";

/**
 * /oauth/callback
 * Backend redirects here after Google / GitHub OAuth with ?token=...
 * This page reads the token, saves it, and redirects the user home.
 */
const OAuthCallback = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { login } = useAuth();

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const token  = params.get("token");
    const error  = params.get("error");

    if (error || !token) {
      navigate("/login?error=" + (error || "oauth_failed"), { replace: true });
      return;
    }

    // Decode the JWT payload to get basic user info (no secret needed client-side)
    try {
      const payload = JSON.parse(atob(token.split(".")[1]));
      const user    = { token, _id: payload.id };

      // Store token the same way your app normally does
      localStorage.setItem("user", JSON.stringify(user));

      // Tell AuthContext & Redux about the user
      login(user);

      navigate("/auth/myprofile", { replace: true });
    } catch {
      navigate("/login?error=invalid_token", { replace: true });
    }
  }, []);

  return <Loader />;
};

export default OAuthCallback;