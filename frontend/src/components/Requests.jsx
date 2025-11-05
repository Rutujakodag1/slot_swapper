import React, { useEffect, useState } from "react";
import axiosInstance from "../axiosConfig";

export default function Requests() {
  const [incoming, setIncoming] = useState([]);
  const [outgoing, setOutgoing] = useState([]);

  const fetchRequests = async () => {
    try {
      const res = await axiosInstance.get("/users/my-swap-requests/");
      setIncoming(res.data.incoming);
      setOutgoing(res.data.outgoing);
    } catch (err) {
      console.error("Error fetching requests:", err);
    }
  };

  const handleResponse = async (id, accept) => {
    try {
      await axiosInstance.post(`/users/swap-response/${id}/`, { accept });
      alert(accept ? "Swap Accepted!" : "Swap Rejected!");
      fetchRequests();
    } catch (err) {
      console.error("Error responding:", err);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">Swap Requests</h2>

      <div className="mb-6">
        <h3 className="text-xl font-semibold mb-2">Incoming Requests</h3>
        {incoming.length === 0 && <p>No incoming requests.</p>}
        {incoming.map((req) => (
          <div
            key={req.id}
            className="border p-2 mb-2 flex justify-between items-center"
          >
            <span>
              {req.from_user.username} wants to swap their "{req.my_slot.title}" with your "{req.their_slot.title}"
            </span>
            <div className="flex gap-2">
              <button
                className="bg-green-500 text-white px-2 py-1 rounded"
                onClick={() => handleResponse(req.id, true)}
              >
                Accept
              </button>
              <button
                className="bg-red-500 text-white px-2 py-1 rounded"
                onClick={() => handleResponse(req.id, false)}
              >
                Reject
              </button>
            </div>
          </div>
        ))}
      </div>

      <div>
        <h3 className="text-xl font-semibold mb-2">Outgoing Requests</h3>
        {outgoing.length === 0 && <p>No outgoing requests.</p>}
        {outgoing.map((req) => (
          <div key={req.id} className="border p-2 mb-2">
            You requested to swap "{req.my_slot.title}" with {req.to_user.username}'s "{req.their_slot.title}" → {req.status}
          </div>
        ))}
      </div>
    </div>
  );
}
