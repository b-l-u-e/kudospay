const { TopicCreateTransaction } = require("@hashgraph/sdk");
const { client } = require("../config/client");
const fs = require("fs");
const path = require("path");

// Path to the .env file
const ENV_FILE_PATH = path.resolve(__dirname, "../.env");

async function createTopic() {
  try {
    console.log("Creating a new topic...");
    const transaction = new TopicCreateTransaction();
    const response = await transaction.execute(client);
    const receipt = await response.getReceipt(client);

    const topicId = receipt.topicId.toString();
    console.log("New Topic ID:", topicId);

    await new Promise((resolve) => setTimeout(resolve, 5000));
    // Append or update the HEDERA_TOPIC_ID in .env
    updateEnvFile("HEDERA_TOPIC_ID", topicId);

    console.log("Topic ID successfully saved to .env.");
    process.exit(0); // Exit successfully
  } catch (error) {
    console.error("Error creating topic:", error.message);
    process.exit(1); // Exit with an error code
  }
}

// Function to update or append a key-value pair in .env
function updateEnvFile(key, value) {
  if (!fs.existsSync(ENV_FILE_PATH)) {
    // If the .env file doesn't exist, create it
    fs.writeFileSync(ENV_FILE_PATH, `${key}=${value}\n`);
  } else {
    // If it exists, read its content
    const envContent = fs.readFileSync(ENV_FILE_PATH, "utf-8");
    const envLines = envContent.split("\n");

    // Check if the key already exists
    const existingLineIndex = envLines.findIndex((line) =>
      line.startsWith(`${key}=`)
    );

    if (existingLineIndex !== -1) {
      // Update the existing line
      envLines[existingLineIndex] = `${key}=${value}`;
    } else {
      // Add a new line for the key
      envLines.push(`${key}=${value}`);
    }

    // Write the updated content back to .env
    fs.writeFileSync(ENV_FILE_PATH, envLines.join("\n"));
  }
}

createTopic();
