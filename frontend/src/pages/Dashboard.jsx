import React, { useEffect, useState } from "react";
import API from "../api/api";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";  //ignore this error, react wants Motion not motion
//link ==client side navigstion componenet, prevent page reloads, history api used
//motion == animated version of html react commponents, can use initial , animate, transition
///below resp--barchart main chart container,bar bars isnide chart, axis,tooltip for hover
//cartegrid backgrd grid, responsivecontainer auto-resize chart  

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer
} from "recharts";

export default function Dashboard() {
  const [stats, setStats] = useState(null); //stores data for active, repair etc
  const [recent, setRecent] = useState([]);  //asset list

  //this side effect, runs after first render only, just to get asset list from backend
  useEffect(() => {
    (async () => {
      try {
        const res = await API.get("/assets");
        const list = res.data;  //we get asset array

        const total = list.length;
        const inUse = list.filter(a => a.status === "active").length;
        const maintenance = list.filter(a => a.status === "in-repair").length;

        setStats({ total, inUse, maintenance }); //re-render component on state change
        setRecent(list);
      } catch (err) {
        console.error(err);
        setStats({ total: 0, inUse: 0, maintenance: 0 });
      }
    })(); //fun();
  }, []);
//just wrote, useEffect use async inside another fun or react treats it as synchronous not async
console.log(stats);
console.log(recent);
        // const COLORS = {
        //   Active: "#22c55e",
        //   Maintenance: "#f97316",
        //   Inactive: "#ef4444"
        // };

  return (
    // motion.div is just a div, but it fades in, from framer, initially its invisible then opacity becomes 1 so visible.
    //well simple with framer motion
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-10"
    >

      {/* normal h1+motion with word dashboard, inital is starting pos when component appears 
      20 pixel up,then come to 0 (down) means the final postion, or the position if we remove and place normal h1 only */}

      {/* Header */}
      <motion.h1
        initial={{ y: -20 }}
        animate={{ y: 0 }}
        className="text-3xl font-bold mb-4 text-indigo-950"
      >
        Dashboard
      </motion.h1>

      {/* first div defines animation,not chart yet, inital size of element is 95 percent of its original size,so 5% less
      invisible opac 0,next animate tells final value must be normal size 100 percent and visible,
      time is 0.4s, mb is margin bottom, p is padding.  h2 is normal */}



      {/* Animated Chart Section */}
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.4 }}
        //max-w-4xl-- so that doesnt take whole screen width, mx auto to center
        className="bg-white rounded-xl max-w-4xl mx-auto shadow-lg p-6 mb-10"
      >
        <h2 className="text-lg font-semibold mb-4">Asset Status Overview</h2>


        {/* w-full means width is 100 percent of parent,height is 72 so 288px, its parent div height*
        resposivecontainer comes from recharts , it resizes charts, works only when parent has defined height
        so 100 percent of w and h of parent
        barchart has data of asset status, if stat is null due to error,it dont crash as stat? used, just put 0
        stat is a array in js, stat.inUse means,the value of inUse in it,
        -stat is not an array or map, it is an object defined null initially, and setstat({ total,inuse }) is a short hand term
        used as replace of { total: total, inuse: inuse} so its an object */}

        {/* then cartesian grid, draws background grid line of chart, dashed line,3px line, 3px gap
        xaxis has name such as active, inuse etc.   yaxis decimalis false means only allow whole numbers. */}
        {/* tooltip is for hover,if u hover it automatically shows label and value,ez
        bar actually draw the bar,value is from barchart, fill blue, radius for rounded corners -
        format -top left , top right, bottom right, bottom left. time 900ms */}
        


        <div className="max-w-5xl h-72">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={[
                { name: "Active", value: stats?.inUse || 0 },
                { name: "Maintenance", value: stats?.maintenance || 0 }
              ]}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis allowDecimals={false}/>
              <Tooltip />
              <Bar
                dataKey="value"
                fill="#3b82f6"
                radius={[8, 8, 0, 0]}
                animationDuration={900}
              />
              {/* <Cell fill={.name==="Active"?"#22c55e" : "#f97316"} /> */}
            </BarChart>
          </ResponsiveContainer>
        </div>
      </motion.div>


      {/* grid css layout, make 3 columns, gap is 6 or 24px
      {} in jsx means switch from html mode to js mode 
      from...to is for gradient. from arr of objects inside [] , we use .map
      return react element for each item in arr, motion div is same,
      the delay depends on i (index) so each element pops after other pops.
      bg-gradient-to-br from..to , background colour */}



      {/* Stats Cards */}
      <div className="grid grid-cols-3 gap-6">
        {[
          {
            label: "Total Assets",
            value: stats?.total,
            colors: "from-blue-500 to-blue-700"
          },
          {
            label: "In Use",
            value: stats?.inUse,
            colors: "from-green-500 to-green-700"
          },
          {
            label: "Maintenance",
            value: stats?.maintenance,
            colors: "from-red-500 to-red-700"
          }
        ].map((card, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.15 }}
            className={`bg-gradient-to-br ${card.colors} text-white p-5 rounded-xl shadow-xl hover:scale-[2] transition-transform duration-300`}
          >
            <div className="text-sm opacity-90">{card.label}</div>
            <div className="text-4xl font-bold mt-2">{card.value ?? "—"}</div>
          </motion.div>
        ))}
      </div>

      {/* Recent Assets — with fade-in + scroll */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="bg-white rounded-xl shadow p-6"
      >
        <div className="flex justify-between mb-4">
          <h2 className="text-lg font-semibold">Recent Assets</h2>
          <Link to="/assets" className="text-blue-600">
            View all →
          </Link>
        </div>

        {/* the div below makes the scroll, container max-h mean height cant go taller than 256px
        overflow-y-auto makes scroll. pr-2 means paddign right prevents text from touching scroll bar
        as scrolllbar overlaps content,thats why they seperated. outer div space-y-3 keeps vertical space even when scrolled, so its seperates children.
        we add it outside as each children added from below map has their own div but they work only in their own space not between each other. */}

        <div className="max-h-80 overflow-y-auto pr-2 space-y-3">
          {recent.length === 0 ? (
            <div className="text-gray-500">No assets found.</div>
          ) : (
            recent.map((asset) => (
              <motion.div
                key={asset.asset_id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                className="flex justify-between items-center border p-3 rounded-lg hover:bg-gray-50 transition"
              >
                <div>
                  <div className="font-semibold">{asset.asset_name}</div>
                  <div className="text-sm text-gray-500">
                    Status: {asset.status}
                  </div>
                </div>

                <Link
                  to={`/assets/${asset.asset_id}`}
                  className="text-blue-600 text-sm"
                >
                  View →
                </Link>
              </motion.div>
            ))
          )}
        </div>
      </motion.div>
    </motion.div>
  );
}
