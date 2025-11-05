import React, { useEffect, useState } from "react";
import axiosInstance from "../axiosConfig";

export default function Marketplace() {
  const [swappableSlots, setSwappableSlots] = useState([]);
  const [mySlots, setMySlots] = useState([]);
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [mySelectedSlot, setMySelectedSlot] = useState("");

  // Fetch others' swappable slots
  const fetchSwappableSlots = async () => {
    try {
      const res = await axiosInstance.get("/users/swappable-slots/");
      setSwappableSlots(res.data);
    } catch (err) {
      console.error("Error fetching swappable slots:", err);
    }
  };

  // Fetch my own swappable slots (for modal dropdown)
  const fetchMySwappableSlots = async () => {
    try {
      const res = await axiosInstance.get("/users/events/");
      const mine = res.data.filter((e) => e.status === "SWAPPABLE");
      setMySlots(mine);
    } catch (err) {
      console.error("Error fetching my slots:", err);
    }
  };

  useEffect(() => {
    fetchSwappableSlots();
    fetchMySwappableSlots();
  }, []);

  // Send swap request
  const handleSwapRequest = async () => {
    try {
      await axiosInstance.post("/users/swap-request/", {
        mySlotId: mySelectedSlot,
        theirSlotId: selectedSlot.id,
      });
      alert("Swap request sent!");
      setShowModal(false);
      fetchSwappableSlots(); // refresh state
    } catch (err) {
      console.error("Error requesting swap:", err);
      alert("Failed to send swap request.");
    }
  };

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">Swappable Slots</h2>

      {swappableSlots.length === 0 && <p>No available slots.</p>}

      {swappableSlots.map((slot) => (
        <div
          key={slot.id}
          className="border p-3 mb-2 flex justify-between items-center"
        >
          <div>
            <p className="font-semibold">{slot.title}</p>
            <p>
              {new Date(slot.startTime).toLocaleString()} -{" "}
              {new Date(slot.endTime).toLocaleString()}
            </p>
          </div>
          <button
            className="bg-blue-600 text-white px-3 py-1 rounded"
            onClick={() => {
              setSelectedSlot(slot);
              setShowModal(true);
            }}
          >
            Request Swap
          </button>
        </div>
      ))}

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white rounded p-4 w-96">
            <h3 className="font-bold mb-2">
              Offer one of your swappable slots
            </h3>
            <select
              className="border w-full p-2 mb-3"
              onChange={(e) => setMySelectedSlot(e.target.value)}
              value={mySelectedSlot}
            >
              <option value="">-- Select your slot --</option>
              {mySlots.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.title} ({new Date(s.startTime).toLocaleString()})
                </option>
              ))}
            </select>
            <div className="flex justify-end gap-2">
              <button
                className="bg-gray-400 text-white px-3 py-1 rounded"
                onClick={() => setShowModal(false)}
              >
                Cancel
              </button>
              <button
                className="bg-green-600 text-white px-3 py-1 rounded"
                disabled={!mySelectedSlot}
                onClick={handleSwapRequest}
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
