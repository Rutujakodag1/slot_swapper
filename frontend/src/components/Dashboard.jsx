import React, { useEffect, useState } from "react";
import axiosInstance from "../axiosConfig";
import {
  Calendar,
  dateFnsLocalizer,
} from "react-big-calendar";
import format from "date-fns/format";
import parse from "date-fns/parse";
import startOfWeek from "date-fns/startOfWeek";
import getDay from "date-fns/getDay";
import "react-big-calendar/lib/css/react-big-calendar.css";
import { enIN } from "date-fns/locale";

// Calendar setup
const locales = { "en-IN": enIN };
const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek,
  getDay,
  locales,
});

export default function Dashboard() {
  const [events, setEvents] = useState([]);
  const [form, setForm] = useState({ title: "", startTime: "", endTime: "" });

  // Fetch events
  const fetchEvents = async () => {
    try {
      const res = await axiosInstance.get("/users/events/");
      setEvents(res.data);
    } catch (err) {
      console.error("Error fetching events:", err);
    }
  };

  // Add event
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axiosInstance.post("/users/events/", form);
      setForm({ title: "", startTime: "", endTime: "" });
      fetchEvents();
    } catch (err) {
      console.error("Error creating event:", err);
    }
  };

  // Make event swappable
  const makeSwappable = async (id) => {
    try {
      await axiosInstance.patch(`/users/events/${id}/`, { status: "SWAPPABLE" });
      fetchEvents();
    } catch (err) {
      console.error("Error updating event:", err);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  // Convert to calendar format
  const formattedEvents = events.map((ev) => ({
    title: ev.title,
    start: new Date(ev.startTime),
    end: new Date(ev.endTime),
  }));

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <h2 className="text-3xl font-bold mb-6 text-blue-700 flex items-center gap-2">
        🗓️ My Events
      </h2>

      {/* Add Event Form */}
      <form
        onSubmit={handleSubmit}
        className="bg-white shadow-md rounded-lg p-4 mb-8 flex flex-wrap items-center gap-3"
      >
        <input
          placeholder="Event Title"
          value={form.title}
          onChange={(e) => setForm({ ...form, title: e.target.value })}
          className="border rounded-md px-3 py-2 flex-1 focus:ring-2 focus:ring-blue-400 outline-none"
        />
        <input
          type="datetime-local"
          value={form.startTime}
          onChange={(e) => setForm({ ...form, startTime: e.target.value })}
          className="border rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-400 outline-none"
        />
        <input
          type="datetime-local"
          value={form.endTime}
          onChange={(e) => setForm({ ...form, endTime: e.target.value })}
          className="border rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-400 outline-none"
        />
        <button className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-lg shadow transition-all">
          Add
        </button>
      </form>

      {/* Calendar + List Layout */}
      <div className="grid md:grid-cols-2 gap-6">
        {/* Calendar View */}
        <div className="bg-white rounded-lg shadow-md p-4">
          <h3 className="text-xl font-semibold mb-3 text-blue-600">Calendar View</h3>
          <div className="h-[500px]">
            <Calendar
              localizer={localizer}
              events={formattedEvents}
              startAccessor="start"
              endAccessor="end"
              style={{ height: "100%" }}
            />
          </div>
        </div>

        {/* List View */}
        <div className="bg-white rounded-lg shadow-md p-4 overflow-y-auto">
          <h3 className="text-xl font-semibold mb-3 text-blue-600">List View</h3>
          {events.length > 0 ? (
            events.map((ev) => (
              <div
                key={ev.id}
                className="border-l-4 border-blue-500 bg-gray-50 shadow-sm rounded-lg p-3 mb-3 flex justify-between items-center hover:shadow-md transition-all"
              >
                <div>
                  <h4 className="text-lg font-semibold">{ev.title}</h4>
                  <p className="text-sm text-gray-600">
                    {new Date(ev.startTime).toLocaleString()} -{" "}
                    {new Date(ev.endTime).toLocaleString()}
                  </p>
                  <p className="text-xs mt-1 italic text-gray-500">
                    Status: {ev.status}
                  </p>
                </div>
                {ev.status === "BUSY" && (
                  <button
                    onClick={() => makeSwappable(ev.id)}
                    className="bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded text-sm"
                  >
                    Make Swappable
                  </button>
                )}
              </div>
            ))
          ) : (
            <p className="text-gray-500 italic">No events yet.</p>
          )}
        </div>
      </div>
    </div>
  );
}
