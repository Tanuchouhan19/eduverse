import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { useAuth } from "../context/AuthContext";
import Loader from "../components/Loader";
import { loginSuccess } from "../features/auth/authSlice";

const decodeJwtPayload = (token) => {
  const payload = token.split(".")[1];
  if (!payload) throw new Error("Missing JWT payload");

  const base64 = payload.replace(/-/g, "+").replace(/_/g, "/");
  const padded = base64.padEnd(base64.length + ((4 - (base64.length % 4)) % 4), "=");

  return JSON.parse(atob(padded));
};

const OAuthCallback = () => {
  const navigate  = useNavigate();
  const dispatch  = useDispatch();
  const { login } = useAuth();

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const token  = params.get("token");
    const error  = params.get("error");

    if (error || !token) {
      navigate("/login?error=" + (error || "oauth_failed"), { replace: true });
      return;
    }

    try {
      const payload = decodeJwtPayload(token);

      const user = {
        token,
        _id:      payload.id,
        name:     payload.name || payload.displayName || "",
        email:    payload.email || "",
        phone:    payload.phone || "",
        avatar:   payload.avatar || "",
        provider: payload.provider || "",
        isAdmin:  Boolean(payload.isAdmin),
        isActive: payload.isActive !== false,
      };

      localStorage.setItem("user", JSON.stringify(user));
      login(user);
      dispatch(loginSuccess(user));

      navigate("/auth/myprofile", { replace: true });
    } catch (err) {
      console.error("OAuth callback error:", err);
      navigate("/login?error=invalid_token", { replace: true });
    }
  }, [dispatch, login, navigate]);

  return <Loader />;
};

export default OAuthCallback;
