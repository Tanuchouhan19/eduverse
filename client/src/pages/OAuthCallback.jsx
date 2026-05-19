import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { useAuth } from "../context/AuthContext";
import Loader from "../components/Loader";
import { loginSuccess } from "../features/auth/authSlice";

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
      const payload = JSON.parse(atob(token.split(".")[1]));

      const user = {
        token,
        _id:   payload.id,
        name:  payload.name  || payload.displayName || "",
        email: payload.email || "",
      };

      localStorage.setItem("user", JSON.stringify(user));
      login(user);
      dispatch(loginSuccess(user));

      navigate("/auth/myprofile", { replace: true });
    } catch {
      navigate("/login?error=invalid_token", { replace: true });
    }
  }, []);

  return <Loader />;
};

export default OAuthCallback;