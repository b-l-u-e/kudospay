import { useState, useEffect } from "react";
import { sendIndividualTip } from "../../api/transactionApi"; // API for sending a tip
import { getAllStaff } from "../../api/staffApi"; // Fetch staff list
import { useAuth } from "../../hooks/useAuth";

const TipIndividual = () => {
  const { user } = useAuth();
  const [staffList, setStaffList] = useState([]);
  const [selectedStaff, setSelectedStaff] = useState(null);
  const [amount, setAmount] = useState("");
  const [note, setNote] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    const fetchStaff = async () => {
      try {
        const response = await getAllStaff(); // Fetch all staff members
        setStaffList(response.data);
      } catch (err) {
        setError("Failed to fetch staff members. Please try again.");
      }
    };
    fetchStaff();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await sendIndividualTip({
        guestId: user.hederaAccountId,
        staffId: selectedStaff.hederaAccountId,
        amount,
        note,
      });
      setSuccess("Tip sent successfully!");
    } catch (err) {
      setError(err.response?.data?.message || "Failed to send tip.");
    }
  };

  return (
    <div className="min-h-screen p-8 bg-gray-100">
      <h1 className="text-2xl font-bold mb-6">Tip an Individual Staff</h1>
      {error && <p className="text-red-500">{error}</p>}
      {success && <p className="text-green-500">{success}</p>}
      <form onSubmit={handleSubmit} className="space-y-4 bg-white p-4 shadow rounded">
        <div>
          <label className="block text-sm font-medium">Select Staff</label>
          <select
            onChange={(e) => setSelectedStaff(JSON.parse(e.target.value))}
            className="w-full mt-2 p-2 border rounded"
            required
          >
            <option value="">-- Select Staff --</option>
            {staffList.map((staff) => (
              <option key={staff._id} value={JSON.stringify(staff)}>
                {staff.username} (ID: {staff.hederaAccountId})
              </option>
            ))}
          </select>
        </div>
        {selectedStaff && (
          <div className="bg-gray-100 p-4 rounded">
            <p>
              <strong>Staff Hedera Account ID:</strong> {selectedStaff.hederaAccountId}
            </p>
          </div>
        )}
        <div>
          <label className="block text-sm font-medium">Amount (in HBAR)</label>
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="w-full mt-2 p-2 border rounded"
            placeholder="Enter amount"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium">Recognition Note (Optional)</label>
          <textarea
            value={note}
            onChange={(e) => setNote(e.target.value)}
            className="w-full mt-2 p-2 border rounded"
            placeholder="Say thank you!"
          />
        </div>
        <button
          type="submit"
          className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600"
        >
          Send Tip
        </button>
      </form>
    </div>
  );
};

export default TipIndividual;
