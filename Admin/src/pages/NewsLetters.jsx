import React, { useEffect, useState } from "react";
import axios from "axios";

function NewsLetters() {
  const [subscribers, setSubscribers] = useState([]);
  const [message, setMessage] = useState("");
  const [subject, setSubject] = useState("Update from Bislig iCenter");
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);

  useEffect(() => {
    fetchSubscribers();
  }, []);

  const fetchSubscribers = async () => {
    try {
      const { data } = await axios.get("http://localhost:5000/api/newsletter/subscribers", {
        withCredentials: true,
      });
      setSubscribers(data);
    } catch (err) {
      console.error(err);
      alert("Failed to load subscribers.");
    } finally {
      setFetching(false);
    }
  };

  const handleSend = async () => {
    if (!message.trim() || !subject.trim()) {
      alert("Subject and message are required.");
      return;
    }
    if (subscribers.length === 0) {
      alert("No subscribers found.");
      return;
    }

    setLoading(true);
    try {
      const { data } = await axios.post(
        "http://localhost:5000/api/newsletter/send",
        { subject, message },
        { withCredentials: true }
      );
      alert(data.message || "Newsletter sent successfully!");
      setMessage("");
    } catch (err) {
      console.error(err);
      alert("Failed to send newsletter.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-8">
      <h2 className="mb-6 text-2xl font-bold text-slate-800">News Letters</h2>

      <div className="mb-8 rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
        <h3 className="mb-4 text-lg font-semibold text-slate-700">Compose Newsletter</h3>
        
        <div className="mb-4">
          <label className="mb-1 block text-sm font-medium text-slate-600">Subject</label>
          <input
            type="text"
            className="w-full rounded-lg border border-slate-300 px-4 py-2 text-slate-800 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            placeholder="Email Subject"
          />
        </div>

        <div className="mb-4">
          <label className="mb-1 block text-sm font-medium text-slate-600">Message</label>
          <textarea
            className="w-full rounded-lg border border-slate-300 px-4 py-2 text-slate-800 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
            rows="5"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Type your newsletter message here..."
          ></textarea>
        </div>

        <button
          onClick={handleSend}
          disabled={loading || subscribers.length === 0}
          className="rounded-lg bg-blue-600 px-6 py-2.5 font-medium text-white transition-colors hover:bg-blue-700 disabled:opacity-50"
        >
          {loading ? "Sending..." : "Send to All Subscribers"}
        </button>
      </div>

      <div className="rounded-xl border border-slate-200 bg-white shadow-sm overflow-hidden">
        <div className="border-b border-slate-200 bg-slate-50 px-6 py-4">
          <h3 className="text-lg font-semibold text-slate-700">Subscribed Emails ({subscribers.length})</h3>
        </div>
        
        {fetching ? (
          <div className="p-6 text-center text-slate-500">Loading subscribers...</div>
        ) : subscribers.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-slate-600">
              <thead className="bg-slate-50 text-xs uppercase text-slate-500 border-b border-slate-200">
                <tr>
                  <th className="px-6 py-4 font-medium">Email</th>
                  <th className="px-6 py-4 font-medium">Subscribed At</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {subscribers.map((sub) => (
                  <tr key={sub._id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-6 py-4">{sub.email}</td>
                    <td className="px-6 py-4">{new Date(sub.subscribedAt).toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="p-6 text-center text-slate-500">No subscribers yet.</div>
        )}
      </div>
    </div>
  );
}

export default NewsLetters;
