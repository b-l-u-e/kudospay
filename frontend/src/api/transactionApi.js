import API from "./axiosConfig";

// Create a transaction
export const createTransaction = (transactionData) =>
    API.post("/transaction/create", transactionData);

// Submit a transaction
export const submitTransaction = (transactionData) =>
    API.post("/transaction/submit", transactionData);

// Get transactions for a user (guest, staff, or company)
export const getUserTransactions = (accountId) =>
    API.get(`/transaction/user/${accountId}`);

// Get transaction status
export const getTransactionStatus = (transactionId) =>
    API.get(`/transaction/status/${transactionId}`);
