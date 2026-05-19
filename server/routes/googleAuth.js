const express = require("express");
const axios   = require("axios");
const jwt     = require("jsonwebtoken");
const User    = require("../models/userModel");

const router = express.Router();

const GOOGLE_CLIENT_ID     = process.env.GOOGLE_CLIENT_ID;
const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET;
const JWT_SECRET           = process.env.JWT_SECRET;
const FRONTEND_URL         = process.env.FRONTEND_URL || "http://localhost:5173";
const BACKEND_URL          = process.env.BACKEND_URL  || "http://localhost:8080";

/* Step 1: Redirect user to Google */
router.get("/auth/google", (req, res) => {
  const params = new URLSearchParams({
    client_id:     GOOGLE_CLIENT_ID,
    redirect_uri:  `${BACKEND_URL}/auth/google/callback`,
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
  if (!code) return res.redirect(`${FRONTEND_URL}/login?error=google_denied`);

  try {
    const tokenRes = await axios.post("https://oauth2.googleapis.com/token", {
      code,
      client_id:     GOOGLE_CLIENT_ID,
      client_secret: GOOGLE_CLIENT_SECRET,
      redirect_uri:  `${BACKEND_URL}/auth/google/callback`,
      grant_type:    "authorization_code",
    });
    const { access_token } = tokenRes.data;

    const profileRes = await axios.get("https://www.googleapis.com/oauth2/v2/userinfo", {
      headers: { Authorization: `Bearer ${access_token}` },
    });
    const { email, name, picture } = profileRes.data;

    let user = await User.findOne({ email });
    if (!user) {
      user = await User.create({
        name,
        email,
        avatar:   picture,
        provider: "google",
      });
    }

    const token = jwt.sign(
  { 
    id:    user._id, 
    name:  user.name, 
    email: user.email 
  }, 
  JWT_SECRET, 
  { expiresIn: "7d" }
);
    res.redirect(`${FRONTEND_URL}/oauth/callback?token=${token}`);

  } catch (err) {
    console.error("Google OAuth error:", err.message);
    res.redirect(`${FRONTEND_URL}/login?error=google_failed`);
  }
});

module.exports = router;