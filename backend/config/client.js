const { Client } = require("@hashgraph/sdk");
const {hederaAccountId, hederaPrivateKey, teamPoolAccountId, teamPoolPrivateKey } = require("./env.js")

// Initialize the client for the Hedera Testnet
const client = Client.forTestnet();
client.setOperator(hederaAccountId, hederaPrivateKey);

const teamPoolClient = Client.forTestnet();
teamPoolClient.setOperator(teamPoolAccountId, teamPoolPrivateKey);

// Export both clients
module.exports = { client, teamPoolClient };
