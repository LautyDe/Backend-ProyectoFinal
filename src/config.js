import dotenv from "dotenv";

dotenv.config();

export default {
  mongo_uri: process.env.MONGO_URI,
  port: process.env.PORT,
  secret_password: process.env.SECRET_PASSWORD,
  secret_cookie: process.env.SECRET_COOKIE,
  secret_session: process.env.SECRET_SESSION,
  admin_email: process.env.ADMIN_EMAIL,
  role_admin: process.env.ROLE_ADMIN,
  github_client_id: process.env.GITHUB_CLIENT_ID,
  github_client_secret: process.env.GITHUB_CLIENT_SECRET,
  github_callback_url: process.env.GITHUB_CALLBACK_URL,
  role_user: process.env.ROLE_USER,
  role_premium: process.env.ROLE_PREMIUM,
  node_env: process.env.NODE_ENV,
  gmail_user: process.env.GMAIL_USER,
  gmail_pass: process.env.GMAIL_PASS,
};
