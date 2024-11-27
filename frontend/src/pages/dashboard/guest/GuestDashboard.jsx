import { useState, useEffect } from "react";
import useAuth from "../../../hooks/useAuth";
import { sendIndividualTip, sendTeamTip } from "../../../api/transactionApi";
import { getAllCompanies, getActiveStaff } from "../../../api/companyApi";

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
  const handleTipSubmit = async (e) => {
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

      setSuccess("Tip sent successfully!");
      setAmount("");
      setRecognitionNote("");
      setSelectedRecipient("");
      setSelectedCompany("");
      setStaffCount(0);
    } catch (err) {
      console.error("Error sending tip:", err);
      setError("Failed to send the tip. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h1 className="text-3xl font-bold mb-4">Welcome, {user.username}</h1>
      <p className="mb-4">Your Hedera Account ID: {user.hederaAccountId}</p>

      <form onSubmit={handleTipSubmit} className="bg-white p-6 rounded shadow">
        <h2 className="text-xl font-bold mb-4">Send a Tip</h2>
        {error && <p className="text-red-500 mb-4">{error}</p>}
        {success && <p className="text-green-500 mb-4">{success}</p>}

        {/* Tip Type Selection */}
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

        {/* Team Selection */}
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
                if (companyId) fetchActiveStaff(companyId); // Fetch active staff when a team is selected
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

        {/* Recipient Selection */}
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

        {/* Tip Amount */}
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

        {/* Recognition Note */}
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

        <button
          type="submit"
          className={`w-full py-2 px-4 rounded text-white ${
            loading ? "bg-gray-400" : "bg-blue-500 hover:bg-blue-600"
          }`}
          disabled={loading}
        >
          {loading ? "Sending Tip..." : "Send Tip"}
        </button>
      </form>
    </div>
  );
};

export default GuestDashboard;
