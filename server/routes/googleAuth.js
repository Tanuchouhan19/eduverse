const express = require("express");
const axios   = require("axios");
const jwt     = require("jsonwebtoken");
const User    = require("../models/userModel");

const router = express.Router();

const GOOGLE_CLIENT_ID     = process.env.GOOGLE_CLIENT_ID;
const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET;
const JWT_SECRET           = process.env.JWT_SECRET;
const FRONTEND_URL         = process.env.FRONTEND_URL || process.env.CLIENT_URL || "http://localhost:5173";
const BACKEND_URL          = process.env.BACKEND_URL  || "http://localhost:8080";

const getCallbackUrl = () => `${BACKEND_URL.replace(/\/$/, "")}/auth/google/callback`;

const redirectWithError = (res, error, reason) => {
  const params = new URLSearchParams({ error });
  if (reason) params.set("reason", reason);

  res.redirect(`${FRONTEND_URL.replace(/\/$/, "")}/login?${params.toString()}`);
};

const getOAuthFailureReason = (err) => {
  if (err.response?.data?.error) return err.response.data.error;
  if (err.code === 11000) {
    const field = Object.keys(err.keyPattern || err.keyValue || {})[0];
    return field ? `duplicate_${field}` : "duplicate_user_field";
  }
  if (err.name === "ValidationError") return "user_validation_failed";
  if (err.message?.includes("secretOrPrivateKey")) return "jwt_secret_missing";
  return "server_error";
};

const getOAuthPhonePlaceholder = (provider, id, email) => {
  const identity = id || email;
  return `${provider}:${identity}`;
};

const getTokenPayload = (user) => ({
  id:       user._id,
  name:     user.name,
  email:    user.email,
  phone:    user.phone,
  avatar:   user.avatar,
  provider: user.provider,
  isAdmin:  user.isAdmin,
  isActive: user.isActive,
});

/* Step 1: Redirect user to Google */
router.get("/auth/google", (req, res) => {
  if (!GOOGLE_CLIENT_ID || !GOOGLE_CLIENT_SECRET) {
    console.error("Google OAuth config missing: GOOGLE_CLIENT_ID / GOOGLE_CLIENT_SECRET");
    return redirectWithError(res, "google_config_missing");
  }

  const params = new URLSearchParams({
    client_id:     GOOGLE_CLIENT_ID,
    redirect_uri:  getCallbackUrl(),
    response_type: "code",
    scope:         "openid email profile",
    access_type:   "offline",
    prompt:        "select_account",
  });
  res.redirect(`https://accounts.google.com/o/oauth2/v2/auth?${params}`);
});

/* Step 2: Google calls back with ?code */
router.get("/auth/google/callback", async (req, res) => {
  const { code } = req.query;
  if (!code) return redirectWithError(res, "google_denied");
  if (!JWT_SECRET) return redirectWithError(res, "google_failed", "jwt_secret_missing");

  try {
    const tokenPayload = new URLSearchParams({
      code,
      client_id:     GOOGLE_CLIENT_ID,
      client_secret: GOOGLE_CLIENT_SECRET,
      redirect_uri:  getCallbackUrl(),
      grant_type:    "authorization_code",
    });

    const tokenRes = await axios.post("https://oauth2.googleapis.com/token", tokenPayload, {
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
    });
    const { access_token } = tokenRes.data;

    const profileRes = await axios.get("https://www.googleapis.com/oauth2/v2/userinfo", {
      headers: { Authorization: `Bearer ${access_token}` },
    });
    const { id: googleId, email, name, picture } = profileRes.data;

    if (!email) return redirectWithError(res, "google_email_missing");

    let user = await User.findOne({ email });
    if (!user) {
      user = await User.create({
        name,
        email,
        phone:    getOAuthPhonePlaceholder("google", googleId, email),
        avatar:   picture,
        provider: "google",
      });
    } else {
      let changed = false;
      if (!user.avatar && picture) { user.avatar = picture; changed = true; }
      if (!user.provider || user.provider === "local") { user.provider = "google"; changed = true; }
      if (!user.phone) { user.phone = getOAuthPhonePlaceholder("google", googleId, email); changed = true; }
      if (changed) await user.save();
    }

    const token = jwt.sign(
      getTokenPayload(user),
      JWT_SECRET,
      { expiresIn: "7d" }
    );
    res.redirect(`${FRONTEND_URL}/oauth/callback?token=${encodeURIComponent(token)}`);

  } catch (err) {
    console.error("Google OAuth error:", err.response?.data || err.message);
    redirectWithError(res, "google_failed", getOAuthFailureReason(err));
  }
});

module.exports = router;
