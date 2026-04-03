import React, { useEffect, useState } from "react";
import API from "../api/api";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
  Cell
} from "recharts";
import {
  FaServer,
  FaTools,
  FaCheckCircle,
  FaExclamationTriangle,
  FaChevronRight,
} from 'react-icons/fa';
import { useTheme } from "../context/ThemeContext";

export default function Dashboard() {
  const [stats, setStats] = useState(null);
  const [recent, setRecent] = useState([]);
  const { theme } = useTheme(); // Get current theme

  useEffect(() => {
    (async () => {
      try {
        const res = await API.get("/assets?sort_by=created_at&sort_direction=desc");
        const list = res.data;

        const total = list.length;
        const inUse = list.filter(a => a.status === "active").length;
        const maintenance = list.filter(a => a.status === "in-repair").length;
        const inactive = total - inUse - maintenance;

        setStats({ total, inUse, maintenance, inactive });
        setRecent(list.slice(0, 10)); // Top 10 recent
      } catch (err) {
        console.error(err);
        setStats({ total: 0, inUse: 0, maintenance: 0, inactive: 0 });
      }
    })();
  }, []);

  // Dynamic Chart Colors
  const data = [
    { name: "Active", value: stats?.inUse || 0, color: theme === 'dark' ? "#22d3ee" : "#3b82f6" }, // Cyan vs Blue
    { name: "Repair", value: stats?.maintenance || 0, color: theme === 'dark' ? "#f472b6" : "#f59e0b" }, // Pink vs Amber
    { name: "Inactive", value: stats?.inactive || 0, color: theme === 'dark' ? "#94a3b8" : "#cbd5e1" }  // Slate vs Light Gray
  ];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-8"
    >
      {/* Header */}
      <motion.div
        initial={{ y: -20 }}
        animate={{ y: 0 }}
        className="flex items-center justify-between"
      >
        <div>
          <h1 className="text-3xl font-bold text-slate-800 dark:text-white tracking-tight drop-shadow-sm dark:drop-shadow-md transition-colors duration-300">
            Overview
          </h1>
          <p className="text-slate-500 dark:text-slate-400 text-sm mt-1 transition-colors duration-300">Real-time asset telemetry</p>
        </div>
        <div className="flex gap-2">
          <span className="px-3 py-1 bg-blue-100 dark:bg-cyan-500/10 border border-blue-200 dark:border-cyan-500/30 rounded text-blue-600 dark:text-cyan-400 text-xs font-mono transition-colors duration-300">
            LIVE DATA
          </span>
        </div>
      </motion.div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
          {
            label: "Total Assets",
            value: stats?.total,
            icon: FaServer,
            gradient: "from-blue-600/20 to-blue-900/20",
            border: "border-blue-500/30",
            darkBorder: "dark:border-blue-500/30",
            text: "text-blue-600 dark:text-blue-400",
            glow: "group-hover:shadow-[0_0_20px_rgba(59,130,246,0.3)]",
            darkGlow: "dark:group-hover:shadow-[0_0_20px_rgba(59,130,246,0.3)]",
            bgLight: "bg-white border-slate-200"
          },
          {
            label: "Active Units",
            value: stats?.inUse,
            icon: FaCheckCircle,
            gradient: "from-cyan-600/20 to-cyan-900/20",
            border: "border-cyan-500/30",
            darkBorder: "dark:border-cyan-500/30",
            text: "text-cyan-600 dark:text-cyan-400",
            glow: "group-hover:shadow-[0_0_20px_rgba(34,211,238,0.3)]",
            darkGlow: "dark:group-hover:shadow-[0_0_20px_rgba(34,211,238,0.3)]",
            bgLight: "bg-white border-slate-200"
          },
          {
            label: "In Maintenance",
            value: stats?.maintenance,
            icon: FaTools,
            gradient: "from-pink-600/20 to-pink-900/20",
            border: "border-pink-500/30",
            darkBorder: "dark:border-pink-500/30",
            text: "text-pink-600 dark:text-pink-400",
            glow: "group-hover:shadow-[0_0_20px_rgba(244,114,182,0.3)]",
            darkGlow: "dark:group-hover:shadow-[0_0_20px_rgba(244,114,182,0.3)]",
            bgLight: "bg-white border-slate-200"
          }
        ].map((card, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className={`relative group bg-white dark:bg-slate-900/60 backdrop-blur-xl border border-slate-200 dark:border-white/5 ${card.darkBorder} p-6 rounded-2xl transition-all duration-300 shadow-sm dark:shadow-none hover:shadow-md ${card.darkGlow} overflow-hidden`}
          >
            <div className={`absolute inset-0 bg-gradient-to-br ${card.gradient} opacity-0 dark:opacity-50 transition-opacity duration-300`} />
            <div className="relative z-10 flex items-start justify-between">
              <div>
                <p className="text-slate-500 dark:text-slate-400 text-sm font-medium uppercase tracking-wider transition-colors duration-300">{card.label}</p>
                <h3 className="text-4xl font-bold text-slate-800 dark:text-white mt-2 transition-colors duration-300">{card.value ?? "-"}</h3>
              </div>
              <div className={`p-3 rounded-lg bg-slate-50 dark:bg-slate-950/50 border border-slate-100 dark:border-white/5 ${card.text} transition-colors duration-300`}>
                <card.icon size={24} />
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Chart Section */}
        <motion.div
          initial={{ scale: 0.98, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.4 }}
          className="lg:col-span-2 bg-white dark:bg-slate-900/60 backdrop-blur-xl border border-slate-200 dark:border-white/10 rounded-2xl p-6 shadow-sm dark:shadow-xl transition-all duration-300"
        >
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold text-slate-800 dark:text-white flex items-center gap-2 transition-colors duration-300">
              <FaExclamationTriangle className="text-blue-500 dark:text-cyan-400 transition-colors duration-300" />
              Asset Status Distribution
            </h2>
          </div>

          <div className="h-80 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data}>
                <CartesianGrid strokeDasharray="3 3" stroke={theme === 'dark' ? "#334155" : "#e2e8f0"} opacity={0.5} />
                <XAxis
                  dataKey="name"
                  stroke={theme === 'dark' ? "#94a3b8" : "#64748b"}
                  tick={{ fill: theme === 'dark' ? "#94a3b8" : "#64748b" }}
                  axisLine={{ stroke: theme === 'dark' ? "#475569" : "#cbd5e1" }}
                />
                <YAxis
                  allowDecimals={false}
                  stroke={theme === 'dark' ? "#94a3b8" : "#64748b"}
                  tick={{ fill: theme === 'dark' ? "#94a3b8" : "#64748b" }}
                  axisLine={{ stroke: theme === 'dark' ? "#475569" : "#cbd5e1" }}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: theme === 'dark' ? '#0f172a' : '#ffffff',
                    border: theme === 'dark' ? '1px solid #1e293b' : '1px solid #e2e8f0',
                    borderRadius: '8px',
                    color: theme === 'dark' ? '#fff' : '#1e293b',
                    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                  }}
                  cursor={{ fill: theme === 'dark' ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)' }}
                />
                <Bar dataKey="value" radius={[6, 6, 0, 0]} animationDuration={1500}>
                  {data.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        {/* Recent Assets List */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="bg-white dark:bg-slate-900/60 backdrop-blur-xl border border-slate-200 dark:border-white/10 rounded-2xl p-6 shadow-sm dark:shadow-xl flex flex-col h-[450px] transition-all duration-300"
        >
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-lg font-bold text-slate-800 dark:text-white transition-colors duration-300">Recent Entries</h2>
            <Link to="/assets" className="text-xs text-blue-600 dark:text-cyan-400 hover:text-blue-500 dark:hover:text-cyan-300 uppercase tracking-wider font-semibold transition-colors duration-300">
              View All
            </Link>
          </div>

          <div className="flex-1 overflow-y-auto pr-2 space-y-3 scrollbar-thin scrollbar-thumb-slate-300 dark:scrollbar-thumb-slate-700 scrollbar-track-transparent">
            {recent.length === 0 ? (
              <div className="text-slate-500 text-center py-10">No recent assets found.</div>
            ) : (
              recent.map((asset) => (
                <motion.div
                  key={asset.asset_id}
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="group p-3 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-white/5 hover:bg-slate-100 dark:hover:bg-slate-800/80 hover:border-blue-400 dark:hover:border-cyan-500/30 transition-all cursor-pointer"
                >
                  <Link to={`/assets/${asset.public_id}`} className="flex justify-between items-center">
                    <div>
                      <div className="font-semibold text-slate-700 dark:text-white group-hover:text-blue-600 dark:group-hover:text-cyan-300 transition-colors">
                        {asset.asset_name}
                      </div>
                      <div className="flex items-center gap-2 mt-1">
                        <span className={`w-2 h-2 rounded-full ${asset.status === 'active' ? 'bg-green-500' : 'bg-amber-500'}`}></span>
                        <span className="text-xs text-slate-500 dark:text-slate-400 capitalize">{asset.status}</span>
                      </div>
                    </div>
                    <div className="p-2 rounded-full bg-slate-200 dark:bg-slate-800 text-slate-500 dark:text-slate-400 group-hover:text-blue-600 dark:group-hover:text-white group-hover:bg-blue-100 dark:group-hover:bg-cyan-500/20 transition-all">
                      <FaChevronRight size={12} />
                    </div>
                  </Link>
                </motion.div>
              ))
            )}
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
}
