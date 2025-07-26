import React from "react";

export default function Dashboard() {
  return (
    <div className="container">
      <h2>Dashboard</h2>
      <div className="grid dashboard-stats">
        <div className="card">
          <h3>Total Files</h3>
          <p>--</p>
        </div>
        <div className="card">
          <h3>Total Users</h3>
          <p>--</p>
        </div>
        <div className="card">
          <h3>Recent Uploads</h3>
          <p>--</p>
        </div>
      </div>
    </div>
  );
}
