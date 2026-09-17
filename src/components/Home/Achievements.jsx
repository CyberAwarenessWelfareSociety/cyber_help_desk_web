// src/components/Home/Achievements.jsx
import React from "react";

const achievements = [
  { value: "24/7", label: "Support" },
  { value: "Expert", label: "Team" },
  { value: "Confidential", label: "Assistance" },
  { value: "Proven", label: "Track Record" },
];

const Achievements = () => (
  <section className="bg-emerald-600 text-white py-12">
    <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 sm:grid-cols-4 gap-6">
      {achievements.map((a, i) => (
        <div key={i} className="text-center">
          <div className="text-3xl font-extrabold">{a.value}</div>
          <div className="mt-1">{a.label}</div>
        </div>
      ))}
    </div>
  </section>
);

export default Achievements;
