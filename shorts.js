# ─── DATABASE ────────────────────────────────────────
DATABASE_URL="postgresql://USER:PASSWORD@HOST:5432/snipshort"

# ─── JWT ─────────────────────────────────────────────
JWT_SECRET="your-super-secret-jwt-key-change-this"
JWT_EXPIRES_IN="7d"

# ─── OWNER ACCOUNT (auto-created on first run) ───────
OWNER_EMAIL="owner@snipshort.online"
OWNER_PASSWORD="snipshort2026"
OWNER_NAME="Owner"

# ─── SERVER ──────────────────────────────────────────
PORT=5000
NODE_ENV=development
FRONTEND_URL="http://localhost:5173"

# ─── YOUTUBE API ─────────────────────────────────────
# Get from: https://console.cloud.google.com
YOUTUBE_CLIENT_ID="your-youtube-client-id"
YOUTUBE_CLIENT_SECRET="your-youtube-client-secret"
YOUTUBE_REDIRECT_URI="http://localhost:5000/api/social/youtube/callback"

# ─── INSTAGRAM API ───────────────────────────────────
# Get from: https://developers.facebook.com
INSTAGRAM_CLIENT_ID="your-instagram-client-id"
INSTAGRAM_CLIENT_SECRET="your-instagram-client-secret"
INSTAGRAM_REDIRECT_URI="http://localhost:5000/api/social/instagram/callback"
