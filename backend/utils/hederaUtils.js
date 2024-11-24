const {
  PrivateKey,
  AccountCreateTransaction,
  Hbar,
} = require("@hashgraph/sdk");
const { client } = require("../config/client");


// Generate a new Hedera account
const generateHederaAccount = async (initialBalance = 10) => {
  try {
    const privateKey = PrivateKey.generate();
    const publicKey = privateKey.publicKey;

    const transactionResponse = await new AccountCreateTransaction()
      .setKey(publicKey)
      .setInitialBalance(new Hbar(initialBalance))
      .execute(client);

    const receipt = await transactionResponse.getReceipt(client);

    if (receipt.status.toString() !== "SUCCESS") {
      console.error("Account creation failed:", receipt.status.toString());
      throw new Error("Hedera account creation failed at transaction level");
    }

    const accountId = receipt.accountId.toString();
    console.log("Hedera account created:", { accountId, publicKey });
  

    return {
      accountId,
      privateKey: privateKey.toString(),
      publicKey: publicKey.toString(),
    };
  } catch (error) {
    console.error("Failed to create Hedera account:", error.message);
    throw new Error("Hedera account creation failed");
  }
};

module.exports = { client, generateHederaAccount };
