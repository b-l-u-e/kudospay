require("dotenv").config();

const REQUIRED_ENV_VARS = [
  "SYSTEM_ACCOUNT_ID",
  "SYSTEM_PRIVATE_KEY",
  "HEDERA_TOPIC_ID",
  "MONGO_URI",
  "JWT_SECRET",
  "HEDERA_NETWORK",
  "ENCRYPTION_SECRET",
  "PORT",
];

// Ensure required environment variables are present
REQUIRED_ENV_VARS.forEach((variable) => {
  if (!process.env[variable]) {
    throw new Error(`Environment variable ${variable} is missing`);
  }
});

module.exports = {
  systemAccountId: process.env.SYSTEM_ACCOUNT_ID, // System-level Hedera account ID
  systemPrivateKey: process.env.SYSTEM_PRIVATE_KEY, // System-level private key
  hederaTopicId: process.env.HEDERA_TOPIC_ID, // Topic ID for consensus messaging
  mongoUri: process.env.MONGO_URI, // MongoDB connection URI
  jwtToken: process.env.JWT_SECRET, // JWT secret for token signing
  hederaNetwork: process.env.HEDERA_NETWORK, // "testnet" or "mainnet"
  encryptionKey: process.env.ENCRYPTION_SECRET,
  port: process.env.PORT || 5000, // Application port
};
