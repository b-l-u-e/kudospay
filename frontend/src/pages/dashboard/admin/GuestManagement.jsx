import { useState } from "react";
import { getGuestById, updateGuest, deleteGuest } from "../../../api/guestApi";

const GuestManagement = () => {
    const [guest, setGuest] = useState(null);
    const [guestId, setGuestId] = useState("");
    const [error, setError] = useState("");

    const handleFetch = async () => {
        try {
            const response = await getGuestById(guestId);
            setGuest(response.data);
        } catch (err) {
            setError(err.response?.data?.error || "Failed to fetch guest.");
        }
    };

    const handleUpdate = async () => {
        try {
            await updateGuest(guestId, { username: guest.username });
            alert("Guest updated successfully!");
        } catch (err) {
            setError(err.response?.data?.error || "Failed to update guest.");
        }
    };

    const handleDelete = async () => {
        try {
            await deleteGuest(guestId);
            alert("Guest deleted successfully!");
            setGuest(null);
        } catch (err) {
            setError(err.response?.data?.error || "Failed to delete guest.");
        }
    };

    return (
        <div>
            <h1>Guest Management</h1>
            {error && <p className="text-red-500">{error}</p>}
            <input
                type="text"
                placeholder="Enter Guest ID"
                value={guestId}
                onChange={(e) => setGuestId(e.target.value)}
            />
            <button onClick={handleFetch}>Fetch Guest</button>
            {guest && (
                <div>
                    <h2>{guest.username}</h2>
                    <button onClick={handleUpdate}>Update Guest</button>
                    <button onClick={handleDelete}>Delete Guest</button>
                </div>
            )}
        </div>
    );
};

export default GuestManagement;
