import React, { useEffect, useState } from "react";

const Users = () => {
  const [state, setState] = useState({ loading: true, users: [], pages: 1, page: 1 });
  const [filter, setFilter] = useState({ search: "", role: "" });
  const [error, setError] = useState("");

  const fetchUsers = async (page = 1) => {
    const token = localStorage.getItem("admin_token");
    setState((p) => ({ ...p, loading: true }));
    setError("");

    const query = new URLSearchParams({
      page,
      limit: 20,
      ...(filter.search && { search: filter.search }),
      ...(filter.role && { role: filter.role }),
    }).toString();

    const res = await fetch(`/api/admin/users?${query}`, {
      headers: token ? { Authorization: `Bearer ${token}` } : {},
    });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) {
      setState({ loading: false, users: [], pages: 1, page });
      setError(data?.message || `Request failed (${res.status})`);
      return;
    }
    setState({
      loading: false,
      users: data.users || [],
      pages: data.pages || 1,
      page: data.page || page,
    });
  };

  useEffect(() => {
    fetchUsers(1);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filter.role]);

  const updateRole = async (id, role) => {
    const token = localStorage.getItem("admin_token");
    await fetch(`/api/admin/users/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      body: JSON.stringify({ role }),
    });
    fetchUsers(state.page);
  };

  return (
    <div className="p-8 space-y-6">
      <div>
        <h2>Users</h2>
        <p className="text-myblack/70">Manage user roles.</p>
      </div>

      {error && (
        <div className="rounded-2xl bg-rose-50 p-4 text-sm text-rose-700 ring-1 ring-rose-100">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
        <input
          className="rounded-xl border border-myblack/10 bg-white px-4 py-3"
          placeholder="Search name/email..."
          value={filter.search}
          onChange={(e) => setFilter((p) => ({ ...p, search: e.target.value }))}
          onKeyDown={(e) => {
            if (e.key === "Enter") fetchUsers(1);
          }}
        />
        <select
          className="rounded-xl border border-myblack/10 bg-white px-4 py-3"
          value={filter.role}
          onChange={(e) => setFilter((p) => ({ ...p, role: e.target.value }))}
        >
          <option value="">All</option>
          <option value="user">User</option>
          <option value="admin">Admin</option>
        </select>
      </div>

      <div className="overflow-x-auto rounded-2xl bg-white shadow-sm ring-1 ring-black/5">
        <table className="min-w-full divide-y divide-slate-200">
          <thead className="bg-slate-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-semibold text-slate-500">Name</th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-slate-500">Email</th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-slate-500">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200">
            {state.loading ? (
              <tr>
                <td className="px-6 py-6" colSpan={3}>
                  Loading...
                </td>
              </tr>
            ) : state.users.length === 0 ? (
              <tr>
                <td className="px-6 py-6" colSpan={3}>
                  No users.
                </td>
              </tr>
            ) : (
              state.users.map((u) => (
                <tr key={u._id}>
                  <td className="px-6 py-4">
                    <div className="font-productSansReg text-myblack">{u.name}</div>
                    {u.username && (
                      <div className="text-xs text-myblack/60">@{u.username}</div>
                    )}
                  </td>
                  <td className="px-6 py-4 text-myblack/70">{u.email}</td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <span
                        className={`h-2.5 w-2.5 rounded-full ${
                          u.computedStatus === "active" ? "bg-emerald-500" : "bg-slate-400"
                        }`}
                      />
                      <span className="text-sm text-myblack/70">
                        {u.computedStatus === "active" ? "Active" : "Inactive"}
                      </span>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <div className="flex flex-wrap gap-2">
        {Array.from({ length: state.pages }, (_, i) => (
          <button
            key={i}
            onClick={() => fetchUsers(i + 1)}
            className={`rounded-full px-4 py-2 ${state.page === i + 1 ? "bg-blue-600 text-white" : "bg-white ring-1 ring-myblack/10 hover:ring-blue-500"}`}
          >
            {i + 1}
          </button>
        ))}
      </div>
    </div>
  );
};

export default Users;
