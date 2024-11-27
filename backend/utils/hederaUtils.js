const {
  PrivateKey,
  AccountCreateTransaction,
  Hbar,
} = require("@hashgraph/sdk");
const { client } = require("../config/client");
const crypto = require("crypto");
const { encryptionKey } = require("../config/env");

// Key for encryption (securely stored, e.g., in env variables)
const ENCRYPTION_KEY = Buffer.from(encryptionKey, "hex");
const IV_LENGTH = 16; // For AES

if (ENCRYPTION_KEY.length !== 32) {
  console.error("Invalid ENCRYPTION_KEY length:", ENCRYPTION_KEY.length);
  throw new Error("ENCRYPTION_KEY must be 32 bytes long.");
}

const encryptPrivateKey = (privateKey) => {
  // console.log("Starting encryption process...");
  if (!privateKey) {
    console.error("Private key is undefined.");
    throw new Error("Private key is undefined");
  }

  const iv = crypto.randomBytes(IV_LENGTH);
  console.log("Generated IV for encryption:", iv.toString("hex"));

  try {
    const cipher = crypto.createCipheriv("aes-256-cbc", ENCRYPTION_KEY, iv);

    let encrypted = cipher.update(privateKey, "utf8", "hex");
    encrypted += cipher.final("hex");

    console.log("Encryption successful.");
    return {
      encryptedKey: encrypted,
      iv: iv.toString("hex"),
    };
  } catch (error) {
    console.error("Error during encryption:", error.message);
    throw new Error("Encryption process failed");
  }
};

const decryptPrivateKey = (encryptedKey, iv) => {
  console.log("Starting decryption process...");
  if (!encryptedKey || !iv) {
    console.error(
      "Invalid decryption parameters. EncryptedKey or IV is missing."
    );
    throw new Error("Invalid parameters for decryption.");
  }

  try {
    // console.log("Using IV for decryption:", iv);
    const decipher = crypto.createDecipheriv(
      "aes-256-cbc",
      ENCRYPTION_KEY,
      Buffer.from(iv, "hex")
    );

    let decrypted = decipher.update(encryptedKey, "hex", "utf8");
    decrypted += decipher.final("utf8");

    console.log("Decryption successful.");
    return decrypted;
  } catch (error) {
    console.error("Error during decryption:", error.message);
    throw new Error("Decryption process failed");
  }
};

const generateHederaAccount = async (initialBalance = 100) => {
  console.log("Starting Hedera account generation...");
  try {
    const privateKey = PrivateKey.generate();
    if (!privateKey) {
      console.error("Private key generation failed.");
      throw new Error("Failed to generate private key");
    }

    const publicKey = privateKey.publicKey;
    console.log("Generated public key:", publicKey.toString());

    console.log("Creating Hedera account with initial balance:", initialBalance);
    const transactionResponse = await new AccountCreateTransaction()
      .setKey(publicKey)
      .setInitialBalance(new Hbar(initialBalance))
      .execute(client);

    const receipt = await transactionResponse.getReceipt(client);

    if (receipt.status.toString() !== "SUCCESS") {
      console.error("Account creation failed with status:", receipt.status.toString());
      throw new Error("Hedera account creation failed at transaction level");
    }

    const accountId = receipt.accountId.toString();
    console.log("Hedera account successfully created:", {
      accountId,
      publicKey: publicKey.toString(),
    });

    // Encrypt the private key
    console.log("Encrypting private key...");
    const { encryptedKey, iv } = encryptPrivateKey(privateKey.toString());

    console.log("Hedera account generation completed.");
    return {
      accountId,
      encryptedPrivateKey: encryptedKey,
      publicKey: publicKey.toString(),
      iv,
    };
  } catch (error) {
    console.error("Error during Hedera account creation:", error.message);
    throw new Error("Hedera account creation failed");
  }
};

module.exports = {
  generateHederaAccount,
  encryptPrivateKey,
  decryptPrivateKey,
};
