import { useState, useEffect, useCallback } from "react";
import { fetchAccountDetails } from "../../../api/transactionApi";
import { getStaffDetails } from "../../../api/staffApi";
import { fetchRecognitionMessagesByRecipient } from "../../../api/recognitionApi";
import { format } from "date-fns";
import useAuth from "../../../hooks/useAuth";

import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const StaffDashboard = () => {
  const { user } = useAuth(); // Logged-in staff user
  const staffAccountId = user?.hederaAccountId;

  // States
  const [balance, setBalance] = useState(0);
  const [tipTransactions, setTipTransactions] = useState([]);
  const [staffDetails, setStaffDetails] = useState(null);
  const [recognitionMessages, setRecognitionMessages] = useState([]);
  
  const [loadingAccount, setLoadingAccount] = useState(true);
  const [loadingStaffDetails, setLoadingStaffDetails] = useState(true);
  const [loadingMessages, setLoadingMessages] = useState(true);

  const [errorAccount, setErrorAccount] = useState(null);
  const [errorStaffDetails, setErrorStaffDetails] = useState(null);
  const [errorMessages, setErrorMessages] = useState(null);

  /** Fetch account details */
  const loadAccountDetails = useCallback(async () => {
    if (!staffAccountId) return;

    setLoadingAccount(true);
    setErrorAccount(null);
    try {
      const data = await fetchAccountDetails(staffAccountId);

      // Update balance
      setBalance(data.balance.hbarBalance);

      // Extract incoming tips
      const incomingTips = data.transactions
        .filter((tx) =>
          tx.transfers.some(
            (transfer) =>
              transfer.account === staffAccountId && transfer.amount > 0
          )
        )
        .map((tx) => {
          const sender = tx.transfers.find(
            (transfer) =>
              transfer.amount < 0 && transfer.account !== staffAccountId
          );
          const amount = tx.transfers.find(
            (transfer) => transfer.account === staffAccountId
          )?.amount;

          return {
            id: tx.id,
            sender: sender?.account || "N/A",
            amount: (amount / 1e8).toFixed(8), // Convert tinybars to HBAR
            timestamp: format(
              new Date(parseFloat(tx.timestamp) * 1000),
              "yyyy-MM-dd HH:mm:ss"
            ),
          };
        });

      setTipTransactions(incomingTips);
    } catch (err) {
      console.error("Error fetching account details:", err);
      setErrorAccount("Failed to load balance and transactions.");
    } finally {
      setLoadingAccount(false);
    }
  }, [staffAccountId]);

  /** Fetch staff details */
  const loadStaffDetails = useCallback(async () => {
    setLoadingStaffDetails(true);
    setErrorStaffDetails(null);
    try {
      const details = await getStaffDetails(user._id);
      setStaffDetails(details);
    } catch (err) {
      console.error("Error fetching staff details:", err);
      setErrorStaffDetails("Failed to load staff details.");
    } finally {
      setLoadingStaffDetails(false);
    }
  }, [user._id]);

  /** Fetch recognition messages */
  const loadRecognitionMessages = useCallback(async () => {
    if (!staffAccountId) return;

    setLoadingMessages(true);
    setErrorMessages(null);
    try {
      const messages = await fetchRecognitionMessagesByRecipient(
        staffAccountId
      );
      setRecognitionMessages(messages);
    } catch (err) {
      console.error("Error fetching recognition messages:", err);
      setErrorMessages("Failed to load recognition messages.");
    } finally {
      setLoadingMessages(false);
    }
  }, [staffAccountId]);

  useEffect(() => {
    if (staffAccountId) {
      loadAccountDetails();
      loadStaffDetails();
      loadRecognitionMessages();
    }
  }, [loadAccountDetails, loadStaffDetails, loadRecognitionMessages, staffAccountId]);

  return (
    <div className="min-h-screen bg-gray-100">
      <ToastContainer position="top-right" autoClose={3000} />

      {/* Header */}
      <header className="bg-green-600 text-white p-4 shadow">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <h1 className="text-3xl font-bold">Staff Dashboard</h1>
          <p>Welcome, {user.name || "Staff"}!</p>
        </div>
      </header>

      <main className="max-w-7xl mx-auto p-6">
        {/* Staff Details */}
        <section className="mb-8">
          <h2 className="text-xl font-semibold mb-4">Your Details</h2>
          <div className="bg-white p-6 rounded shadow">
            {loadingStaffDetails ? (
              <p className="animate-pulse">Loading staff details...</p>
            ) : errorStaffDetails ? (
              <p className="text-red-500">{errorStaffDetails}</p>
            ) : (
              <>
                <p>
                  <strong>Username:</strong> {staffDetails.username}
                </p>
                <p>
                  <strong>Email:</strong> {staffDetails.email}
                </p>
                <p>
                  <strong>Company:</strong> {staffDetails.companyName || "N/A"}
                </p>
              </>
            )}
          </div>
        </section>

        {/* Balance Section */}
        <section className="mb-8">
          <h2 className="text-xl font-semibold mb-4">Your Balance</h2>
          <div className="bg-white p-6 rounded shadow text-center">
            {loadingAccount ? (
              <p className="animate-pulse">Loading...</p>
            ) : errorAccount ? (
              <p className="text-red-500">{errorAccount}</p>
            ) : (
              <p className="text-3xl font-bold text-green-600">
                {balance.toFixed(2)} HBAR
              </p>
            )}
          </div>
        </section>

        {/* Recognition Messages */}
        <section className="mb-8">
          <h2 className="text-xl font-bold mt-6">Recognition Messages</h2>
          {loadingMessages ? (
            <p className="animate-pulse ">Loading messages...</p>
          ) : errorMessages ? (
            <p className="text-red-500">{errorMessages}</p>
          ) : recognitionMessages.length > 0 ? (
            <ul className="space-y-2">
              {recognitionMessages.map((msg, index) => (
                <li key={index} className="p-4 border rounded shadow">
                  <p>
                    <strong>Message:</strong> {msg.message}
                  </p>
                  <p>
                    <strong>Timestamp:</strong>{" "}
                    {format(new Date(parseFloat(msg.timestamp) * 1000), "yyyy-MM-dd HH:mm:ss")}
                  </p>
                </li>
              ))}
            </ul>
          ) : (
            <p>No recognition messages found.</p>
          )}
        </section>

        {/* Tips Received */}
        <section className="bg-white shadow-lg rounded-lg p-6">
          <h2 className="text-2xl font-semibold mb-4">Tips Received</h2>
          {loadingAccount ? (
            <p className="animate-pulse text-gray-500">Loading tips...</p>
          ) : tipTransactions.length > 0 ? (
            <ul className="divide-y divide-gray-200">
              {tipTransactions.map((tx) => (
                <li key={tx.id} className="py-4">
                  <p>
                    <strong>Transaction ID:</strong> {tx.id}
                  </p>
                  <p>
                    <strong>Sender:</strong> {tx.sender}
                  </p>
                  <p>
                    <strong>Amount Received:</strong> {tx.amount} ℏ
                  </p>
                  <p className="text-sm text-gray-500">
                    <strong>Timestamp:</strong> {tx.timestamp}
                  </p>
                </li>
              ))}
            </ul>
          ) : (
            <p>No tips received yet.</p>
          )}
        </section>
      </main>
    </div>
  );
};

export default StaffDashboard;
