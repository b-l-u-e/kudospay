require("dotenv").config();

const REQUIRED_ENV_VARS = [
  "HEDERA_ACCOUNT_ID",
  "HEDERA_PRIVATE_KEY",
  "TEAM_POOL_ACCOUNT_ID",
  "TEAM_POOL_PRIVATE_KEY",
  "PORT",
  "HEDERA_TOPIC_ID",
  "MONGO_URI",
  "JWT_SECRET"
];

// Ensure required environment variables are present
REQUIRED_ENV_VARS.forEach((variable) => {
  if (!process.env[variable]) {
    throw new Error(`Environment variable ${variable} is missing`);
  }
});

module.exports = {
  hederaAccountId: process.env.HEDERA_ACCOUNT_ID,
  hederaPrivateKey: process.env.HEDERA_PRIVATE_KEY,
  teamPoolAccountId: process.env.TEAM_POOL_ACCOUNT_ID,
  teamPoolPrivateKey: process.env.TEAM_POOL_PRIVATE_KEY,
  hederatopicId: process.env.HEDERA_TOPIC_ID,
  port: process.env.PORT || 5000,
  mongoUri: process.env.MONGO_URI,
  jwtToken: process.env.JWT_SECRET
};
