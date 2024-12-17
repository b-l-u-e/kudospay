import { useState, useEffect, useCallback } from "react";
import { getCompanyStaff, distributeTips } from "../../../api/companyApi";
import { fetchAccountDetails } from "../../../api/transactionApi";
import { fetchRecognitionMessagesByRecipient } from "../../../api/recognitionApi";
import useAuth from "../../../hooks/useAuth";
import { format } from "date-fns";

import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Button from "../../../components/common/Button";

const CompanyDashboard = () => {
  const { user } = useAuth();
  const companyAccountId = user?.hederaAccountId;
  const companyId = user?.companyId;
  const companyName = user?.name;

  const [balance, setBalance] = useState(0);
  const [staff, setStaff] = useState([]);
  const [amount, setAmount] = useState("");
  const [error, setError] = useState("");

  const [loading, setLoading] = useState(false);
  const [messagesLoading, setMessagesLoading] = useState(false);
  const [staffLoading, setStaffLoading] = useState(false);
  const [recognitionMessages, setRecognitionMessages] = useState([]);
  const [tipTransactions, setTipTransactions] = useState([]);

  const [isNewCompany, setIsNewCompany] = useState(true);

  /** Fetch account details including balance and transactions */
  const loadAccountDetails = useCallback(async () => {
    if (isNewCompany || !companyAccountId) {
      console.log("Skipping account details fetch for new company...");
      setBalance(0); // Default balance for new companies
      setTipTransactions([]);
      return;
    }

    setLoading(true);

    try {
      const data = await fetchAccountDetails(companyAccountId);

      setBalance(data.balance.hbarBalance);

      // Extract incoming tips
      const incomingTips = data.transactions
        .filter((tx) =>
          tx.transfers.some(
            (transfer) =>
              transfer.account === companyAccountId && transfer.amount > 0
          )
        )
        .map((tx) => {
          const sender = tx.transfers.find(
            (transfer) =>
              transfer.amount < 0 && transfer.account !== companyAccountId
          );
          const amount = tx.transfers.find(
            (transfer) => transfer.account === companyAccountId
          )?.amount;

          return {
            id: tx.id,
            sender: sender?.account || "N/A",
            amount: (amount / 1e8).toFixed(8),
            timestamp: format(
              new Date(parseFloat(tx.timestamp) * 1000),
              "yyyy-MM-dd HH:mm:ss"
            ),
          };
        });
      console.log("incoming tips:", incomingTips);
      setTipTransactions(incomingTips);
      setIsNewCompany(false);
      setError("");
    } catch (err) {
      console.error("Error fetching account details:", err);
      toast.error("Failed to load account details.");
      setIsNewCompany(true);
    } finally {
      setLoading(false);
    }
  }, [companyAccountId, isNewCompany]);

  /** Fetch staff members */
  const loadStaff = useCallback(async () => {
    setStaffLoading(true);
    try {
      const staffData = await getCompanyStaff(companyId);
      console.log("Staff data:", staffData);

      if (staffData?.length > 0) {
        setIsNewCompany(false); // If staff exists, it’s not a new company
      }

      setStaff(staffData);
      toast.success("staff data loaded successfully!");
    } catch (err) {
      console.error("Error fetching company staff:", err);
      toast.error("Failed to load company staff.");
    } finally {
      setStaffLoading(false);
    }
  }, [companyId]);

  /** Fetch recognition messages */
  const loadRecognitionMessages = useCallback(async () => {
    if (!companyAccountId) return;

    setMessagesLoading(true);
    try {
      const messages = await fetchRecognitionMessagesByRecipient(
        companyAccountId
      );
      console.log("Messages:", messages);
      setRecognitionMessages(messages);
      toast.success("Reviews loaded successfully!");
    } catch (err) {
      console.error("Error fetching recognition messages:", err);
      toast.error("Failed to load recognition messages.");
    } finally {
      setMessagesLoading(false);
    }
  }, [companyAccountId]);

  /** Handle tip distribution */
  const handleDistributeTips = async (e) => {
    e.preventDefault();

    if (!amount || parseFloat(amount) <= 0) {
      toast.error("Please enter a valid tip amount.");
      return;
    }
    
    setLoading(true);

    try {
      await distributeTips(companyAccountId, amount);
      toast.success(
        "Tips distributed to the respective staff members successfully!"
      );
      setAmount("");
      await loadAccountDetails(); // Refresh account data
    } catch (err) {
      console.error("Error distributing tips:", err);
      toast.error(
        err.response?.data?.error ||
          "Failed to distribute tips. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (companyAccountId) {
      loadAccountDetails();
      loadStaff();
      loadRecognitionMessages();
    }
  }, [
    loadAccountDetails,
    loadStaff,
    loadRecognitionMessages,
    companyAccountId,
  ]);

  return (
    <div className="min-h-screen text-gray-800 bg-[#F5EFE7]">
      <ToastContainer position="top-right" autoClose={3000} />

      {/* Header */}
      <header className="bg-[#213555] text-white p-6 shadow-lg">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between space-y-2 md:space-y-0">
          <h1 className="text-3xl font-semibold">Company Dashboard</h1>
          <p className="text-lg font-semibold">Welcome, {companyName}!</p>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-6 py-8 space-y-8">
        {/* Balance Section */}
        <section className="bg-white shadow-lg rounded-lg p-6 text-center">
          <h2 className="text-2xl font-semibold text-gray-700 mb-4">
            Company Balance: {companyAccountId}
          </h2>
          <p className="text-5xl font-extrabold text-[#D8C4B6] animate-pulse">
            {balance} ℏ
          </p>
        </section>

        {/* Distribute Tips */}
        <section className="bg-white shadow-lg rounded-lg p-6">
          <h2 className="text-2xl font-semibold text-gray-700 mb-4">
            Distribute Tips
          </h2>
          {error && <p className="text-red-500 mb-4">{error}</p>}
          <form onSubmit={handleDistributeTips} className="space-y-4">
            <div>
              <label className="block text-gray-600 font-medium mb-2">
                Amount to Distribute (ℏ)
              </label>
              <input
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
                placeholder="Enter amount"
                required
              />
            </div>
            <Button
              type="submit"
              className={`w-full py-3 px-6 rounded-lg text-white font-semibold transition-all ${
                loading
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-[#3E5879] hover:bg-[#213555]"
              }`}
              disabled={loading}
            >
              {loading ? "Distributing..." : "Distribute Tips"}
            </Button>
          </form>
        </section>

        {/* Staff Members */}
        <section className="bg-white shadow-lg rounded-lg p-6">
          <h2 className="text-2xl font-semibold text-gray-700 mb-4">
            Staff Members
          </h2>
          {staffLoading ? (
            <p className="text-blue-500">Loading staff members...</p>
          ) : (
            <div className="divide-y divide-gray-200">
              {staff.map((member) => (
                <div
                  key={member._id}
                  className="py-3 flex justify-between items-center"
                >
                  <p className="text-gray-700">{member.username}</p>
                  <p className="text-sm text-gray-500">
                    {member.hederaAccountId}
                  </p>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* Recognition Messages */}
        <section className="bg-white shadow-lg rounded-lg p-6">
          <h2 className="text-2xl font-semibold text-gray-700 mb-4">
            Reviews from Guests
          </h2>
          {messagesLoading && (
            <p className="text-blue-500">Loading messages...</p>
          )}
          {recognitionMessages.length > 0 ? (
            <ul className="divide-y divide-gray-200">
              {recognitionMessages.map((message, index) => (
                <li key={index} className="py-4">
                  <p className="text-gray-700">
                    <strong>Message:</strong> {message.message}
                  </p>
                  <p className="text-sm text-gray-500">
                    <strong>Timestamp:</strong>{" "}
                    {message.timestamp
                      ? format(
                          new Date(parseFloat(message.timestamp) * 1000),
                          "yyyy-MM-dd HH:mm:ss"
                        )
                      : "No timestamp available"}
                  </p>
                </li>
              ))}
            </ul>
          ) : (
            !messagesLoading && (
              <p className="text-gray-500">No recognition messages found.</p>
            )
          )}
        </section>

        {/* Tip Transactions */}
        <section className="bg-white shadow-lg rounded-lg p-6">
          <h2 className="text-2xl font-semibold text-gray-700 mb-4">
            Tips Received
          </h2>
          {loading ? (
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
                    <strong>Amount Received:</strong>{" "}
                    <span className="text-blue-600 font-semibold">
                      {tx.amount} ℏ
                    </span>
                  </p>
                  <p className="text-sm text-gray-500">
                    <strong>Timestamp:</strong> {tx.timestamp}
                  </p>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-500">No tips received yet.</p>
          )}
        </section>
      </main>
    </div>
  );
};

export default CompanyDashboard;
