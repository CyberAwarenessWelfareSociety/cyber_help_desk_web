// src/components/Home/Process.jsx
import React from "react";
import { Users, Star, CheckCircle, Award } from "lucide-react";

const steps = [
  {
    icon: <Users className="inline w-8 h-8" />,
    title: "Initial Consultation",
    description: "We assess your situation and gather details.",
  },
  {
    icon: <Star className="inline w-8 h-8" />,
    title: "Customized Action Plan",
    description: "Personalized steps to recover and prevent.",
  },
  {
    icon: <CheckCircle className="inline w-8 h-8" />,
    title: "Implementation & Support",
    description: "We work with you and relevant authorities.",
  },
  {
    icon: <Award className="inline w-8 h-8" />,
    title: "Education & Follow-up",
    description: "Resources and checks to keep you safe.",
  },
];

const Process = () => (
  <section id="process" className="max-w-7xl mx-auto px-6 py-12">
    <div className="mb-8">
      <h2 className="text-3xl font-bold">Our Work Process</h2>
      <p className="text-gray-600 mt-2">
        A clear step-by-step approach to resolve your cyber issues.
      </p>
    </div>

    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
      {steps.map((s, i) => (
        <div key={i} className="bg-white rounded-xl p-6 shadow-sm text-center">
          <div className="text-emerald-600 mb-3">{s.icon}</div>
          <h4 className="font-semibold">{s.title}</h4>
          <p className="text-gray-600 mt-2">{s.description}</p>
        </div>
      ))}
    </div>
  </section>
);

export default Process;
