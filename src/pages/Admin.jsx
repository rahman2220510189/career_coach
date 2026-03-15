import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import instance from "../utils/axios";

const Admin = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("dashboard");
  const [stats, setStats] = useState(null);
  const [users, setUsers] = useState([]);
  const [analyses, setAnalyses] = useState([]);
  const [interviews, setInterviews] = useState([]);
  const [cvs, setCvs] = useState([]);
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user?.role !== "admin") navigate("/");
  }, [user, navigate]);

  useEffect(() => {
    fetchData(activeTab);
  }, [activeTab]);

  const fetchData = async (tab) => {
    setLoading(true);
    try {
      if (tab === "dashboard") {
        const res = await instance.get("/admin/stats");
        setStats(res.data.data);
      } else if (tab === "users") {
        const res = await instance.get("/admin/users");
        setUsers(res.data.data);
      } else if (tab === "analyses") {
        const res = await instance.get("/admin/analyses");
        setAnalyses(res.data.data);
      } else if (tab === "interviews") {
        const res = await instance.get("/admin/interviews");
        setInterviews(res.data.data);
      } else if (tab === "cvs") {
        const res = await instance.get("/admin/cvs");
        setCvs(res.data.data);
      } else if (tab === "contacts") {
        const res = await instance.get("/admin/contacts");
        setContacts(res.data.data);
      }
    } catch (err) {
      console.error("Fetch Error:", err.message);
    }
    setLoading(false);
  };

  const deleteUser = async (id) => {
    if (!window.confirm("Are you sure?")) return;
    try {
      await instance.delete(`/admin/user/${id}`);
      setUsers((prev) => prev.filter((u) => u._id !== id));
    } catch (err) {
      console.error("Delete Error:", err.message);
    }
  };

  const changeRole = async (id, role) => {
    try {
      await instance.patch(`/admin/user/${id}/role`, { role });
      setUsers((prev) =>
        prev.map((u) => (u._id === id ? { ...u, role } : u))
      );
    } catch (err) {
      console.error("Role Error:", err.message);
    }
  };

  const markRead = async (id) => {
    try {
      await instance.patch(`/admin/contact/${id}/read`);
      setContacts((prev) =>
        prev.map((c) => (c._id === id ? { ...c, status: "read" } : c))
      );
    } catch (err) {
      console.error("Mark Read Error:", err.message);
    }
  };

  const formatDate = (date) =>
    new Date(date).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });

  const scoreBadge = (score) => {
    if (!score) return <span className="text-xs text-white/20">—</span>;
    if (score >= 70) return <span className="text-xs text-green-400 bg-green-500/10 border border-green-500/20 px-2 py-0.5 rounded-full">{score}%</span>;
    if (score >= 40) return <span className="text-xs text-yellow-400 bg-yellow-500/10 border border-yellow-500/20 px-2 py-0.5 rounded-full">{score}%</span>;
    return <span className="text-xs text-red-400 bg-red-500/10 border border-red-500/20 px-2 py-0.5 rounded-full">{score}%</span>;
  };

  const navItems = [
    { id: "dashboard", icon: "📊", label: "Dashboard" },
    { id: "users", icon: "👥", label: "Users", count: stats?.totalUsers },
    { id: "analyses", icon: "🔍", label: "Analyses", count: stats?.totalAnalyses },
    { id: "interviews", icon: "🎤", label: "Interviews", count: stats?.totalInterviews },
    { id: "cvs", icon: "📝", label: "CVs", count: stats?.totalCVs },
    { id: "contacts", icon: "📧", label: "Messages", count: stats?.unreadMessages, alert: stats?.unreadMessages > 0 },
  ];

  const thCls = "px-5 py-3 text-left text-[10px] font-medium tracking-[0.8px] uppercase text-white/20 border-b border-white/[0.06] bg-white/[0.02]";
  const tdCls = "px-5 py-3 text-xs text-white/50 border-b border-white/[0.04]";

  return (
    <div className="flex min-h-screen bg-[#080808]">

      {/* ── SIDEBAR ── */}
      <div className="w-[220px] flex-shrink-0 bg-[#0a0a0a] border-r border-white/[0.07] p-3 flex flex-col gap-1 hidden md:flex">

        {/* Logo */}
        <div className="flex items-center gap-2 px-2 pb-5 border-b border-white/[0.06] mb-2">
          <div className="w-7 h-7 rounded-lg bg-white flex items-center justify-center text-sm">🎯</div>
          <div>
            <p className="text-sm font-medium text-white/70">CareerCoach</p>
            <p className="text-[9px] text-white/25 bg-white/[0.06] border border-white/[0.08] px-1.5 py-0.5 rounded w-fit mt-0.5">Admin</p>
          </div>
        </div>

        {/* Nav */}
        {navItems.map((item) => (
          <button
            key={item.id}
            onClick={() => setActiveTab(item.id)}
            className={`flex items-center gap-2.5 px-2.5 py-2 rounded-lg text-sm transition-all text-left ${activeTab === item.id ? "bg-white/[0.07] text-white" : "text-white/30 hover:text-white/60 hover:bg-white/[0.04]"}`}
          >
            <span className="text-sm">{item.icon}</span>
            <span className="flex-1">{item.label}</span>
            {item.count !== undefined && (
              <span className={`text-[10px] px-1.5 py-0.5 rounded-lg font-medium ${item.alert ? "bg-red-500/15 text-red-400" : "bg-white/[0.06] text-white/25"}`}>
                {item.count}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* ── MAIN ── */}
      <div className="flex-1 overflow-auto">

        {/* Topbar */}
        <div className="px-6 py-4 border-b border-white/[0.06] flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-white capitalize">{activeTab}</p>
            <p className="text-xs text-white/25 mt-0.5">Welcome back, {user?.name}</p>
          </div>

          {/* Mobile tabs */}
          <div className="flex gap-2 md:hidden overflow-x-auto">
            {navItems.map((item) => (
              <button key={item.id} onClick={() => setActiveTab(item.id)}
                className={`flex-shrink-0 px-3 py-1.5 rounded-lg text-xs transition-all ${activeTab === item.id ? "bg-white/[0.07] text-white" : "text-white/30"}`}>
                {item.icon}
              </button>
            ))}
          </div>
        </div>

        <div className="p-4 sm:p-6">

          {loading && (
            <div className="flex items-center justify-center py-20">
              <div className="w-6 h-6 border-2 border-white/10 border-t-white/40 rounded-full animate-spin" />
            </div>
          )}

          {!loading && (
            <>
              {/* ── DASHBOARD ── */}
              {activeTab === "dashboard" && stats && (
                <div>
                  <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 mb-6">
                    {[
                      { label: "Total Users", value: stats.totalUsers },
                      { label: "CV Analyses", value: stats.totalAnalyses },
                      { label: "Interviews", value: stats.totalInterviews },
                      { label: "Completed", value: stats.completedInterviews },
                      { label: "CVs Built", value: stats.totalCVs },
                      { label: "Unread Msgs", value: stats.unreadMessages, alert: stats.unreadMessages > 0 },
                    ].map((stat, i) => (
                      <div key={i} className="bg-[#0f0f0f] border border-white/[0.07] rounded-xl p-4">
                        <p className="text-[11px] text-white/25 mb-2">{stat.label}</p>
                        <p className={`text-2xl font-medium ${stat.alert ? "text-red-400" : "text-white"}`}>
                          {stat.value}
                        </p>
                      </div>
                    ))}
                  </div>

                  <div className="bg-[#0f0f0f] border border-white/[0.07] rounded-xl p-5">
                    <p className="text-sm font-medium text-white/60 mb-1">Quick Actions</p>
                    <p className="text-xs text-white/25 mb-4">Common admin tasks</p>
                    <div className="flex flex-wrap gap-2">
                      {[
                        { label: "View Users", tab: "users" },
                        { label: "View Analyses", tab: "analyses" },
                        { label: "View Messages", tab: "contacts" },
                      ].map((action, i) => (
                        <button key={i} onClick={() => setActiveTab(action.tab)}
                          className="px-4 py-2 rounded-lg text-xs text-white/40 border border-white/[0.08] hover:text-white/60 hover:border-white/15 transition-all">
                          {action.label} →
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* ── USERS ── */}
              {activeTab === "users" && (
                <div className="bg-[#0f0f0f] border border-white/[0.07] rounded-xl overflow-hidden">
                  <div className="px-5 py-4 border-b border-white/[0.06] flex items-center justify-between">
                    <p className="text-sm font-medium text-white/60">All Users</p>
                    <p className="text-xs text-white/25">{users.length} total</p>
                  </div>
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr>
                          <th className={thCls}>Name</th>
                          <th className={thCls}>Email</th>
                          <th className={thCls}>Role</th>
                          <th className={thCls}>Joined</th>
                          <th className={thCls}>Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {users.map((u) => (
                          <tr key={u._id} className="hover:bg-white/[0.02] transition-colors">
                            <td className={`${tdCls} text-white/70 font-medium`}>{u.name}</td>
                            <td className={tdCls}>{u.email}</td>
                            <td className={tdCls}>
                              <span className={`text-[10px] font-medium px-2 py-0.5 rounded-full border ${u.role === "admin" ? "bg-green-500/10 text-green-400 border-green-500/20" : "bg-white/[0.06] text-white/30 border-white/[0.08]"}`}>
                                {u.role}
                              </span>
                            </td>
                            <td className={tdCls}>{formatDate(u.createdAt)}</td>
                            <td className={tdCls}>
                              <div className="flex gap-2">
                                <button
                                  onClick={() => changeRole(u._id, u.role === "admin" ? "user" : "admin")}
                                  className="text-[11px] text-white/25 border border-white/[0.08] px-2.5 py-1 rounded-lg hover:text-white/60 hover:border-white/20 transition-all"
                                >
                                  {u.role === "admin" ? "Remove Admin" : "Make Admin"}
                                </button>
                                <button
                                  onClick={() => deleteUser(u._id)}
                                  className="text-[11px] text-white/25 border border-white/[0.08] px-2.5 py-1 rounded-lg hover:text-red-400 hover:border-red-500/30 transition-all"
                                >
                                  Delete
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* ── ANALYSES ── */}
              {activeTab === "analyses" && (
                <div className="bg-[#0f0f0f] border border-white/[0.07] rounded-xl overflow-hidden">
                  <div className="px-5 py-4 border-b border-white/[0.06] flex items-center justify-between">
                    <p className="text-sm font-medium text-white/60">All Analyses</p>
                    <p className="text-xs text-white/25">{analyses.length} total</p>
                  </div>
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr>
                          <th className={thCls}>Candidate</th>
                          <th className={thCls}>Job Title</th>
                          <th className={thCls}>Match Score</th>
                          <th className={thCls}>Date</th>
                        </tr>
                      </thead>
                      <tbody>
                        {analyses.map((a) => (
                          <tr key={a._id} className="hover:bg-white/[0.02] transition-colors">
                            <td className={`${tdCls} text-white/70 font-medium`}>{a.candidateName}</td>
                            <td className={tdCls}>{a.jobTitle}</td>
                            <td className={tdCls}>{scoreBadge(a.matchScore)}</td>
                            <td className={tdCls}>{formatDate(a.createdAt)}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* ── INTERVIEWS ── */}
              {activeTab === "interviews" && (
                <div className="bg-[#0f0f0f] border border-white/[0.07] rounded-xl overflow-hidden">
                  <div className="px-5 py-4 border-b border-white/[0.06] flex items-center justify-between">
                    <p className="text-sm font-medium text-white/60">All Interviews</p>
                    <p className="text-xs text-white/25">{interviews.length} total</p>
                  </div>
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr>
                          <th className={thCls}>Candidate</th>
                          <th className={thCls}>Job Title</th>
                          <th className={thCls}>Score</th>
                          <th className={thCls}>Status</th>
                          <th className={thCls}>Date</th>
                        </tr>
                      </thead>
                      <tbody>
                        {interviews.map((iv) => (
                          <tr key={iv._id} className="hover:bg-white/[0.02] transition-colors">
                            <td className={`${tdCls} text-white/70 font-medium`}>{iv.candidateName}</td>
                            <td className={tdCls}>{iv.jobTitle}</td>
                            <td className={tdCls}>{scoreBadge(iv.finalScore)}</td>
                            <td className={tdCls}>
                              <span className={`text-[10px] font-medium px-2 py-0.5 rounded-full border ${iv.status === "completed" ? "bg-green-500/10 text-green-400 border-green-500/20" : "bg-yellow-500/10 text-yellow-400 border-yellow-500/20"}`}>
                                {iv.status}
                              </span>
                            </td>
                            <td className={tdCls}>{formatDate(iv.createdAt)}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* ── CVS ── */}
              {activeTab === "cvs" && (
                <div className="bg-[#0f0f0f] border border-white/[0.07] rounded-xl overflow-hidden">
                  <div className="px-5 py-4 border-b border-white/[0.06] flex items-center justify-between">
                    <p className="text-sm font-medium text-white/60">All CVs</p>
                    <p className="text-xs text-white/25">{cvs.length} total</p>
                  </div>
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr>
                          <th className={thCls}>Name</th>
                          <th className={thCls}>Job Title</th>
                          <th className={thCls}>ATS Score</th>
                          <th className={thCls}>Date</th>
                        </tr>
                      </thead>
                      <tbody>
                        {cvs.map((cv) => (
                          <tr key={cv._id} className="hover:bg-white/[0.02] transition-colors">
                            <td className={`${tdCls} text-white/70 font-medium`}>{cv.personalInfo?.name}</td>
                            <td className={tdCls}>{cv.personalInfo?.linkedin || "—"}</td>
                            <td className={tdCls}>{scoreBadge(cv.atsScore)}</td>
                            <td className={tdCls}>{formatDate(cv.createdAt)}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* ── CONTACTS ── */}
              {activeTab === "contacts" && (
                <div className="bg-[#0f0f0f] border border-white/[0.07] rounded-xl overflow-hidden">
                  <div className="px-5 py-4 border-b border-white/[0.06] flex items-center justify-between">
                    <p className="text-sm font-medium text-white/60">All Messages</p>
                    <p className="text-xs text-white/25">{contacts.filter(c => c.status === "unread").length} unread</p>
                  </div>
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr>
                          <th className={thCls}>Name</th>
                          <th className={thCls}>Email</th>
                          <th className={thCls}>Subject</th>
                          <th className={thCls}>Message</th>
                          <th className={thCls}>Status</th>
                          <th className={thCls}>Date</th>
                          <th className={thCls}>Action</th>
                        </tr>
                      </thead>
                      <tbody>
                        {contacts.map((c) => (
                          <tr key={c._id} className="hover:bg-white/[0.02] transition-colors">
                            <td className={`${tdCls} text-white/70 font-medium`}>{c.name}</td>
                            <td className={tdCls}>{c.email}</td>
                            <td className={tdCls}>{c.subject}</td>
                            <td className={`${tdCls} max-w-[200px] truncate`}>{c.message}</td>
                            <td className={tdCls}>
                              <span className={`text-[10px] font-medium px-2 py-0.5 rounded-full border ${c.status === "unread" ? "bg-red-500/10 text-red-400 border-red-500/20" : "bg-white/[0.06] text-white/30 border-white/[0.08]"}`}>
                                {c.status}
                              </span>
                            </td>
                            <td className={tdCls}>{formatDate(c.createdAt)}</td>
                            <td className={tdCls}>
                              {c.status === "unread" && (
                                <button
                                  onClick={() => markRead(c._id)}
                                  className="text-[11px] text-white/25 border border-white/[0.08] px-2.5 py-1 rounded-lg hover:text-white/60 hover:border-white/20 transition-all"
                                >
                                  Mark Read
                                </button>
                              )}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Admin;