const { Client } = require("@hashgraph/sdk");
const { systemAccountId, systemPrivateKey, hederaNetwork } = require("./env");

// Initialize Hedera client for the configured network
const client =
  hederaNetwork === "mainnet" ? Client.forMainnet() : Client.forTestnet();

// Ensure the system operator is properly configured
if (!systemAccountId || !systemPrivateKey) {
  throw new Error(
    "System account ID and private key must be provided in the environment variables"
  );
}

client.setOperator(systemAccountId, systemPrivateKey);

const setOperator = (accountId, privateKey) => {
  if (!accountId || !privateKey) {
    throw new Error(
      "Both accountId and privateKey are required to set the operator"
    );
  }
  client.setOperator(accountId, privateKey);
};
// Export both clients
module.exports = { client, setOperator };
