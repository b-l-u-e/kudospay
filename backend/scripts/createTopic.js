const { TopicCreateTransaction } = require("@hashgraph/sdk");
const {client} = require("../config/client"); 

async function createTopic() {
    const transaction = new TopicCreateTransaction()
    const response = await transaction.execute(client)
    const receipt = await response.getReceipt(client)
    console.log("New Topic ID:", receipt.topicId.toString())

    await new Promise((resolve) => setTimeout(resolve, 5000));
}

createTopic()