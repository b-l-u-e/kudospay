import { useState, useEffect } from "react";
import useAuth from "../../../hooks/useAuth";
import {
  sendIndividualTip,
  sendTeamTip,
  fetchAccountDetails,
} from "../../../api/transactionApi";
import { addRecognitionNote } from "../../../api/recognitionApi";
import { getAllCompanies, getActiveStaff } from "../../../api/companyApi";
import { format } from "date-fns";
import Button from "../../../components/common/Button";

const GuestDashboard = () => {
  const { user } = useAuth(); // Logged-in guest user
  const [tipType, setTipType] = useState("individual");
  const [teamList, setTeamList] = useState([]); // List of all teams
  const [selectedCompany, setSelectedCompany] = useState(""); // Selected company
  const [selectedRecipient, setSelectedRecipient] = useState(""); // Selected team Hedera Account ID
  const [staffCount, setStaffCount] = useState(0); // Total active staff in the selected team
  const [amount, setAmount] = useState(""); // Tip amount
  const [recognitionNote, setRecognitionNote] = useState(""); // Optional note
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const [balance, setBalance] = useState(0);
  const [deposits, setDeposits] = useState([]); // Deposit transactions
  const [outgoingTransactions, setOutgoingTransactions] = useState([]); // Outgoing transactions

  // Fetch all active teams on component mount
  useEffect(() => {
    const fetchTeams = async () => {
      try {
        const response = await getAllCompanies();
        setTeamList(response.filter((company) => company.isActive));
      } catch (err) {
        console.error("Error fetching team data:", err);
        setError("Failed to load team details. Please try again.");
      }
    };

    fetchTeams();
  }, []);

  // Fetch account details on mount
  useEffect(() => {
    const loadAccountDetails = async () => {
      try {
        const data = await fetchAccountDetails(user?.hederaAccountId);

        if (!data || !data.balance) {
          console.warn("No data returned for account:", user?.hederaAccountId);
          setBalance(0);
          setDeposits([]);
          setOutgoingTransactions([]);
          setError("This account has no transactions yet.");
          return;
        }

        // Process transactions as before
        const depositTransactions = [];
        const outgoingTx = [];

        data.transactions?.forEach((tx) => {
          const userTransfer = tx.transfers.find(
            (transfer) => transfer.account === user.hederaAccountId
          );

          if (userTransfer) {
            const formattedTimestamp = format(
              new Date(parseFloat(tx.timestamp) * 1000),
              "yyyy-MM-dd HH:mm:ss"
            );

            if (userTransfer.amount > 0) {
              depositTransactions.push({
                id: tx.id,
                sender:
                  tx.transfers.find((t) => t.amount < 0)?.account || "N/A",
                amount: (userTransfer.amount / 1e8).toFixed(8),
                timestamp: formattedTimestamp,
              });
            } else if (userTransfer.amount < 0) {
              const receiver = tx.transfers.find(
                (t) => t.amount > 0 && t.account !== user.hederaAccountId
              );
              outgoingTx.push({
                id: tx.id,
                receiver: receiver?.account || "N/A",
                amount: (-userTransfer.amount / 1e8).toFixed(8),
                timestamp: formattedTimestamp,
              });
            }
          }
        });

        setBalance(data.balance?.hbarBalance || 0);
        setDeposits(depositTransactions);
        setOutgoingTransactions(outgoingTx);
        setError("");
      } catch (err) {
        console.error("Error fetching account details:", err);
        setBalance(0);
        setDeposits([]);
        setOutgoingTransactions([]);
        setError(
          "No data found for this account. Start by making a transaction."
        );
      } finally {
        setLoading(false);
      }
    };

    if (user?.hederaAccountId) {
      loadAccountDetails();

      const interval = setInterval(() => {
        loadAccountDetails(); // Poll every 10 seconds
      }, 10000);

      return () => clearInterval(interval); // Cleanup on unmount
    }
  }, [user]);

  // Fetch active staff for a selected company
  const fetchActiveStaff = async (companyId) => {
    try {
      const { activeStaff } = await getActiveStaff(companyId);
      setStaffCount(activeStaff.length); // Update the staff count
    } catch (err) {
      console.error("Error fetching active staff:", err);
      setStaffCount(0); // Reset staff count on error
    }
  };

  // Handle tip submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);

    try {
      if (!selectedRecipient) {
        setError(
          `Please select a ${
            tipType === "individual" ? "staff member" : "team"
          } to tip.`
        );
        return;
      }

      if (!amount || isNaN(amount) || parseFloat(amount) <= 0) {
        setError("Please enter a valid tip amount.");
        return;
      }

      if (tipType === "team") {
        // Send team tip
        await sendTeamTip({
          guestId: user.hederaAccountId,
          teamPoolId: selectedRecipient,
          amount,
          memo: recognitionNote,
        });
      } else {
        // Send individual tip
        await sendIndividualTip({
          guestId: user.hederaAccountId,
          staffId: selectedRecipient,
          amount,
          memo: recognitionNote,
        });
      }

      // Add recognition note if provided
      if (recognitionNote.trim() !== "") {
        await addRecognitionNote({
          recipientId: selectedRecipient,
          guestId: user.hederaAccountId,
          message: recognitionNote,
        });
      }

      // Fetch updated account details to refresh balance
      const data = await fetchAccountDetails(user.hederaAccountId);
      setBalance(data.balance.hbarBalance); // Update the balance with the new value

      setSuccess("Tip and recognition note submitted successfully!");
      setAmount("");
      setRecognitionNote("");
      setSelectedRecipient("");
      setSelectedCompany("");
      setStaffCount(0);
    } catch (err) {
      console.error("Error sending tip:", err);
      if (err.response && err.response.data && err.response.data.error) {
        // Display specific error from backend
        setError(err.response.data.error);
      } else {
        // Default error message for unknown issues
        setError("Failed to send the tip. Please try again later.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h1 className="text-3xl font-bold mb-4">Welcome, {user.username}</h1>
      <p className="mb-4">Your Hedera Account ID: {user.hederaAccountId}</p>
      <h2>Your Balance: {balance.toFixed(2)} HBAR</h2>

      {error && (
        <div className="text-center p-4 bg-yellow-100 text-yellow-700 rounded">
          <p>{error}</p>
        </div>
      )}

      {deposits.length === 0 && outgoingTransactions.length === 0 && (
        <div className="text-center p-4 bg-blue-100 text-blue-700 rounded">
          <p>
            No transactions found for this account. Start by tipping a staff
            member or team.
          </p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="bg-white p-6 rounded shadow">
        <h2 className="text-xl font-bold mb-4">
          Send a Tip and Add Recognition
        </h2>
        {error && <p className="text-red-500 mb-4">{error}</p>}
        {success && <p className="text-green-500 mb-4">{success}</p>}

        <div className="mb-4">
          <label className="block font-bold mb-2">Select Tip Type</label>
          <label className="inline-flex items-center mr-4">
            <input
              type="radio"
              name="tipType"
              value="individual"
              checked={tipType === "individual"}
              onChange={() => setTipType("individual")}
              className="form-radio"
            />
            <span className="ml-2">Individual</span>
          </label>
          <label className="inline-flex items-center">
            <input
              type="radio"
              name="tipType"
              value="team"
              checked={tipType === "team"}
              onChange={() => setTipType("team")}
              className="form-radio"
            />
            <span className="ml-2">Team</span>
          </label>
        </div>

        {tipType === "team" && (
          <div className="mb-4">
            <label className="block font-bold mb-2">Select Team</label>
            <select
              value={selectedCompany}
              onChange={(e) => {
                const companyId = e.target.value;
                setSelectedCompany(companyId);
                const selectedTeam = teamList.find(
                  (team) => team._id === companyId
                );
                setSelectedRecipient(selectedTeam?.hederaAccountId || "");
                if (companyId) fetchActiveStaff(companyId);
              }}
              className="w-full border rounded px-3 py-2"
              required
            >
              <option value="">Select a Team</option>
              {teamList.map((team) => (
                <option key={team._id} value={team._id}>
                  {team.name} - {team.hederaAccountId}
                </option>
              ))}
            </select>
          </div>
        )}

        {/* Display Staff Count */}
        {tipType === "team" && staffCount > 0 && (
          <p className="text-gray-700 mb-4">
            Total Active Staff Members: <strong>{staffCount}</strong>
          </p>
        )}

        {tipType === "individual" && (
          <div className="mb-4">
            <label className="block font-bold mb-2">Select Staff Member</label>
            <select
              value={selectedRecipient}
              onChange={(e) => setSelectedRecipient(e.target.value)}
              className="w-full border rounded px-3 py-2"
              required
            >
              <option value="">Select Staff</option>
              {teamList
                .filter((team) => team.staff && team.staff.length > 0) // Ensure team has staff
                .flatMap((team) =>
                  team.staff
                    .filter((staff) => staff.status === "active") // Filter active staff
                    .map((staff) => (
                      <option key={staff._id} value={staff.hederaAccountId}>
                        {staff.username} - {staff.hederaAccountId}
                      </option>
                    ))
                )}
            </select>
          </div>
        )}

        <div className="mb-4">
          <label className="block font-bold mb-2">Tip Amount (HBAR)</label>
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="w-full border rounded px-3 py-2"
            placeholder="Enter amount"
            required
          />
        </div>

        <div className="mb-4">
          <label className="block font-bold mb-2">
            Recognition Note (Optional)
          </label>
          <textarea
            value={recognitionNote}
            onChange={(e) => setRecognitionNote(e.target.value)}
            className="w-full border rounded px-3 py-2"
            placeholder="Write a recognition note..."
          />
        </div>

        <Button
          type="submit"
          className={`w-full py-2 px-4 rounded text-white ${
            loading ? "bg-gray-400" : " hover:bg-[#F5EFE7]"
          }`}
          disabled={loading}
        >
          {loading ? "Processing..." : "Submit"}
        </Button>
      </form>

      {loading ? (
        <div className="text-center p-6">
          <p className="text-blue-500 animate-pulse">
            Loading your account details...
          </p>
        </div>
      ) : (
        <>
          {/* Deposit Transactions */}
          <section>
            <h2 className="text-xl font-bold mb-4">Deposit Transactions</h2>
            <div className="bg-white rounded shadow p-6">
              {deposits.length > 0 ? (
                <ul>
                  {deposits.map((tx) => (
                    <li key={tx.id} className="mb-4 border-b pb-2">
                      <p>
                        <strong>Transaction ID:</strong> {tx.id}
                      </p>
                      <p>
                        <strong>Sender:</strong> {tx.sender}
                      </p>
                      <p>
                        <strong>Amount Deposited:</strong> {tx.amount} ℏ
                      </p>
                      <p>
                        <strong>Timestamp:</strong> {tx.timestamp}
                      </p>
                    </li>
                  ))}
                </ul>
              ) : (
                <p>No deposits found.</p>
              )}
            </div>
          </section>

          {/* Outgoing Transactions */}
          <section>
            <h2 className="text-xl font-bold mb-4">Outgoing Transactions</h2>
            <div className="bg-white rounded shadow p-6">
              {outgoingTransactions.length > 0 ? (
                <ul>
                  {outgoingTransactions.map((tx) => (
                    <li key={tx.id} className="mb-4 border-b pb-2">
                      <p>
                        <strong>Transaction ID:</strong> {tx.id}
                      </p>
                      <p>
                        <strong>Receiver:</strong> {tx.receiver}
                      </p>
                      <p>
                        <strong>Amount Sent:</strong> {tx.amount} ℏ
                      </p>
                      <p>
                        <strong>Timestamp:</strong> {tx.timestamp}
                      </p>
                    </li>
                  ))}
                </ul>
              ) : (
                <p>No outgoing transactions found.</p>
              )}
            </div>
          </section>
        </>
      )}
    </div>
  );
};

export default GuestDashboard;
