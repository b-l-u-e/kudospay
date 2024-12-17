import API from "./axiosConfig";

// Create a transaction
export const createTransaction = async ({
  fromAccountId,
  toAccountId,
  amount,
  type,
  memo,
}) => {
  try {
    const response = await API.post("/transactions/create", {
      fromAccountId,
      toAccountId,
      amount,
      type,
      memo,
    });
    return response.data;
  } catch (error) {
    console.error(
      "Error creating transaction:",
      error.response?.data || error.message
    );
    throw error;
  }
};

// Submit a transaction to the Hedera network
export const submitTransaction = async (transactionId) => {
  try {
    const response = await API.post(`/transactions/submit/${transactionId}`);
    return response.data;
  } catch (error) {
    console.error(
      "Error submitting transaction:",
      error.response?.data || error.message
    );
    throw error;
  }
};
// Get the status of a transaction
export const getTransactionStatus = async (transactionId) => {
  try {
    const response = await API.get(`/transactions/${transactionId}/status`);
    return response.data;
  } catch (error) {
    console.error(
      "Error fetching transaction status:",
      error.response?.data || error.message
    );
    throw error;
  }
};

// List transactions for a specific user
export const getUserTransactions = async (accountId) => {
  try {
    const response = await API.get(`/transactions/user/${accountId}`);
    return response.data;
  } catch (error) {
    console.error(
      "Error fetching user transactions:",
      error.response?.data || error.message
    );
    throw error;
  }
};

// Tip an individual staff member
export const sendIndividualTip = async ({
  guestId,
  staffId,
  amount,
  memo = "",
}) => {
  try {
    const response = await API.post("/transactions/tip/individual", {
      guestId,
      staffId,
      amount,
      memo,
    });
    return response.data;
  } catch (error) {
    console.error(
      "Error sending individual tip:",
      error.response?.data || error.message
    );
    throw error;
  }
};

// Tip a team/company
export const sendTeamTip = async ({
  guestId,
  teamPoolId,
  amount,
  memo = "",
}) => {
  try {
    const response = await API.post("/transactions/tip/team", {
      guestId,
      teamPoolId,
      amount,
      memo,
    });
    return response.data;
  } catch (error) {
    console.error(
      "Error sending team tip:",
      error.response?.data || error.message
    );
    throw error;
  }
};

// Fetch pending transactions
export const getPendingTransactions = async () => {
  try {
    const response = await API.get("/transactions/pending");
    return response.data;
  } catch (error) {
    console.error(
      "Error fetching pending transactions:",
      error.response?.data || error.message
    );
    throw error;
  }
};

// Update transaction status
export const updateTransactionStatus = async (transactionId, status) => {
  try {
    const response = await API.patch(`/transactions/${transactionId}/status`, {
      status,
    });
    return response.data;
  } catch (error) {
    console.error(
      "Error updating transaction status:",
      error.response?.data || error.message
    );
    throw error;
  }
};

export const fetchAccountDetails = async (accountId) => {
  try {
    const response = await API.get(`/transactions/${accountId}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching account details:", error.response?.data || error.message);
    throw error;
  }
};


