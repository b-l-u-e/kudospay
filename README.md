Here is the updated `README.md` with the inclusion of **Mirror Nodes** for real-time transaction and message retrieval, along with the other enhancements you mentioned.

---

# KudosPay - Decentralized Tipping Platform

### Description

KudosPay is a decentralized platform designed to facilitate transparent and fair tipping for staff in the hospitality and tourism industry. Built on the **Hedera Hashgraph** network, the platform allows guests to directly send token-based tips and recognition notes to staff, ensuring accountability and equitable distribution.

---

## Features

1. **Token-Based Tipping**
   - Allows guests to send cryptocurrency-based tips securely.
   - Integrates with Hedera testnet for smooth and low-cost transactions.

2. **Transparent Record of Tips**
   - All transactions are recorded on the Hedera network, ensuring transparency and traceability.
   - Utilizes **Hedera Mirror Nodes** to fetch real-time transaction history.

3. **Recognition Notes**
   - Guests can include personalized notes recognizing staff members for exceptional service.
   - Messages are sent to a Hedera **Topic ID**, and real-time retrieval is performed via **Mirror Nodes**.

4. **Tip Distribution**
   - Companies can optionally distribute tips among team members using predefined logic.

5. **Company Dashboard**
   - View remaining balances after tip distributions.
   - Manage staff, view transaction history, and access recognition notes.

6. **Staff Management**
   - Register, update, activate, and deactivate staff members easily.

7. **Company Management**
   - Register companies and activate them via admin approval.
   - Manage company balance and tip distribution.
   - Fetch and display guest recognition messages.

8. **Real-Time Data with Hedera Mirror Nodes**
   - Retrieve real-time:
     - **Transaction Data**: Incoming and outgoing token transfers for accounts.
     - **Topic Messages**: Messages sent to a specific **Hedera Topic ID**.

---

## Tech Stack

### Frontend
- **React.js** (Vite)
- **Tailwind CSS** for styling
- **React Icons** for icons
- **Axios** for API communication
- **React Toastify** for notifications

### Backend
- **Node.js** with **Express.js**
- **MongoDB** for data storage
- **Hedera SDK** (`@hashgraph/sdk`) for blockchain transactions and topic creation
- **Hedera Mirror Nodes** for retrieving real-time transactions and messages
- **JWT** for authentication

### Blockchain
- **Hedera Hashgraph** (Testnet)

---

## Installation

### Prerequisites

- **Node.js** (v14+)
- **MongoDB** installed or hosted
- Access to the **Hedera Testnet**

### Steps to Run

1. **Clone the Repository**:

   ```bash
   git clone https://github.com/your-repo/kudospay.git
   cd kudospay
   ```

2. **Install Dependencies**:

   ```bash
   npm install
   ```

3. **Setup Environment Variables**:

   - Create a `.env` file in the root directory.
   - Add the following variables:

     ```
     SYSTEM_ACCOUNT_ID=your_hedera_account_id
     SYSTEM_PRIVATE_KEY=your_hedera_private_key
     HEDERA_TOPIC_ID=your_topic_id
     HEDERA_NETWORK=testnet
     PORT=5000
     MONGO_URI=your_mongodb_uri
     JWT_SECRET=your_jwt_secret
     ```

4. **Automated Topic Creation**:

   - Run the following script to create a **Hedera Topic** for recognition messages:

     ```bash
     node scripts/createTopic.js
     ```

   - This script uses **Hedera SDK** to:
     1. Create a new **Topic ID**.
     2. Automatically update the `.env` file with the generated `HEDERA_TOPIC_ID`.

5. **Run the Backend Server**:

   ```bash
   npm run dev
   ```

6. **Run the Frontend Server**:

   - Ensure the frontend connects to the backend API running on port `5000`.

   ```bash
   npm run dev
   ```

7. **Access the App**:

   Open `http://localhost:5173/` in your browser.

---

## API Endpoints

### Auth
- `POST /api/auth/login` - Login user
- `POST /api/auth/register` - Register guest
- `POST /api/auth/register/staff` - Register staff
- `POST /api/auth/register/company` - Register company

### Staff
- `GET /api/staff` - View staff list
- `GET /api/staff/:id` - Get staff details by ID

### Companies
- `GET /api/companies` - Get all active companies
- `POST /api/companies/register` - Register a company
- `POST /api/companies/:companyId/distribute` - Distribute tips among staff

### Transactions
- `POST /api/transactions/sendTip` - Send tip to a staff member
- `GET /api/transactions/:accountId` - Get transaction history for an account (via Mirror Node API)

### Recognition Messages
- `POST /api/recognition` - Send a recognition message to Hedera topic
- `GET /api/recognition/messages/:recipientId` - Fetch messages for a specific recipient (via Mirror Node API)

---

## Automated Topic Creation (Hedera SDK)

- The platform uses **Hedera SDK** (`@hashgraph/sdk`) to:
  - **Create a Hedera Topic**.
  - **Send and Fetch Transactions** securely on the Hedera network.

### Creating a Topic

The `scripts/createTopic.js` script handles:
1. Creating a new Hedera **Topic**.
2. Automatically updating the `.env` file with the generated `HEDERA_TOPIC_ID`.

### Example Script:

```javascript
const fs = require("fs");
const { TopicCreateTransaction } = require("@hashgraph/sdk");
const { client } = require("../config/client");

async function createTopic() {
  const transaction = new TopicCreateTransaction();
  const response = await transaction.execute(client);
  const receipt = await response.getReceipt(client);

  const topicId = receipt.topicId.toString();
  console.log("New Topic ID:", topicId);

  // Update the .env file
  const envConfig = fs.readFileSync(".env", "utf8");
  const updatedConfig = envConfig.replace(/HEDERA_TOPIC_ID=.*/, `HEDERA_TOPIC_ID=${topicId}`);
  fs.writeFileSync(".env", updatedConfig);

  console.log("Updated .env with the new topic ID.");
}

createTopic();
```

Run the script with:

```bash
node scripts/createTopic.js
```

---

## Real-Time Data Retrieval

### Transactions and Messages

- **Transactions** and **messages** are retrieved in real-time using **Hedera Mirror Nodes**.
- These endpoints ensure up-to-date visibility of:
   - **Account balances**.
   - **Tip transactions**.
   - **Recognition messages** sent to a Hedera Topic.

Example Mirror Node API Endpoints used:

1. Fetch account details and transactions:
   ```
   GET https://testnet.mirrornode.hedera.com/api/v1/accounts/{accountId}
   ```

2. Fetch topic messages:
   ```
   GET https://testnet.mirrornode.hedera.com/api/v1/topics/{topicId}/messages
   ```

---

## Future Enhancements

- Integration with other blockchains for cross-chain tipping.
- AI-based analytics to predict and enhance staff recognition trends.

---

## License

This project is licensed under the **MIT License**.

---

## Contact

For inquiries or support:
- **Email**: winnie.gitau282@gmail.com

---

Thank you for using KudosPay! 🚀