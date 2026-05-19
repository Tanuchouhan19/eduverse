const express = require("express");
const axios   = require("axios");
const jwt     = require("jsonwebtoken");
const User    = require("../models/userModel");

const router = express.Router();

const GITHUB_CLIENT_ID     = process.env.GITHUB_CLIENT_ID;
const GITHUB_CLIENT_SECRET = process.env.GITHUB_CLIENT_SECRET;
const JWT_SECRET           = process.env.JWT_SECRET;
const FRONTEND_URL         = process.env.FRONTEND_URL || process.env.CLIENT_URL || "http://localhost:5173";
const BACKEND_URL          = process.env.BACKEND_URL  || "http://localhost:8080";

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

/* Step 1: Redirect user to GitHub */
router.get("/auth/github", (req, res) => {
  const params = new URLSearchParams({
    client_id:    GITHUB_CLIENT_ID,
    redirect_uri: `${BACKEND_URL}/auth/github/callback`,
    scope:        "user:email",
  });
  res.redirect(`https://github.com/login/oauth/authorize?${params}`);
});

/* Step 2: GitHub calls back with ?code */
router.get("/auth/github/callback", async (req, res) => {
  const { code } = req.query;
  if (!code) return res.redirect(`${FRONTEND_URL}/login?error=github_denied`);

  try {
    const tokenRes = await axios.post(
      "https://github.com/login/oauth/access_token",
      { client_id: GITHUB_CLIENT_ID, client_secret: GITHUB_CLIENT_SECRET, code },
      { headers: { Accept: "application/json" } }
    );
    const accessToken = tokenRes.data.access_token;
    if (!accessToken) throw new Error("No access token");

    const [profileRes, emailsRes] = await Promise.all([
      axios.get("https://api.github.com/user",        { headers: { Authorization: `Bearer ${accessToken}` } }),
      axios.get("https://api.github.com/user/emails", { headers: { Authorization: `Bearer ${accessToken}` } }),
    ]);

    const profile = profileRes.data;
    const primary = emailsRes.data.find(e => e.primary && e.verified);
    const email   = primary?.email || profile.email;

    if (!email) return res.redirect(`${FRONTEND_URL}/login?error=no_email`);

    let user = await User.findOne({ email });
    if (!user) {
      user = await User.create({
        name:     profile.name || profile.login,
        email,
        phone:    getOAuthPhonePlaceholder("github", profile.id, email),
        avatar:   profile.avatar_url || "",
        provider: "github",
      });
    } else {
      let changed = false;
      if ((!user.name || user.name === "Student") && (profile.name || profile.login)) {
        user.name = profile.name || profile.login;
        changed = true;
      }
      if (!user.avatar && profile.avatar_url) { user.avatar = profile.avatar_url; changed = true; }
      if (!user.provider || user.provider === "local") { user.provider = "github"; changed = true; }
      if (!user.phone) { user.phone = getOAuthPhonePlaceholder("github", profile.id, email); changed = true; }
      if (changed) await user.save();
    }

    const token = jwt.sign(getTokenPayload(user), JWT_SECRET, { expiresIn: "7d" });
    res.redirect(`${FRONTEND_URL}/oauth/callback?token=${encodeURIComponent(token)}`);

  } catch (err) {
    console.error("GitHub OAuth error:", err.message);
    res.redirect(`${FRONTEND_URL}/login?error=github_failed`);
  }
});

module.exports = router;
